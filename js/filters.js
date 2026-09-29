// filters.js

const CATEGORY_LABELS = {
    electronics: "Electrónica",
    jewelery: "Joyería",
    jewelry: "Joyería",
    "men's clothing": "Ropa de hombre",
    "women's clothing": "Ropa de mujer",
    beauty: "Belleza",
    fragrances: "Fragancias",
    furniture: "Muebles",
    groceries: "Supermercado",
    "home-decoration": "Decoración",
    "kitchen-accessories": "Cocina",
    laptops: "Portátiles",
    "mens-shirts": "Camisas de hombre",
    "mens-shoes": "Zapatos de hombre",
    "mens-watches": "Relojes de hombre",
    "mobile-accessories": "Accesorios móvil",
    motorcycle: "Motos",
    "skin-care": "Cuidado de la piel",
    smartphones: "Smartphones",
    "sports-accessories": "Deporte",
    sunglasses: "Gafas de sol",
    tablets: "Tablets",
    tops: "Blusas",
    vehicle: "Vehículos",
    "womens-bags": "Bolsos",
    "womens-dresses": "Vestidos",
    "womens-jewellery": "Joyería de mujer",
    "womens-shoes": "Zapatos de mujer",
    "womens-watches": "Relojes de mujer"
};

let allProducts = [];
let filteredProducts = [];

export function formatCategory(category) {
    if (!category) return "Sin categoría";

    const key = String(category).trim().toLowerCase();
    if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];

    return key
        .split(/[\s-]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// =======================
// FILTROS Y ORDENAMIENTO
// =======================

export function initializeFilters(products) {
    allProducts = products;
    filteredProducts = [...products];
    populateCategories();
    return filteredProducts;
}

// Obtener categorías únicas
function getUniqueCategories() {
    const categories = new Set();
    allProducts.forEach(product => {
        if (product.category) {
            categories.add(product.category);
        }
    });
    return Array.from(categories).sort((a, b) =>
        formatCategory(a).localeCompare(formatCategory(b), "es")
    );
}

// Llenar el select de categorías
function populateCategories() {
    const categoryFilter = document.getElementById("category-filter");
    if (!categoryFilter) return;

    const categories = getUniqueCategories();
    categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = formatCategory(category);
        categoryFilter.appendChild(option);
    });
}

// Filtrar por búsqueda (nombre o descripción)
export function filterBySearch(searchTerm, sourceArray = allProducts) {
    if (!searchTerm || searchTerm.trim() === '') {
        return sourceArray;
    } else {
        const term = searchTerm.toLowerCase().trim();
        return sourceArray.filter(product => {
            const titleMatch = product.title?.toLowerCase().includes(term);
            const descriptionMatch = product.description?.toLowerCase().includes(term);
            return titleMatch || descriptionMatch;
        });
    }
}

// Filtrar por categoría
export function filterByCategory(category, sourceArray = allProducts) {
    if (category === 'all' || !category) {
        return sourceArray;
    } else {
        return sourceArray.filter(product => 
            product.category === category
        );
    }
}

// Ordenar productos
export function sortProducts(sortType) {
    if (!sortType || sortType === 'default') {
        return filteredProducts;
    }

    const sorted = [...filteredProducts];

    switch (sortType) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            return sorted;
    }

    filteredProducts = sorted;
    return filteredProducts;
}

// Aplicar todos los filtros
export function applyAllFilters(searchTerm, category, sortType) {
    // Empezar con todos los productos
    let result = [...allProducts];
    
    // Aplicar filtro de búsqueda
    result = filterBySearch(searchTerm, result);
    
    // Aplicar filtro de categoría sobre el resultado de la búsqueda
    result = filterByCategory(category, result);
    
    // Guardar en filteredProducts para el ordenamiento
    filteredProducts = [...result];
    
    // Aplicar ordenamiento
    const sorted = sortProducts(sortType);
    
    return sorted;
}

// Obtener productos filtrados actuales
export function getFilteredProducts() {
    return filteredProducts;
}

