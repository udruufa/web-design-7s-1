const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".work-card, .code-card");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;

    filters.forEach((item) => item.classList.remove("is-active"));
    filter.classList.add("is-active");

    currentFilter = selected;
    layoutGallery();
  });
});

const grid = document.getElementById("portfolioGrid");
let currentFilter = "all";
let currentCols = 0;

function columnCount() {
  const w = window.innerWidth;
  return w >= 1100 ? 3 : w >= 760 ? 2 : 1;
}

function cardRatio(card) {
  const img = card.querySelector("img");
  if (img) return img.height / img.width;
  return 1.1; 
}

function layoutGallery() {
  const n = columnCount();
  currentCols = n;
  const heights = new Array(n).fill(0);
  const cols = Array.from({ length: n }, () => {
    const col = document.createElement("div");
    col.className = "masonry-col";
    return col;
  });

  cards.forEach((card) => {
    const matches = currentFilter === "all" || card.dataset.category === currentFilter;
    if (!matches) return;
    let target = 0;
    for (let i = 1; i < n; i++) if (heights[i] < heights[target]) target = i;
    cols[target].appendChild(card);
    heights[target] += cardRatio(card) + 0.12;
  });

  grid.replaceChildren(...cols);
  grid.classList.add("is-masonry");
}

layoutGallery();
window.addEventListener("resize", () => {
  if (columnCount() !== currentCols) layoutGallery();
});

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");

document.querySelectorAll(".work-card").forEach((card) => {
  card.addEventListener("click", () => {
    modalImage.src = card.dataset.image;
    modalImage.alt = card.querySelector("img").alt;
    modalTitle.textContent = card.dataset.title;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

const heroTitle = document.querySelector(".hero-title");
const heroWord = document.getElementById("heroWord");

function fitHeroWord() {
  if (!heroTitle || !heroWord) return;
  heroTitle.style.fontSize = "100px";
  const ratio = heroTitle.clientWidth / heroWord.getBoundingClientRect().width;
  heroTitle.style.fontSize = 100 * ratio + "px";
}

fitHeroWord();
window.addEventListener("resize", fitHeroWord);
if (document.fonts) {
  document.fonts.ready.then(fitHeroWord);
  document.fonts.addEventListener("loadingdone", fitHeroWord);
}
