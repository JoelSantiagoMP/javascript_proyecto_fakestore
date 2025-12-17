# FakeStore - Tienda Online

Aplicación web moderna que consume datos de la API pública [FakeStore API](https://fakestoreapi.com/products) para mostrar productos, permitir búsqueda, filtrado, ordenamiento y gestión de un carrito de compras con persistencia en localStorage.

## 📋 Descripción del Proyecto

Esta aplicación web permite a los usuarios:
- Explorar productos de una tienda online
- Buscar productos por nombre o descripción
- Filtrar productos por categoría
- Ordenar productos por precio o nombre
- Agregar productos al carrito de compras
- Gestionar el carrito (modificar cantidades, eliminar productos)
- Persistencia del carrito en localStorage

## 🚀 Características

### Funcionalidades Implementadas

✅ **Consumo de API**
- Obtiene productos desde `https://fakestoreapi.com/products`
- Manejo de errores y estados de carga
- Uso de `async/await` para manejo asíncrono

✅ **Renderizado Dinámico del DOM**
- Tarjetas de productos con imagen, título, precio, categoría y descripción
- Construcción dinámica usando `createElement()`
- Actualización en tiempo real al aplicar filtros

✅ **Sistema de Carrito**
- Agregar productos al carrito
- Modificar cantidades
- Eliminar productos
- Cálculo automático del total
- Contador de items en el header

✅ **Filtros y Búsqueda**
- Búsqueda por nombre o descripción (evento `input`)
- Filtro por categoría (evento `change`)
- Ordenamiento por precio (ascendente/descendente)
- Ordenamiento por nombre (A-Z / Z-A)

✅ **Persistencia con localStorage**
- Guardado automático del carrito
- Recuperación al recargar la página
- Funciones modulares para gestión de storage

✅ **Diseño Responsivo**
- Adaptación a escritorio, tablet y móvil
- Carrito como modal lateral en dispositivos móviles
- Grid responsive para productos
- Controles adaptativos

✅ **Experiencia de Usuario**
- Feedback visual al agregar productos
- Transiciones suaves
- Contraste adecuado
- Tipografía legible
- Botones accesibles

## 📁 Estructura del Proyecto

```
javascript_proyecto_fakestore/
│
├── index.html          # Estructura HTML principal
├── README.md           # Este archivo
│
├── css/
│   ├── styles.css      # Estilos principales
│   └── responsive.css  # Media queries para responsive
│
├── js/
│   ├── main.js         # Punto de entrada, configuración de eventos
│   ├── api.js          # Funciones para consumir la API
│   ├── products.js     # Renderizado de productos
│   ├── cart.js         # Lógica del carrito de compras
│   ├── cartView.js     # Vista y renderizado del carrito
│   ├── filters.js      # Filtros, búsqueda y ordenamiento
│   └── storage.js      # Utilidades para localStorage
│
└── diseño/
    ├── analisis.md     # Análisis de decisiones de diseño
    └── wireframes/     # Bocetos y wireframes
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos, Grid, Flexbox, Variables CSS
- **JavaScript (ES6+)**: 
  - Módulos ES6
  - Async/Await
  - Fetch API
  - LocalStorage API
  - Event Listeners

## 📦 Instalación y Ejecución

### Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (opcional, pero recomendado)

### Pasos para Ejecutar

1. **Clonar o descargar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd javascript_proyecto_fakestore
   ```

2. **Abrir la aplicación**

   **Opción A: Abrir directamente**
   - Abrir `index.html` en el navegador
   - Nota: Algunas funcionalidades pueden requerir un servidor local

   **Opción B: Usar un servidor local (Recomendado)**
   
   Con Python:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   
   Con Node.js (http-server):
   ```bash
   npx http-server -p 8000
   ```
   
   Con VS Code:
   - Instalar extensión "Live Server"
   - Click derecho en `index.html` → "Open with Live Server"

3. **Acceder a la aplicación**
   - Abrir el navegador en `http://localhost:8000`

## 🎯 Uso de la Aplicación

### Navegación Básica

1. **Ver Productos**: Los productos se cargan automáticamente al abrir la página
2. **Buscar**: Escribe en la barra de búsqueda para filtrar por nombre o descripción
3. **Filtrar por Categoría**: Selecciona una categoría del menú desplegable
4. **Ordenar**: Selecciona un criterio de ordenamiento
5. **Agregar al Carrito**: Click en "Agregar al carrito" en cualquier producto
6. **Ver Carrito**: Click en el botón "Carrito" del header
7. **Modificar Carrito**: 
   - Cambiar cantidad usando el input numérico
   - Eliminar productos con el botón ✕
8. **Finalizar Compra**: Click en "Finalizar compra" (simulado)

### Características del Carrito

- El carrito se guarda automáticamente en localStorage
- Al recargar la página, el carrito se mantiene
- El contador del header muestra el total de items
- En móvil, el carrito se abre como modal lateral

## 📸 Capturas de Pantalla

### Vista de Escritorio
![Vista de productos en escritorio](diseño/capturas/desktop-products.png)

### Vista Móvil
![Vista móvil con carrito](diseño/capturas/mobile-cart.png)

### Carrito
![Vista del carrito](diseño/capturas/cart-view.png)

## 🏗️ Arquitectura del Código

### Módulos JavaScript

- **main.js**: Orquesta la aplicación, configura eventos globales
- **api.js**: Abstracción para consumo de API
- **products.js**: Renderizado de productos en el DOM
- **cart.js**: Lógica de negocio del carrito (agregar, eliminar, calcular)
- **cartView.js**: Renderizado visual del carrito
- **filters.js**: Lógica de filtrado, búsqueda y ordenamiento
- **storage.js**: Utilidades reutilizables para localStorage

### Estructura de Datos

**Producto (de la API):**
```javascript
{
  id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string,
  rating: { rate: number, count: number }
}
```

**Item del Carrito:**
```javascript
{
  id: number,
  title: string,
  price: number,
  image: string,
  quantity: number
}
```

**Carrito (en localStorage):**
```javascript
{
  [productId]: {
    id: number,
    title: string,
    price: number,
    image: string,
    quantity: number
  }
}
```

## 🎨 Decisiones de Diseño

Ver el archivo [diseño/analisis.md](diseño/analisis.md) para un análisis detallado de:
- Decisiones de interfaz y experiencia de usuario
- Estructura de datos
- Justificación de filtros y ordenamientos
- Consideraciones de accesibilidad

## 🔧 Mejoras Futuras

- [ ] Paginación de productos
- [ ] Vista detallada de producto
- [ ] Sistema de favoritos
- [ ] Historial de compras
- [ ] Integración con pasarela de pago real
- [ ] Modo oscuro
- [ ] Animaciones más avanzadas
- [ ] Tests unitarios

## 📝 Notas

- Esta es una aplicación de demostración
- Los datos provienen de una API pública (FakeStore API)
- El proceso de "Finalizar compra" es simulado
- El carrito persiste solo en el navegador local

## 👤 Autor

Proyecto desarrollado como parte del curso de JavaScript.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

**Nota**: Para ver los wireframes y el análisis completo de diseño, consulta la carpeta `diseño/`.
