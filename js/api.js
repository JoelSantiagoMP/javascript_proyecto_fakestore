const API_URL = "https://fakestoreapi.com/products";

export const fetchProducts = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return [];
    }
};
