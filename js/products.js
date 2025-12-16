import { addToCart } from "./cart.js";
import { renderCart } from "./cartView.js";

export function renderProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button>
                Agregar al carrito
            </button>
        `;

        const button = card.querySelector('button');

        button.addEventListener('click', () => {
            addToCart(product);
            renderCart();
        });

        productsContainer.appendChild(card);
    });
}
