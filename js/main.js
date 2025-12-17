import { fetchProducts } from './api.js';
import { renderProducts } from './products.js';
import { renderCart, updateCartCount } from './cartView.js';
import { 
    initializeFilters, 
    applyAllFilters 
} from './filters.js';

// Estado global
let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Aplicación iniciada');

        // Renderizar carrito desde localStorage
        renderCart();
        updateCartCount();

        // Cargar productos desde la API
        const products = await fetchProducts();

        if (!Array.isArray(products)) {
            throw new Error('La respuesta de la API no es un array');
        }

        if (products.length === 0) {
            showMessage('No hay productos disponibles');
            return;
        }

        // Guardar productos y inicializar filtros
        allProducts = products;
        initializeFilters(products);

        // Renderizar productos iniciales
        renderProducts(products);

        // Configurar event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        showMessage('Ocurrió un error al cargar los productos');
    }
});

// Configurar todos los event listeners
function setupEventListeners() {
    // Botón de aplicar filtros
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', handleApplyFilters);
    }

    // Botón de resetear filtros
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', handleResetFilters);
    }

    // Permitir aplicar filtros con Enter en el input de búsqueda
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleApplyFilters();
            }
        });
    }

    // Botón del carrito (abrir modal)
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', openCart);
    }

    // Botón de cerrar carrito
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Overlay para cerrar carrito
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Botón de finalizar compra
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Cerrar carrito con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
}

// Abrir carrito modal
function openCart() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (cart && overlay) {
        cart.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

// Cerrar carrito modal
function closeCart() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (cart && overlay) {
        cart.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// Manejar aplicar filtros
function handleApplyFilters() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value : '';
    applyFiltersAndRender(searchTerm);
}

// Manejar resetear filtros
function handleResetFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // Resetear valores
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'default';
    
    // Aplicar filtros reseteados (mostrar todos)
    applyFiltersAndRender('', 'all', 'default');
}

// Aplicar todos los filtros y renderizar
function applyFiltersAndRender(searchTerm = '', category = null, sortType = null) {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // Si no se pasan parámetros, leer de los inputs
    if (category === null) {
        category = categoryFilter ? categoryFilter.value : 'all';
    }
    if (sortType === null) {
        sortType = sortFilter ? sortFilter.value : 'default';
    }
    
    const filtered = applyAllFilters(searchTerm, category, sortType);
    renderProducts(filtered);
}

// Importar funciones necesarias
import { getCartItems, getTotalPrice } from './cart.js';

// Manejar finalizar compra
function handleCheckout() {
    const items = getCartItems();
    if (items.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const total = getTotalPrice();
    const confirmed = confirm(
        `¿Deseas finalizar la compra?\n\nTotal: $${total.toFixed(2)}\n\nEsta es una aplicación de demostración.`
    );
    
    if (confirmed) {
        alert('¡Gracias por tu compra! (Esta es una aplicación de demostración)');
        // Opcional: limpiar el carrito después de la compra
        // clearCart();
    }
}

/* Mostrar mensajes al usuario */
function showMessage(message) {
    const container = document.getElementById('products-container');
    if (container) {
        container.innerHTML = `<p class="error-msg">${message}</p>`;
    }
}
