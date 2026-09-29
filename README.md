# FakeStore - Tienda Online

Aplicación web moderna que consume datos de la API pública [FakeStore API](https://fakestoreapi.com/products) para mostrar productos, permitir búsqueda, filtrado, ordenamiento y gestión de un carrito de compras con persistencia en localStorage.

## 📋 Descripción del Proyecto

Esta aplicación web permite a los usuarios:
- Explorar productos de una tienda online, con valoración y paginación
- Buscar productos por nombre o descripción
- Filtrar productos por categoría y ordenarlos por precio o nombre
- Agregar productos al carrito, cambiar cantidades y eliminarlos
- Conservar el carrito en localStorage al recargar la página
- Seguir navegando si FakeStore no responde, mediante un catálogo alternativo

## 🚀 Características

### Funcionalidades Implementadas

✅ **Consumo de API**
- Obtiene productos desde `https://fakestoreapi.com/products`
- Reintenta una vez y, si FakeStore no responde, usa `https://dummyjson.com/products` adaptado al mismo formato
- Muestra carga, error con botón Reintentar, o un aviso cuando se usa el catálogo alternativo
- Uso de `async/await` y tiempo máximo de espera de 8 segundos

✅ **Renderizado Dinámico del DOM**
- Tarjetas con imagen, categoría, título, valoración, descripción, precio y botón
- Paginación que siempre completa filas según el ancho disponible
- Construcción dinámica usando `createElement()`
- Actualización al aplicar filtros, con vuelta automática a la página 1

✅ **Sistema de Carrito**
- Agregar productos y abrir el panel lateral
- Cambiar cantidades con botones − y +, hasta 99 unidades
- Eliminar productos y ver el total de cada línea
- Contador en la cabecera
- Confirmación de compra dentro del panel y aviso flotante al terminar

✅ **Filtros y Búsqueda**
- Búsqueda por nombre o descripción con botón "Aplicar Filtros"
- Filtro por categoría dinámico
- Ordenamiento por precio (ascendente/descendente)
- Ordenamiento por nombre (A-Z / Z-A)
- Botón "Reiniciar" para limpiar todos los filtros
- Enter para aplicar filtros rápidamente

✅ **Persistencia con localStorage**
- Guardado automático del carrito
- Recuperación al recargar la página
- Funciones modulares para gestión de storage

✅ **Diseño Responsivo**
- La cuadrícula usa un ancho mínimo de tarjeta (`--card-min: 240px`) y la paginación calcula las mismas columnas
- Filtros en una fila en escritorio, en dos columnas en tablet y apilados en móvil
- Carrito lateral; en pantallas estrechas ocupa todo el ancho
- El botón de agregar se acorta cuando la tarjeta es estrecha

✅ **Experiencia de Usuario**
- Iconos en línea, entrada animada de las tarjetas y rebote del contador
- El botón pasa a «Agregado» durante un momento
- Estados de vacío, carga y error con icono y texto claro
- Contraste, foco visible y botones con nombre accesible

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
│   ├── api.js          # Consumo de FakeStore y catálogo alternativo
│   ├── icons.js        # Iconos SVG reutilizables
│   ├── products.js     # Renderizado de productos y paginación
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
   - Subir o bajar la cantidad con los botones − y +
   - Eliminar productos con el icono de papelera
8. **Finalizar Compra**: Click en "Finalizar compra" y luego en "Confirmar". Es una compra de demostración: vacía el carrito y muestra un aviso

### Características del Carrito

- El carrito se guarda automáticamente en localStorage
- Al recargar la página, el carrito se mantiene
- El contador del header muestra el total de items
- En móvil, el carrito se abre como modal lateral

## 🏗️ Arquitectura del Código

### Módulos JavaScript

- **main.js**: Orquesta la aplicación, configura eventos globales
- **api.js**: Petición a FakeStore, reintento y adaptación del catálogo alternativo
- **icons.js**: Iconos SVG usados por las vistas
- **products.js**: Renderizado de productos y paginación sincronizada con la cuadrícula
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

- [x] Paginación de productos
- [ ] Vista detallada de producto
- [ ] Sistema de favoritos
- [ ] Historial de compras
- [ ] Integración con pasarela de pago real
- [ ] Modo oscuro
- [ ] Tests unitarios

## 📝 Notas

- Esta es una aplicación de demostración
- La fuente principal es FakeStore API. Si no responde, se muestra un catálogo alternativo y un aviso para reintentar
- Finalizar la compra no cobra: vacía el carrito y deja un aviso
- El carrito persiste solo en el navegador local
- El análisis de interfaz está en [diseño/analisis.md](diseño/analisis.md) y la lista de comprobación en [VERIFICACION_FINAL.md](VERIFICACION_FINAL.md)

## 👤 Autor

Proyecto desarrollado como parte del curso de JavaScript.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

**Nota**: Para ver los wireframes y el análisis completo de diseño, consulta la carpeta `diseño/`.
