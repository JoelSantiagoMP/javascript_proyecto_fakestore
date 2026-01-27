import { addToCart } from "./cart.js";
import { renderCart, updateCartCount } from "./cartView.js";

//Función para abrir el modal del carrito

function openCartModal() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (cart && overlay) {
        cart.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

let currentPage = 1;
let itemsPerPage = 8;
let allProducts = []; 

// 1. Esta función ahora solo DEVUELVE el número, así la puedes usar donde quieras
function getCalculatedItems() {
    const width = window.innerWidth;
    if (width > 1024) return 8; 
    if (width <= 1024 && width > 768) return 9;
    if (width <= 768 && width > 480) return 6;
    return 4;
}

// 2. Tu función updateLayout simplificada
function updateLayout() {
    const newItems = getCalculatedItems();
    
    // Solo refrescamos si de verdad cambió el número de columnas
    if (newItems !== itemsPerPage) {
        itemsPerPage = newItems;
        if (allProducts.length > 0) {
            setupPagination(allProducts);
        }
    }
}

export function setupPagination(products) {
    allProducts = products; 
    
    // USAMOS LA NUEVA FUNCIÓN AQUÍ
    itemsPerPage = getCalculatedItems(); 

    const totalPages = Math.ceil(allProducts.length / itemsPerPage);

    if (currentPage > totalPages || currentPage < 1) {
        currentPage = 1;
    }

    const displayPage = (page) => {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsToRender = allProducts.slice(start, end);

        renderProducts(productsToRender);
        renderPaginationControls(totalPages);
    };

    displayPage(currentPage);
}


function renderPaginationControls(totalPages) {
    const container = document.getElementById("pagination-controls");
    if (!container) return;
    container.innerHTML = '';
    if (totalPages <= 1) return;

    // --- Botón Anterior (Opcional pero recomendado) ---
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '&laquo;'; // Flecha izquierda
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { if(currentPage > 1) goToPage(currentPage - 1); };
    container.appendChild(prevBtn);

    // --- Números de página ---
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => goToPage(i);
        container.appendChild(btn);
    }

    // --- Botón Siguiente (Opcional pero recomendado) ---
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '&raquo;'; // Flecha derecha
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { if(currentPage < totalPages) goToPage(currentPage + 1); };
    container.appendChild(nextBtn);
}

// Función auxiliar para no repetir código
function goToPage(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    renderProducts(allProducts.slice(start, end));
    
    // Recalculamos el total de páginas por si acaso
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    renderPaginationControls(totalPages);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

            //Truncar descripción si es muy larga
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
            
            //Abrir carrito automáticamente
               openCartModal();
            
                //Feedback visual
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

window.addEventListener('resize', updateLayout);