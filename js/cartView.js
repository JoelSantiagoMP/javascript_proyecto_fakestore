import {
    getCartItems,
    getTotalPrice,
    getTotalItems,
    removeFromCart,
    updateQuantity
} from "./cart.js";

export function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotal) {
        console.error('No se encontraron los elementos del carrito');
        return;
    }

    cartItemsContainer.innerHTML = '';

    const items = getCartItems();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        updateCartCount();
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');

        // Truncar título si es muy largo
        const shortTitle = item.title.length > 40 
            ? item.title.substring(0, 40) + '...' 
            : item.title;

        div.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <span class="cart-title">${shortTitle}</span>
                <div class="cart-item-controls">
                    <span class="cart-price">$${item.price.toFixed(2)}</span>
                    <div class="quantity-controls">
                        <label for="qty-${item.id}">Cantidad:</label>
                        <input 
                            type="number" 
                            id="qty-${item.id}"
                            min="1" 
                            value="${item.quantity}"
                            class="quantity-input"
                        >
                    </div>
                </div>
            </div>
            <button class="remove-btn" aria-label="Eliminar ${item.title} del carrito">✕</button>
        `;

        const quantityInput = div.querySelector('.quantity-input');
        const removeButton = div.querySelector('.remove-btn');

        quantityInput.addEventListener('change', () => {
            const newQuantity = Number(quantityInput.value);
            if (newQuantity > 0) {
                updateQuantity(item.id, newQuantity);
                renderCart();
                updateCartCount();
            } else {
                quantityInput.value = item.quantity;
            }
        });

        removeButton.addEventListener('click', () => {
            removeFromCart(item.id);
            renderCart();
            updateCartCount();
        });

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `$${getTotalPrice().toFixed(2)}`;
    updateCartCount();
}

// Actualizar el contador del carrito en el header
export function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = getTotalItems();
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}
