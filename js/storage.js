// storage.js

// =======================
// LOCAL STORAGE UTILITIES
// =======================

/**
 * Guarda datos en localStorage
 * @param {string} key - Clave del almacenamiento
 * @param {any} data - Datos a guardar
 */
export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error al guardar en localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Obtiene datos de localStorage
 * @param {string} key - Clave del almacenamiento
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Datos recuperados o valor por defecto
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error al leer de localStorage (${key}):`, error);
        return defaultValue;
    }
}

/**
 * Elimina un item de localStorage
 * @param {string} key - Clave a eliminar
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error al eliminar de localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Limpia todo el localStorage
 */
export function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
        return false;
    }
}

