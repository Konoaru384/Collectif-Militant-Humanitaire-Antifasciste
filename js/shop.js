const SHOP_TABS = [
  { key: "global", label: "Tout" },
  { key: "affiches", label: "Affiches-Stickers" },
  { key: "stickers", label: "Stickers" },
  { key: "personnalise", label: "Personnalisé" },
  { key: "don", label: "Faire un don" }
];

let currentTab = "global";
let currentModalItem = null;
let currentModalIndex = 0;

function renderShopTabs() {
  const el = document.getElementById("shop-tabs");
  el.innerHTML = SHOP_TABS.map(tab => {
    const cls = tab.key === currentTab ? "shop-tab active" : "shop-tab";
    return `<button class="${cls}" data-tab="${tab.key}">${tab.label}</button>`;
  }).join("");
  el.querySelectorAll(".shop-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      currentTab = btn.getAttribute("data-tab");
      renderShopTabs();
      renderShopBody();
    });
  });
}

function priceLabel(item) {
  if (item.priceFrom) return `À partir de ${item.priceFrom} €`;
  return "Prix indiqué sur Ko-fi";
}

function productCard(item) {
  const hasMultiple = item.images.length > 1;
  const dots = hasMultiple
    ? `<div class="thumb-dots">${item.images.map((_, i) => `<span class="thumb-dot${i === 0 ? " active" : ""}"></span>`).join("")}</div>`
    : "";
  return `
    <div class="product-card">
        <div class="product-thumb-wrap" data-id="${item.id}">
            <img src="${item.images[0]}" alt="${item.title}" class="product-thumb">
            ${dots}
        </div>
        <div class="product-card-body">
            <h3>${item.title}</h3>
            <span class="product-price">${priceLabel(item)}</span>
            <button class="btn-see-more" data-id="${item.id}">Voir plus</button>
        </div>
    </div>
  `;
}

function bindThumbPreview(el) {
  el.querySelectorAll(".product-thumb-wrap").forEach(wrap => {
    const id = wrap.getAttribute("data-id");
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item || item.images.length < 2) return;
    const img = wrap.querySelector(".product-thumb");
    const dots = wrap.querySelectorAll(".thumb-dot");
    const setIndex = index => {
      img.src = item.images[index];
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    };
    wrap.addEventListener("mousemove", event => {
      const rect = wrap.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      let index = Math.floor(ratio * item.images.length);
      if (index < 0) index = 0;
      if (index > item.images.length - 1) index = item.images.length - 1;
      setIndex(index);
    });
    wrap.addEventListener("mouseleave", () => setIndex(0));
  });
}

function renderShopBody() {
  const el = document.getElementById("shop-body");
  if (currentTab === "don") {
    el.innerHTML = `
      <div class="donate-panel">
        <h2>Soutenez le CMHA</h2>
        <p>Chaque don nous permet de financer nos actions : impressions, stickers, déplacements et matériel militant.</p>
        <iframe id="kofiframe" src="https://ko-fi.com/cmha31/?hidefeed=true&widget=true&embed=true&preview=true" style="border:none;width:100%;padding:4px;background:#f9f9f9;" height="712" title="cmha31"></iframe>
      </div>
    `;
    return;
  }
  const items = currentTab === "global"
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(item => item.category === currentTab);
  el.innerHTML = `<div class="shop-grid">${items.map(productCard).join("")}</div>`;
  el.querySelectorAll(".btn-see-more").forEach(btn => {
    btn.addEventListener("click", () => openProductModal(btn.getAttribute("data-id")));
  });
  bindThumbPreview(el);
}

function openProductModal(id) {
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item) return;
  currentModalItem = item;
  currentModalIndex = 0;
  renderModalImage();
  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-description").textContent = item.description;
  document.getElementById("modal-price").textContent = priceLabel(item);
  document.getElementById("modal-order-link").href = item.koFiUrl;
  document.getElementById("modal-arrows").style.display = item.images.length > 1 ? "flex" : "none";
  document.getElementById("product-modal").style.display = "flex";
}

function renderModalImage() {
  const img = document.getElementById("modal-image");
  img.src = currentModalItem.images[currentModalIndex];
  const dotsEl = document.getElementById("modal-dots");
  dotsEl.innerHTML = currentModalItem.images.map((_, i) =>
    `<span class="modal-dot${i === currentModalIndex ? " active" : ""}"></span>`
  ).join("");
}

function closeProductModal() {
  document.getElementById("product-modal").style.display = "none";
  currentModalItem = null;
}

function modalPrev() {
  if (!currentModalItem) return;
  currentModalIndex = (currentModalIndex - 1 + currentModalItem.images.length) % currentModalItem.images.length;
  renderModalImage();
}

function modalNext() {
  if (!currentModalItem) return;
  currentModalIndex = (currentModalIndex + 1) % currentModalItem.images.length;
  renderModalImage();
}

document.addEventListener("DOMContentLoaded", () => {
  renderShopTabs();
  renderShopBody();
  document.getElementById("modal-close").addEventListener("click", closeProductModal);
  document.getElementById("modal-prev").addEventListener("click", modalPrev);
  document.getElementById("modal-next").addEventListener("click", modalNext);
  document.getElementById("product-modal").addEventListener("click", event => {
    if (event.target.id === "product-modal") closeProductModal();
  });
});
