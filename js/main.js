import { fetchProducts } from './api.js';
import { renderProducts } from './products.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Aplicación iniciada');

        const products = await fetchProducts();

        if (!Array.isArray(products)) {
            throw new Error('La respuesta de la API no es un array');
        }

        if (products.length === 0) {
            showMessage('No hay productos disponibles');
            return;
        }

        renderProducts(products);

    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        showMessage('Ocurrió un error al cargar los productos');
    }
});

/* Mostrar mensajes al usuario */
function showMessage(message) {
    const container = document.getElementById('products-container');
    container.innerHTML = `<p class="error-msg">${message}</p>`;
}
