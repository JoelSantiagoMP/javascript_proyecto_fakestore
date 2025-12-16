// cart.js

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
    console.log(getCartItems());
}

export function removeFromCart(productId) {
    delete cart[productId];
    saveCartToStorage();
}

export function updateQuantity(productId, quantity) {
    if (cart[productId]) {
        cart[productId].quantity = quantity;

        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }

        saveCartToStorage();
    }
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
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : {};
}
