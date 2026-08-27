const NAV_LINKS = [
  { page: "index.html", label: "Accueil" },
  { page: "faq.html", label: "FAQ" },
  { page: "actions.html", label: "Actions" },
  { page: "agenda.html", label: "Agenda" },
  { page: "membres.html", label: "Membres & Collectifs" },
  { page: "shop.html", label: "Boutique & Don" },
  { page: "rejoindre.html", label: "Nous Rejoindre / Nous Contacter" }
];

const SOCIAL_LINKS = [
  { label: "Twitter / X", url: "https://x.com/CMHAntifa" },
  { label: "YouTube", url: "https://www.youtube.com/@CMHA31" },
  { label: "Instagram", url: "https://www.instagram.com/p/DW4HcVOD4FD/" },
  { label: "TikTok", url: "https://www.tiktok.com/@cmhantifacsiste/video/7626422856934624534" },
  { label: "Discord", url: "https://discord.com/invite/DFrY7fwmaU" },
  { label: "Action Populaire", url: "https://actionpopulaire.fr/groupes/d09eb815-b523-4004-b536-73023dfc4c41/" },
  { label: "Ko-fi (Donation et Boutique)", url: "shop.html" }
];

const EVENT_TYPES = {
  tracts: {
    label: "Distribution de tracts",
    color: "#1a73e8",
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4h11l3 3v13H5V4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 4v3h3" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 11h8M8 14h8M8 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
  },
  apero: {
    label: "Apéro militant",
    color: "#f9a825",
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4h14l-6.2 7.4V19h3.2M9.8 19h3.2M9.8 19H6.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 7h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
  },
  rencontre: {
    label: "Rencontre / Meeting",
    color: "#34a853",
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="2.6" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="9.5" r="2.1" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 19c.5-3.2 2.6-5 5-5s4.5 1.8 5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M14.2 14.4c2 .2 3.6 1.8 4 4.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
  },
  congres: {
    label: "Congrès en ligne",
    color: "#9c27b0",
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/><path d="M4 12h16M12 4c2.4 2.2 3.6 5 3.6 8s-1.2 5.8-3.6 8c-2.4-2.2-3.6-5-3.6-8s1.2-5.8 3.6-8z" stroke="currentColor" stroke-width="1.4"/></svg>'
  },
  autre: {
    label: "Action",
    color: "#5f6368",
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11l14-6v14l-14-6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 8.5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7 13.5v3a2 2 0 0 0 2 2h1v-4.6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'
  }
};

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function detectEventType(title) {
  const t = normalizeText(title || "");
  if (t.indexOf("tract") !== -1 || t.indexOf("flyer") !== -1) return "tracts";
  if (t.indexOf("apero") !== -1) return "apero";
  if (t.indexOf("rencontre") !== -1 || t.indexOf("meeting") !== -1) return "rencontre";
  if (t.indexOf("congres") !== -1) return "congres";
  return "autre";
}

function isEventOnline(event) {
  if (event && event.online) return true;
  return detectEventType(event ? event.title : "") === "congres";
}

function eventDateTime(event) {
  const time = event.time ? event.time : "00:00";
  return new Date(event.date + "T" + time + ":00");
}

function formatEventDate(event) {
  const d = eventDateTime(event);
  const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  let label = jours[d.getDay()] + " " + d.getDate() + " " + mois[d.getMonth()] + " " + d.getFullYear();
  if (event.time) label += " à " + event.time;
  return label;
}

function upcomingEvents(events) {
  const source = events || (typeof CMHA_EVENTS !== "undefined" ? CMHA_EVENTS : []);
  const now = new Date();
  const seen = {};
  const deduped = source.filter(e => {
    const key = normalizeText(e.title || "") + "|" + e.date + "|" + (e.time || "") + "|" + normalizeText(e.location || "");
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
  return deduped
    .filter(e => eventDateTime(e) >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .sort((a, b) => eventDateTime(a) - eventDateTime(b));
}

function eventBadge(event) {
  const type = EVENT_TYPES[detectEventType(event.title)];
  return `
    <span class="event-badge" style="background-color:${type.color}22;color:${type.color};">
        <span class="event-badge-icon">${type.icon}</span>
        ${type.label}
    </span>
  `;
}

function currentPageName() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf("/") + 1);
  return file === "" ? "index.html" : file;
}

function sortedArticles() {
  return [...ARTICLES].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const active = currentPageName();
  const links = NAV_LINKS.map(link => {
    const cls = link.page === active ? " class=\"active\"" : "";
    return `<a href="${link.page}"${cls}>${link.label}</a>`;
  }).join("\n        ");
  el.innerHTML = `
    <img src="assets/logo.png" alt="Logo CMHA" style="width: 100px;">
    <br>
    <nav>
        ${links}
    </nav>
  `;
}

function renderSidebar(limit) {
  const el = document.getElementById("site-sidebar");
  if (!el) return;
  const list = limit ? sortedArticles().slice(0, limit) : sortedArticles();
  const items = list.map(article =>
    `<a href="${article.page}">${article.title}</a><span>${article.dateDisplay}</span>`
  ).join("\n            ");
  const socials = SOCIAL_LINKS.map(s => `<a href="${s.url}">${s.label}</a>`).join("\n            ");
  const nextEvents = typeof CMHA_EVENTS !== "undefined" ? upcomingEvents().slice(0, 3) : [];
  const eventsBlock = nextEvents.length
    ? `
    <h3 style="margin-top: 30px;">Prochaines actions</h3>
    <ul class="last-posts">
        <li>
            ${nextEvents.map(ev => `<a href="agenda.html#${ev.id}">${ev.title}</a><span>${formatEventDate(ev)}</span>`).join("\n            ")}
        </li>
    </ul>
    `
    : "";
  el.innerHTML = `
    <h3>Suivez-nous</h3>
    <div class="social-links">
        ${socials}
    </div>
    <h3 style="margin-top: 30px;">Derniers articles</h3>
    <ul class="last-posts">
        <li>
            ${items}
        </li>
    </ul>
    ${eventsBlock}
  `;
}

function articleExcerpt(article) {
  const match = article.body.match(/<p>[\s\S]*?<\/p>/);
  if (match) return match[0];
  const stripped = article.body.replace(/<[^>]+>/g, " ").trim();
  return `<p>${stripped.slice(0, 220)}${stripped.length > 220 ? "..." : ""}</p>`;
}

function postMarkup(article, options) {
  const opts = options || {};
  const img = article.image
    ? `<img src="${article.image}" alt="${article.title}" class="article-banner">`
    : "";
  const content = opts.excerptOnly ? articleExcerpt(article) : article.body;
  const permalink = opts.excerptOnly
    ? `<a href="${article.page}" class="read-more">Lire sur une autre page</a>`
    : "";
  return `
    <article class="post">
        ${img}
        <div class="post-content">
            <span class="post-meta">${article.dateDisplay} - par : ${article.author}</span>
            <h2>${article.title}</h2>
            ${content}
            ${permalink}
        </div>
    </article>
  `;
}

function renderFeed(containerId, options) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const opts = Object.assign({ excerptOnly: true }, options || {});
  const html = sortedArticles().map(article => postMarkup(article, opts)).join("\n");
  el.innerHTML = html;
}

function renderArticle(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const id = el.getAttribute("data-article-id");
  const article = ARTICLES.find(a => a.id === id);
  if (!article) return;
  document.title = `CMHA - ${article.title}`;
  el.innerHTML = postMarkup(article, { excerptOnly: false });
}

function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightbox || !lightboxImg) return;
  lightbox.style.display = "flex";
  lightboxImg.src = src;
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.style.display = "none";
}

document.addEventListener("click", event => {
  const lightbox = document.getElementById("lightbox");
  if (lightbox && event.target === lightbox) closeLightbox();
});

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderSidebar(5);
  renderFeed("articles-feed");
  renderArticle("article-container");
});

document.addEventListener("cmha-events-ready", () => {
  renderSidebar(5);
});
