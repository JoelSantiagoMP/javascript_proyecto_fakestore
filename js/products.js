import { addToCart } from "./cart.js";
import { renderCart, updateCartCount } from "./cartView.js";
import { formatCategory } from "./filters.js";
import { icon } from "./icons.js";

function openCartModal() {
    const cart = document.getElementById("cart");
    const overlay = document.getElementById("cart-overlay");
    const closeButton = document.getElementById("close-cart-btn");

    if (!cart || !overlay) return;

    cart.inert = false;
    cart.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("cart-open");
    closeButton?.focus();
}

let currentPage = 1;
let itemsPerPage = 8;
let allProducts = [];

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatPrice(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "$0.00";
    return `$${number.toFixed(2)}`;
}

function getPageSize() {
    const container = document.getElementById("products-container");
    const width = container?.clientWidth || 0;

    if (width < 100) return itemsPerPage || 8;

    const rootStyles = getComputedStyle(document.documentElement);
    const minCard = parseFloat(rootStyles.getPropertyValue("--card-min")) || 240;
    const gap = parseFloat(getComputedStyle(container).columnGap) || 20;
    const columns = Math.max(1, Math.floor((width + gap) / (minCard + gap)));

    container.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

    const rows = columns === 1 ? 4 : columns === 2 ? 3 : 2;
    return columns * rows;
}

function updateResultsInfo(start, end, total) {
    const info = document.getElementById("results-info");
    if (!info) return;

    if (!total) {
        info.textContent = "";
        return;
    }

    const label = total === 1 ? "producto" : "productos";
    info.textContent = `Mostrando ${start}–${end} de ${total} ${label}`;
}

function ratingMarkup(rating) {
    const rate = Number(rating?.rate);
    if (!Number.isFinite(rate) || rate <= 0) return "";

    const count = Number(rating?.count);
    const countText = Number.isFinite(count) && count > 0 ? ` (${count})` : "";
    const label = `Valoración ${rate.toFixed(1)} de 5${countText}`;

    return `<p class="product-rating" aria-label="${escapeHtml(label)}">${icon("star")} ${rate.toFixed(1)}${escapeHtml(countText)}</p>`;
}

function pageList(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pages = new Set([1, total, current - 1, current, current + 1]);
    return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

function createPageButton(label, className, disabled, onClick, ariaLabel, markup = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    if (markup) button.innerHTML = markup;
    else button.textContent = label;
    button.disabled = disabled;
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    button.addEventListener("click", onClick);
    return button;
}

function renderPaginationControls(totalPages) {
    const container = document.getElementById("pagination-controls");
    if (!container) return;

    container.innerHTML = "";
    if (totalPages <= 1) return;

    container.append(
        createPageButton("", "pagination-btn pagination-nav", currentPage === 1, () => {
            if (currentPage > 1) goToPage(currentPage - 1);
        }, "Página anterior", icon("chevron-left"))
    );

    let previous = 0;
    pageList(currentPage, totalPages).forEach((page) => {
        if (page - previous > 1) {
            const ellipsis = document.createElement("span");
            ellipsis.className = "pagination-ellipsis";
            ellipsis.textContent = "…";
            ellipsis.setAttribute("aria-hidden", "true");
            container.append(ellipsis);
        }

        const button = createPageButton(
            String(page),
            `pagination-btn${page === currentPage ? " active" : ""}`,
            false,
            () => goToPage(page),
            `Página ${page}`
        );

        if (page === currentPage) button.setAttribute("aria-current", "page");
        container.append(button);
        previous = page;
    });

    container.append(
        createPageButton("", "pagination-btn pagination-nav", currentPage === totalPages, () => {
            if (currentPage < totalPages) goToPage(currentPage + 1);
        }, "Página siguiente", icon("chevron-right"))
    );
}

function renderCurrentPage({ scroll = false } = {}) {
    const total = allProducts.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    if (total === 0) {
        renderProducts([]);
        renderPaginationControls(0);
        updateResultsInfo(0, 0, 0);
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const slice = allProducts.slice(start, start + itemsPerPage);

    renderProducts(slice);
    renderPaginationControls(totalPages);
    updateResultsInfo(start + 1, start + slice.length, total);

    if (scroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function goToPage(page) {
    currentPage = page;
    renderCurrentPage({ scroll: true });
}

export function setupPagination(products, { resetPage = false, scroll = false } = {}) {
    allProducts = Array.isArray(products) ? products : [];
    itemsPerPage = getPageSize();

    const totalPages = Math.max(1, Math.ceil(allProducts.length / itemsPerPage));
    if (resetPage || currentPage > totalPages || currentPage < 1) {
        currentPage = 1;
    }

    renderCurrentPage({ scroll });
}

function markBrokenImage(image) {
    image.addEventListener("error", () => {
        image.closest(".product-image-container")?.classList.add("is-broken");
    });
}

export function renderProducts(products) {
    const productsContainer = document.getElementById("products-container");

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="status-panel status-panel--inline">
                <div class="status-icon">${icon("search")}</div>
                <p class="status-title">No se encontraron productos</p>
                <p>Prueba con otra búsqueda o reinicia los filtros.</p>
            </div>
        `;
        return;
    }

    products.forEach((product) => {
        const card = document.createElement("article");
        card.classList.add("product-card");

        const title = escapeHtml(product.title);
        const description = escapeHtml(product.description || "");
        const category = escapeHtml(formatCategory(product.category));
        const image = escapeHtml(product.image || "");

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${image}" alt="${title}" loading="lazy" decoding="async">
            </div>
            <div class="product-info">
                <span class="product-category">${category}</span>
                <h3 class="product-title">${title}</h3>
                ${ratingMarkup(product.rating)}
                <p class="product-description">${description}</p>
                <div class="product-footer">
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <button type="button" class="add-to-cart-btn" aria-label="Agregar ${title} al carrito">
                        <span class="icon-add">${icon("cart")}</span>
                        <span class="icon-ok">${icon("check")}</span>
                        <span class="label-idle">
                            <span class="btn-label-full">Agregar al carrito</span>
                            <span class="btn-label-short">Agregar</span>
                        </span>
                        <span class="label-done">Agregado</span>
                    </button>
                </div>
            </div>
        `;

        const imageElement = card.querySelector("img");
        if (imageElement) markBrokenImage(imageElement);

        const button = card.querySelector(".add-to-cart-btn");
        button.addEventListener("click", () => {
            addToCart(product);
            renderCart();
            updateCartCount();
            openCartModal();

            button.classList.add("added");
            window.setTimeout(() => {
                button.classList.remove("added");
            }, 1500);
        });

        productsContainer.appendChild(card);
    });
}

let resizeTimer;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        if (allProducts.length === 0) return;

        const nextSize = getPageSize();
        if (nextSize === itemsPerPage) return;

        itemsPerPage = nextSize;
        const totalPages = Math.max(1, Math.ceil(allProducts.length / itemsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;
        renderCurrentPage();
    }, 150);
});
