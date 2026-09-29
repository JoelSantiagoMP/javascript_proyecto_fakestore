import {
    getCartItems,
    getTotalPrice,
    getTotalItems,
    removeFromCart,
    updateQuantity
} from "./cart.js";
import { icon } from "./icons.js";

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

function resetCheckoutConfirm(isEmpty) {
    const checkoutBtn = document.getElementById("checkout-btn");
    const confirmBox = document.getElementById("checkout-confirm");

    if (confirmBox) confirmBox.hidden = true;
    if (!checkoutBtn) return;

    checkoutBtn.hidden = false;
    checkoutBtn.disabled = isEmpty;
}

export function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItemsContainer || !cartTotal) return;

    cartItemsContainer.innerHTML = "";
    const items = getCartItems();
    resetCheckoutConfirm(items.length === 0);

    if (items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">${icon("cart")}</div>
                <p class="status-title">El carrito está vacío</p>
                <p>Agrega productos para verlos aquí.</p>
            </div>
        `;
        cartTotal.textContent = "$0.00";
        updateCartCount();
        return;
    }

    items.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        const title = escapeHtml(item.title);
        const image = escapeHtml(item.image || "");
        const lineTotal = formatPrice(item.price * item.quantity);
        const unitPrice = item.quantity > 1
            ? `<p class="cart-unit">${formatPrice(item.price)} c/u</p>`
            : "";
        const decreaseLabel = item.quantity === 1
            ? `Quitar ${title} del carrito`
            : `Reducir cantidad de ${title}`;

        div.innerHTML = `
            <div class="cart-item-image">
                <img src="${image}" alt="${title}">
            </div>
            <div class="cart-item-details">
                <p class="cart-title">${title}</p>
                <p class="cart-price">${lineTotal}</p>
                ${unitPrice}
                <div class="quantity-controls">
                    <button type="button" class="qty-btn" data-dir="-1" aria-label="${decreaseLabel}">${icon("minus")}</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button type="button" class="qty-btn" data-dir="1" aria-label="Aumentar cantidad de ${title}" ${item.quantity >= 99 ? "disabled" : ""}>${icon("plus")}</button>
                </div>
            </div>
            <button type="button" class="remove-btn" aria-label="Eliminar ${title} del carrito">${icon("trash")}</button>
        `;

        div.querySelectorAll(".qty-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const direction = Number(button.dataset.dir);
                updateQuantity(item.id, item.quantity + direction);
                renderCart();
                updateCartCount();
            });
        });

        div.querySelector(".remove-btn").addEventListener("click", () => {
            removeFromCart(item.id);
            renderCart();
            updateCartCount();
        });

        const imageElement = div.querySelector("img");
        imageElement?.addEventListener("error", () => {
            imageElement.closest(".cart-item-image")?.classList.add("is-broken");
        });

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = formatPrice(getTotalPrice());
    updateCartCount();
}

let lastCount = null;

export function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const cartButton = document.getElementById("open-cart-btn");
    const totalItems = getTotalItems();
    const label = totalItems === 1 ? "1 producto" : `${totalItems} productos`;
    const changed = lastCount !== null && lastCount !== totalItems;
    lastCount = totalItems;

    if (cartButton) {
        cartButton.setAttribute("aria-label", `Abrir carrito, ${label}`);
    }

    if (!cartCount) return;

    cartCount.textContent = String(totalItems);
    cartCount.classList.toggle("is-visible", totalItems > 0);

    if (!changed || totalItems <= 0) return;

    cartCount.classList.remove("is-pop");
    cartButton?.classList.remove("is-bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("is-pop");
    cartButton?.classList.add("is-bump");
}
