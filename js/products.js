import { addToCart } from "./cart.js";
import { renderCart, updateCartCount } from "./cartView.js";

// Función para abrir el modal del carrito
function openCartModal() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (cart && overlay) {
        cart.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

export function renderProducts(products) {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) {
        console.error('No se encontró el contenedor de productos');
        return;
    }

    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No se encontraron productos</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        // Truncar descripción si es muy larga
        const description = product.description || '';
        const shortDescription = description.length > 100 
            ? description.substring(0, 100) + '...' 
            : description;

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category || 'Sin categoría'}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${shortDescription}</p>
                <div class="product-footer">
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" aria-label="Agregar ${product.title} al carrito">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;

        const button = card.querySelector('.add-to-cart-btn');

        button.addEventListener('click', () => {
            addToCart(product);
            renderCart();
            updateCartCount();
            
            // Abrir carrito automáticamente
            openCartModal();
            
            // Feedback visual
            button.textContent = '✓ Agregado';
            button.classList.add('added');
            setTimeout(() => {
                button.textContent = 'Agregar al carrito';
                button.classList.remove('added');
            }, 1500);
        });

        productsContainer.appendChild(card);
    });
}
