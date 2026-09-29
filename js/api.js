const FAKESTORE_URL = "https://fakestoreapi.com/products";
const FALLBACK_URL = "https://dummyjson.com/products?limit=24&select=title,price,description,category,thumbnail,rating";

function timeoutSignal(ms) {
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
        return AbortSignal.timeout(ms);
    }

    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
}

async function requestJson(url) {
    const response = await fetch(url, { signal: timeoutSignal(8000) });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    return response.json();
}

function isProduct(item) {
    return Boolean(item)
        && typeof item.title === "string"
        && item.title.trim() !== ""
        && item.price != null
        && !Number.isNaN(Number(item.price));
}

function mapFallbackProducts(data) {
    const list = Array.isArray(data?.products) ? data.products : [];

    return list
        .map((product) => ({
            id: product.id,
            title: product.title,
            price: Number(product.price),
            description: product.description || "",
            category: product.category || "Sin categoría",
            image: product.thumbnail || "",
            rating: {
                rate: Number(product.rating) || 0
            }
        }))
        .filter(isProduct);
}

export async function fetchProducts() {
    let lastError = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            const data = await requestJson(FAKESTORE_URL);

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("La API no devolvió productos");
            }

            const products = data.filter(isProduct);
            if (products.length === 0) {
                throw new Error("La API no devolvió productos válidos");
            }

            return { products, source: "fakestore" };
        } catch (error) {
            lastError = error;
        }
    }

    try {
        const data = await requestJson(FALLBACK_URL);
        const products = mapFallbackProducts(data);

        if (products.length === 0) {
            throw new Error("El catálogo alternativo está vacío");
        }

        return {
            products,
            source: "fallback",
            message: "FakeStore no respondió. Mostramos un catálogo alternativo para que puedas seguir navegando."
        };
    } catch (error) {
        console.error("Error al obtener los productos:", lastError || error);
        throw new Error("No se pudieron cargar los productos. Revisa tu conexión e inténtalo de nuevo.");
    }
}
