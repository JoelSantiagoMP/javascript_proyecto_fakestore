// cart.js

import { saveToStorage, getFromStorage } from './storage.js';

// =======================
// ESTADO DEL CARRITO
// =======================

let cart = loadCartFromStorage();

// =======================
// FUNCIONES PRINCIPALES
// =======================

export function addToCart(product) {
    const id = product.id;

    if (cart[id]) {
        cart[id].quantity++;
    } else {
        cart[id] = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        };
    }

    saveCartToStorage();
}

export function removeFromCart(productId) {
    delete cart[productId];
    saveCartToStorage();
}

export function updateQuantity(productId, quantity) {
    if (!cart[productId]) return;

    const next = Math.floor(Number(quantity));
    if (!Number.isFinite(next) || next <= 0) {
        delete cart[productId];
    } else {
        cart[productId].quantity = Math.min(next, 99);
    }

    saveCartToStorage();
}

export function clearCart() {
    cart = {};
    saveCartToStorage();
}

// =======================
// CONSULTAS
// =======================

export function getCartItems() {
    return Object.values(cart);
}

export function getTotalItems() {
    return Object.values(cart).reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}

export function getTotalPrice() {
    return Object.values(cart).reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}

// =======================
// LOCAL STORAGE
// =======================

function saveCartToStorage() {
    saveToStorage('cart', cart);
}

function loadCartFromStorage() {
    return getFromStorage('cart', {});
}
