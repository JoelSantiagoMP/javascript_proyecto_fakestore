import { fetchProducts } from "./api.js";
import { setupPagination } from "./products.js";
import { renderCart, updateCartCount } from "./cartView.js";
import { getCartItems, getTotalPrice, clearCart } from "./cart.js";
import { initializeFilters, applyAllFilters } from "./filters.js";
import { icon } from "./icons.js";

let toastTimer = null;
let loadingProducts = false;

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    updateCartCount();
    setupEventListeners();
    loadProducts();
});

async function loadProducts() {
    if (loadingProducts) return;

    loadingProducts = true;
    showLoading();

    try {
        const result = await fetchProducts();
        initializeFilters(result.products);
        hideStatus();
        showBanner(result.source === "fallback" ? result.message : "");
        setupPagination(result.products, { resetPage: true });
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
        showError(error.message || "Ocurrió un error al cargar los productos");
    } finally {
        loadingProducts = false;
    }
}

function setupEventListeners() {
    document.getElementById("apply-filters-btn")?.addEventListener("click", handleApplyFilters);
    document.getElementById("reset-filters-btn")?.addEventListener("click", handleResetFilters);

    document.getElementById("search-input")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleApplyFilters();
        }
    });

    document.getElementById("open-cart-btn")?.addEventListener("click", openCart);
    document.getElementById("close-cart-btn")?.addEventListener("click", closeCart);
    document.getElementById("cart-overlay")?.addEventListener("click", closeCart);
    document.getElementById("checkout-btn")?.addEventListener("click", showCheckoutConfirm);
    document.getElementById("cancel-checkout-btn")?.addEventListener("click", hideCheckoutConfirm);
    document.getElementById("confirm-checkout-btn")?.addEventListener("click", handleCheckout);

    document.querySelector(".main-content")?.addEventListener("click", (event) => {
        if (event.target.closest("#retry-btn, #retry-api-btn")) {
            loadProducts();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeCart();
    });
}

function openCart() {
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

function closeCart() {
    const cart = document.getElementById("cart");
    const overlay = document.getElementById("cart-overlay");
    const openButton = document.getElementById("open-cart-btn");

    if (!cart || !overlay || !cart.classList.contains("active")) return;

    cart.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("cart-open");
    hideCheckoutConfirm();
    cart.inert = true;
    openButton?.focus();
}

function handleApplyFilters() {
    const searchTerm = document.getElementById("search-input")?.value || "";
    applyFiltersAndRender(searchTerm);
}

function handleResetFilters() {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");

    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (sortFilter) sortFilter.value = "default";

    applyFiltersAndRender("", "all", "default");
}

function applyFiltersAndRender(searchTerm = "", category = null, sortType = null) {
    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");

    if (category === null) category = categoryFilter ? categoryFilter.value : "all";
    if (sortType === null) sortType = sortFilter ? sortFilter.value : "default";

    const filtered = applyAllFilters(searchTerm, category, sortType);
    setupPagination(filtered, { resetPage: true, scroll: true });
}

function showCheckoutConfirm() {
    if (getCartItems().length === 0) {
        showToast("El carrito está vacío");
        return;
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    const confirmBox = document.getElementById("checkout-confirm");
    if (!checkoutBtn || !confirmBox) return;

    checkoutBtn.hidden = true;
    confirmBox.hidden = false;
}

function hideCheckoutConfirm() {
    const checkoutBtn = document.getElementById("checkout-btn");
    const confirmBox = document.getElementById("checkout-confirm");
    if (checkoutBtn) checkoutBtn.hidden = false;
    if (confirmBox) confirmBox.hidden = true;
}

function handleCheckout() {
    const items = getCartItems();
    if (items.length === 0) {
        hideCheckoutConfirm();
        showToast("El carrito está vacío");
        return;
    }

    const total = getTotalPrice();
    clearCart();
    renderCart();
    updateCartCount();
    closeCart();
    window.setTimeout(() => {
        showToast(`Compra de demostración registrada por $${total.toFixed(2)}`);
    }, 280);
}

function showLoading() {
    const panel = document.getElementById("status-panel");
    const banner = document.getElementById("api-banner");
    const products = document.getElementById("products-container");
    const pagination = document.getElementById("pagination-controls");
    const results = document.getElementById("results-info");

    if (banner) {
        banner.hidden = true;
        banner.textContent = "";
    }
    if (products) products.innerHTML = "";
    if (pagination) pagination.innerHTML = "";
    if (results) results.textContent = "";

    if (!panel) return;

    panel.hidden = false;
    panel.innerHTML = `
        <div class="spinner" aria-hidden="true"></div>
        <p>Cargando productos…</p>
    `;
}

function hideStatus() {
    const panel = document.getElementById("status-panel");
    if (!panel) return;
    panel.hidden = true;
    panel.innerHTML = "";
}

function showError(message) {
    const panel = document.getElementById("status-panel");
    const products = document.getElementById("products-container");
    const pagination = document.getElementById("pagination-controls");
    const results = document.getElementById("results-info");

    if (products) products.innerHTML = "";
    if (pagination) pagination.innerHTML = "";
    if (results) results.textContent = "";
    if (!panel) return;

    panel.hidden = false;
    panel.innerHTML = `
        <div class="status-icon">${icon("info")}</div>
        <p class="status-title">No se pudieron cargar los productos</p>
        <p>${escapeHtml(message)}</p>
        <button type="button" id="retry-btn" class="apply-btn">${icon("refresh")} Reintentar</button>
    `;
}

function showBanner(message) {
    const banner = document.getElementById("api-banner");
    if (!banner) return;

    if (!message) {
        banner.hidden = true;
        banner.innerHTML = "";
        return;
    }

    banner.hidden = false;
    banner.innerHTML = `
        ${icon("info")}
        <span>${escapeHtml(message)}</span>
        <button type="button" id="retry-api-btn" class="text-btn">Reintentar</button>
    `;
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerHTML = `${icon("check")}<span>${escapeHtml(message)}</span>`;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
    }, 2800);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
