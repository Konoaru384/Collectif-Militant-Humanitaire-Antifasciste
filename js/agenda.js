var CMHA_CALENDAR_EMAIL = "cmhantifasciste@gmail.com";
var CMHA_CALENDAR_ICS_URL = "https://calendar.google.com/calendar/ical/" + encodeURIComponent(CMHA_CALENDAR_EMAIL) + "/public/basic.ics";
var CMHA_CALENDAR_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?url=",
  "https://api.codetabs.com/v1/proxy?quest="
];
var CMHA_EVENTS_STATUS = "loading";
var CMHA_GEOCODE_CACHE = {};

function normalizeAgendaText(value) {
  return (value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function extractLinkByDomain(text, domain) {
  if (!text) return null;
  var pattern = new RegExp("https?:\\/\\/(www\\.)?" + domain.replace(".", "\\.") + "\\S*", "i");
  var match = text.match(pattern);
  if (!match) return null;
  return match[0].replace(/[)\]}>."',]+$/, "");
}

function findActionPopulaireLink(text) {
  return extractLinkByDomain(text, "actionpopulaire.fr");
}

function isLocationOnline(text) {
  var t = normalizeAgendaText(text);
  return t.indexOf("en ligne") !== -1 ||
    t.indexOf("visio") !== -1 ||
    t.indexOf("zoom") !== -1 ||
    t.indexOf("meet.google") !== -1 ||
    t.indexOf("discord") !== -1;
}

function isOnlineHintInDescription(text) {
  var t = normalizeAgendaText(text);
  return t.indexOf("en ligne") !== -1 ||
    t.indexOf("visio") !== -1 ||
    t.indexOf("zoom") !== -1 ||
    t.indexOf("meet.google") !== -1;
}

function fetchWithTimeout(url, ms) {
  var controller = new AbortController();
  var timer = setTimeout(function () { controller.abort(); }, ms);
  return fetch(url, { signal: controller.signal }).finally(function () {
    clearTimeout(timer);
  });
}

function geocodeLocation(query) {
  if (CMHA_GEOCODE_CACHE[query]) return Promise.resolve(CMHA_GEOCODE_CACHE[query]);

  function fromPhoton() {
    var url = "https://photon.komoot.io/api/?limit=1&lang=fr&q=" + encodeURIComponent(query);
    return fetchWithTimeout(url, 4000)
      .then(function (response) {
        if (!response.ok) throw new Error("photon-failed");
        return response.json();
      })
      .then(function (data) {
        var feature = data && data.features && data.features[0];
        if (!feature) return null;
        var coords = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] };
        CMHA_GEOCODE_CACHE[query] = coords;
        return coords;
      })
      .catch(function () {
        return null;
      });
  }

  function fromNominatim() {
    var directUrl = "https://nominatim.openstreetmap.org/search?format=json&limit=1&email=" +
      encodeURIComponent(CMHA_CALENDAR_EMAIL) + "&q=" + encodeURIComponent(query);

    function parseAndCache(data) {
      if (!data || !data[0]) return null;
      var coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      CMHA_GEOCODE_CACHE[query] = coords;
      return coords;
    }

    function tryProxy(proxyIndex) {
      if (proxyIndex >= CMHA_CALENDAR_PROXIES.length) return null;
      var proxyUrl = CMHA_CALENDAR_PROXIES[proxyIndex] + encodeURIComponent(directUrl);
      return fetchWithTimeout(proxyUrl, 4000)
        .then(function (response) {
          if (!response.ok) throw new Error("geocode-proxy-failed");
          return response.json();
        })
        .then(parseAndCache)
        .catch(function () {
          return tryProxy(proxyIndex + 1);
        });
    }

    return fetchWithTimeout(directUrl, 4000)
      .then(function (response) {
        if (!response.ok) throw new Error("geocode-failed");
        return response.json();
      })
      .then(parseAndCache)
      .catch(function () {
        return tryProxy(0);
      });
  }

  return fromPhoton().then(function (coords) {
    return coords ? coords : fromNominatim();
  });
}

function announceEventsReady() {
  document.dispatchEvent(new CustomEvent("cmha-events-ready"));
}

function unfoldIcsText(text) {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

function decodeIcsValue(value) {
  return (value || "")
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function padIcsNumber(value) {
  return String(value).length < 2 ? "0" + value : String(value);
}

function parseIcsDateValue(value) {
  var isUtc = value.charAt(value.length - 1) === "Z";
  var digits = isUtc ? value.substring(0, value.length - 1) : value;
  var year = digits.substring(0, 4);
  var month = digits.substring(4, 6);
  var day = digits.substring(6, 8);
  var hasTime = digits.length > 8;
  var hour = hasTime ? digits.substring(9, 11) : "";
  var minute = hasTime ? digits.substring(11, 13) : "";
  var second = hasTime ? digits.substring(13, 15) : "00";

  if (!hasTime) {
    return { date: year + "-" + month + "-" + day, time: "" };
  }

  if (isUtc) {
    var utcDate = new Date(Date.UTC(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    ));
    return {
      date: utcDate.getFullYear() + "-" + padIcsNumber(utcDate.getMonth() + 1) + "-" + padIcsNumber(utcDate.getDate()),
      time: padIcsNumber(utcDate.getHours()) + ":" + padIcsNumber(utcDate.getMinutes())
    };
  }

  return { date: year + "-" + month + "-" + day, time: hour + ":" + minute };
}

function parseIcsLineField(line) {
  var separatorIndex = line.indexOf(":");
  if (separatorIndex === -1) return null;
  var rawKey = line.substring(0, separatorIndex);
  var value = line.substring(separatorIndex + 1);
  var key = rawKey.split(";")[0].toUpperCase();
  return { key: key, value: value };
}

function slugifyIcsTitle(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseIcsToEvents(icsText) {
  var lines = unfoldIcsText(icsText).split("\n");
  var events = [];
  var current = null;

  lines.forEach(function (rawLine) {
    var line = rawLine.trim();
    if (line === "BEGIN:VEVENT") {
      current = {};
      return;
    }
    if (line === "END:VEVENT") {
      if (current && current.summary && current.dtstart) {
        var parsedDate = parseIcsDateValue(current.dtstart);
        var location = decodeIcsValue(current.location || "");
        var description = decodeIcsValue(current.description || "");
        var title = decodeIcsValue(current.summary || "");
        var online = isLocationOnline(location) || isOnlineHintInDescription(description);
        var actionPopulaireLink = findActionPopulaireLink(description) || findActionPopulaireLink(location) || "";
        var link = current.url ? decodeIcsValue(current.url) : "";
        var id = current.uid ? slugifyIcsTitle(current.uid.split("@")[0]) : (slugifyIcsTitle(title) + "-" + parsedDate.date);
        events.push({
          id: id,
          title: title,
          date: parsedDate.date,
          time: parsedDate.time,
          location: online ? "" : location,
          online: online,
          description: description,
          actionPopulaireLink: actionPopulaireLink,
          link: link
        });
      }
      current = null;
      return;
    }
    if (!current) return;
    var field = parseIcsLineField(line);
    if (!field) return;
    if (field.key === "SUMMARY") current.summary = field.value;
    if (field.key === "DTSTART") current.dtstart = field.value;
    if (field.key === "LOCATION") current.location = field.value;
    if (field.key === "DESCRIPTION") current.description = field.value;
    if (field.key === "UID") current.uid = field.value;
    if (field.key === "URL") current.url = field.value;
  });

  return events;
}

function fetchIcsViaProxy(proxyIndex) {
  if (proxyIndex >= CMHA_CALENDAR_PROXIES.length) return Promise.reject(new Error("all-proxies-failed"));
  var proxyUrl = CMHA_CALENDAR_PROXIES[proxyIndex] + encodeURIComponent(CMHA_CALENDAR_ICS_URL);
  return fetch(proxyUrl)
    .then(function (response) {
      if (!response.ok) throw new Error("proxy-failed");
      return response.text();
    })
    .catch(function () {
      return fetchIcsViaProxy(proxyIndex + 1);
    });
}

function loadGoogleCalendarEvents() {
  fetchIcsViaProxy(0)
    .then(function (icsText) {
      var parsedEvents = parseIcsToEvents(icsText);
      if (parsedEvents.length > 0) {
        CMHA_EVENTS = parsedEvents;
      }
      CMHA_EVENTS_STATUS = "synced";
      announceEventsReady();
    })
    .catch(function () {
      CMHA_EVENTS_STATUS = "fallback";
      announceEventsReady();
    });
}

document.addEventListener("DOMContentLoaded", loadGoogleCalendarEvents);
