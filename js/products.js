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
            <button data-id="${product.id}">
                Agregar al carrito
            </button>
        `;

        productsContainer.appendChild(card);
    });
}
