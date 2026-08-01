const NAV_LINKS = [
  { page: "index.html", label: "Accueil" },
  { page: "faq.html", label: "FAQ" },
  { page: "actions.html", label: "Actions" },
  { page: "membres.html", label: "Membres & Collectifs" },
  { page: "shop.html", label: "Boutique & Don" },
  { page: "rejoindre.html", label: "Nous Rejoindre / Nous Contacter" }
];

const SOCIAL_LINKS = [
  { label: "YouTube", url: "https://www.youtube.com/@CMHA31" },
  { label: "Instagram", url: "https://www.instagram.com/p/DW4HcVOD4FD/" },
  { label: "TikTok", url: "https://www.tiktok.com/@cmhantifacsiste/video/7626422856934624534" },
  { label: "Discord", url: "https://discord.com/invite/DFrY7fwmaU" },
  { label: "Action Populaire", url: "https://actionpopulaire.fr/groupes/d09eb815-b523-4004-b536-73023dfc4c41/" },
  { label: "Ko-fi (Donation et Boutique)", url: "shop.html" }
];

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
  `;
}

function postMarkup(article, options) {
  const opts = options || {};
  const img = article.image
    ? `<img src="${article.image}" alt="${article.title}" class="article-banner">`
    : "";
  const permalink = opts.showPermalink
    ? `<a href="${article.page}" class="read-more">Lien permanent vers cet article</a>`
    : "";
  return `
    <article class="post">
        ${img}
        <div class="post-content">
            <span class="post-meta">${article.dateDisplay} - par : ${article.author}</span>
            <h2>${article.title}</h2>
            ${article.body}
            ${permalink}
        </div>
    </article>
  `;
}

function renderFeed(containerId, options) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const html = sortedArticles().map(article => postMarkup(article, options)).join("\n");
  el.innerHTML = html;
}

function renderArticle(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const id = el.getAttribute("data-article-id");
  const article = ARTICLES.find(a => a.id === id);
  if (!article) return;
  document.title = `CMHA - ${article.title}`;
  el.innerHTML = postMarkup(article, { showPermalink: false });
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
