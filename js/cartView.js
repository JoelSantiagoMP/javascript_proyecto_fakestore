import {
    getCartItems,
    getTotalPrice,
    removeFromCart,
    updateQuantity
} from "./cart.js";

export function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';

    const items = getCartItems();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p>El carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');

        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <span class="cart-title">${item.title}</span>
            <span class="cart-price">$${item.price}</span>
            <input type="number" min="1" value="${item.quantity}">
            <button class="remove-btn">✕</button>
        `;

        const quantityInput = div.querySelector('input');
        const removeButton = div.querySelector('.remove-btn');

        quantityInput.addEventListener('change', () => {
            updateQuantity(item.id, Number(quantityInput.value));
            renderCart();
        });

        removeButton.addEventListener('click', () => {
            removeFromCart(item.id);
            renderCart();
        });

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `$${getTotalPrice().toFixed(2)}`;
}
