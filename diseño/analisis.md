# Análisis de Diseño y Decisiones de Desarrollo

## 1. Decisiones de Interfaz y Experiencia de Usuario

### 1.1 Layout General

**Decisión**: Layout de una columna completa para productos en todas las pantallas, carrito como modal desplegable.

**Justificación**:
- **Máximo espacio para productos**: Al no tener el carrito permanentemente visible, se maximiza el espacio para mostrar más productos
- **Carrito modal**: Se despliega desde la derecha cuando el usuario lo necesita, no ocupa espacio permanente
- **Mejor experiencia móvil**: El modal es más intuitivo en dispositivos táctiles
- **Prioriza productos**: La acción principal (ver productos) tiene todo el espacio disponible
- **Grid más amplio**: Permite mostrar más columnas de productos (4-5 en desktop vs 3 anteriormente)

### 1.2 Sistema de Tarjetas de Productos

**Decisión**: Tarjetas con imagen, categoría, título, valoración, descripción, precio y botón con icono.

**Justificación**:
- Las tarjetas proporcionan un formato visual claro y organizado
- La descripción se recorta con CSS (`line-clamp`) para no cortar el texto en JavaScript
- La valoración usa el campo `rating` de la API cuando existe
- El precio y el botón se apilan solos si la tarjeta mide menos de 300px
- El hover eleva la tarjeta sin cambiar el grosor del borde, para que el layout no salte
- Las tarjetas entran con una animación corta y respetan `prefers-reduced-motion`

### 1.3 Carrito de Compras

**Decisión**: Carrito como modal desplegable desde la derecha en todas las pantallas.

**Justificación**:
- **Modal consistente**: Misma experiencia en desktop y móvil
- **Overlay oscuro**: Enfoca la atención en el carrito cuando está abierto
- **Botón en header**: Siempre accesible con contador visual de items
- **Apertura automática**: Se abre automáticamente al agregar un producto
- **Múltiples formas de cerrar**: Botón X, click en overlay, tecla ESC
- **Maximiza espacio**: No ocupa espacio permanente, permitiendo más productos visibles

### 1.4 Controles de Filtrado

**Decisión**: Buscador con icono, categoría, ordenamiento y botones Aplicar/Reiniciar. En escritorio van en una fila; en pantallas menores a 1024px el buscador ocupa todo el ancho y el resto se reparte.

**Justificación**:
- **Control explícito**: Los filtros se aplican con botón "Aplicar Filtros", dando control al usuario
- **Botón de reinicio**: Permite limpiar todos los filtros fácilmente
- **Agrupación lógica**: Todos los controles de filtrado juntos
- **Búsqueda con más espacio**: Flex: 2 para el input de búsqueda
- **Enter para aplicar**: Se puede aplicar filtros presionando Enter en el campo de búsqueda
- **En móvil**: Se apilan verticalmente para mejor usabilidad táctil

### 1.5 Feedback Visual

**Decisión**: Iconos SVG, animaciones cortas y mensajes dentro de la página.

**Justificación**:
- Los iconos sustituyen emojis para que se vean iguales en todos los sistemas
- El botón "Agregar al carrito" pasa a "Agregado" con un check, sin borrar el botón
- El contador del carrito rebota solo cuando el número cambia
- La compra se confirma en el panel y el resultado aparece en un aviso, no en `alert()`
- `prefers-reduced-motion` desactiva las animaciones

### 1.6 Paginación y fallo de la API

**Decisión**: Paginar según las columnas reales y no tratar un fallo de red como un catálogo vacío.

**Justificación**:
- `--card-min` (240px) define la cuadrícula. JavaScript lee ese valor y el hueco para pedir filas completas
- Aplicar filtros u ordenar vuelve a la página 1. Cambiar el tamaño de la ventana conserva la página si sigue existiendo
- FakeStore se consulta dos veces. Si sigue sin responder, se adapta DummyJSON al mismo formato y se muestra un aviso con Reintentar
- Si tampoco hay catálogo alternativo, el estado de error explica el problema y ofrece el mismo botón

## 2. Estructura de Datos

### 2.1 Representación del Carrito

**Decisión**: Objeto JavaScript donde las claves son los IDs de productos.

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

**Justificación**:
- **Acceso rápido**: O(1) para buscar/actualizar productos por ID
- **Evita duplicados**: La clave única (ID) previene productos duplicados
- **Fácil conversión**: `Object.values(cart)` convierte a array para renderizado
- **Eficiente en storage**: Solo guarda datos necesarios (no toda la descripción)
- **Escalable**: Fácil agregar campos adicionales (descuentos, variantes, etc.)

### 2.2 Almacenamiento de Productos

**Decisión**: Array de productos completo en memoria, array filtrado para renderizado.

**Justificación**:
- **Array completo**: Permite aplicar múltiples filtros sin nuevas peticiones a la API
- **Array filtrado**: Estado actualizado que se renderiza
- **Separación de concerns**: `allProducts` (fuente de verdad) vs `filteredProducts` (vista)
- **Performance**: Filtrado en memoria es más rápido que peticiones HTTP

### 2.3 LocalStorage

**Decisión**: Solo guardar el carrito, no los productos ni filtros.

**Justificación**:
- **Carrito**: Es el único estado que debe persistir entre sesiones
- **Productos**: Siempre se obtienen frescos de la API (pueden cambiar)
- **Filtros**: Son temporales, no necesitan persistencia
- **Tamaño**: Minimiza uso de localStorage (limitado a ~5-10MB)

## 3. Filtros y Ordenamientos

### 3.1 Búsqueda por Texto

**Decisión**: Búsqueda con botón "Aplicar filtros" (evento `click`) o Enter (evento `keydown`) en título y descripción.

**Justificación**:
- **Control del usuario**: El usuario decide cuándo aplicar los filtros
- **Mejor performance**: No se ejecuta en cada tecla, solo cuando se solicita
- **Enter para rapidez**: Se puede aplicar presionando Enter
- **Título y descripción**: Cubre más casos de uso (ej: buscar "smartphone" encuentra productos de electrónica)
- **Case insensitive**: Mejor experiencia (no distingue mayúsculas/minúsculas)
- **Trim**: Ignora espacios al inicio/final

### 3.2 Filtro por Categoría

**Decisión**: Selector desplegable con categorías dinámicas extraídas de los productos.

**Justificación**:
- **Dinámico**: Se adapta automáticamente si la API agrega nuevas categorías
- **Etiquetas en español**: Las categorías conocidas se traducen (`electronics` → Electrónica, `men's clothing` → Ropa de hombre). El resto se muestra con mayúscula inicial
- **Opción "Todas"**: Permite resetear el filtro fácilmente
- **Familiar**: Patrón estándar en e-commerce

### 3.3 Ordenamiento

**Decisiones implementadas**:
- Precio: Ascendente / Descendente
- Nombre: A-Z / Z-A

**Justificación**:
- **Precio**: Criterio más común en compras online (buscar ofertas o productos premium)
- **Nombre**: Útil para búsqueda alfabética o exploración
- **Bidireccional**: Cada criterio tiene ambas direcciones para flexibilidad
- **Por defecto**: Mantiene orden original de la API (sin ordenamiento)

**Criterios no implementados (y por qué)**:
- **Ordenar por valoración**: La valoración sí se muestra en la tarjeta, pero no todas las fuentes traen el mismo conteo de reseñas
- **Fecha**: No es relevante para productos estáticos
- **Stock**: FakeStore no informa inventario de forma uniforme

## 4. Consideraciones de Accesibilidad

### 4.1 Implementado

- **Atributos ARIA**: `aria-label` en botones, `aria-current` en la página activa y `aria-live` en resultados y avisos
- **Contraste**: Colores con suficiente contraste (WCAG AA)
- **Navegación por teclado**: Elementos nativos de botón, enlace y formulario, con `:focus-visible`
- **Carrito cerrado**: El panel usa `inert` para no recibir foco mientras está fuera de pantalla
- **Semántica HTML**: `<header>`, `<main>`, `<footer>`, `<article>`, `<nav>` y `<aside>`
- **Alt text**: Imágenes con atributo `alt` descriptivo. Los iconos decorativos van con `aria-hidden`

### 4.2 Mejoras Futuras

- Agregar un enlace para saltar al listado
- Implementar modo de alto contraste
- Añadir una vista de detalle de producto

## 5. Responsive Design

### 5.1 Breakpoints

- **Escritorio**: filtros en una sola fila. Las columnas de productos salen del ancho real, con tarjeta mínima de 240px
- **Hasta 1024px**: el buscador ocupa todo el ancho; categoría y orden, y los dos botones, van en pares
- **Hasta 560px**: filtros, botones y acciones de compra en una columna. El carrito ocupa el 100% del ancho
- **Hasta 400px**: se oculta la palabra "Carrito" y queda el icono con el contador. El botón sigue teniendo nombre accesible

**Justificación**:
- No se fuerzan 4 columnas en un ancho que deja las tarjetas ilegibles
- La paginación usa la misma cuenta de columnas, así cada página llena filas enteras
- El carrito es un panel lateral en todos los tamaños y solo cambia su ancho

### 5.2 Adaptaciones Móviles

- **Carrito**: Modal lateral con overlay
- **Controles**: Apilados verticalmente
- **Productos**: Grid de 1 columna en pantallas pequeñas
- **Botones**: Ancho completo en móvil para mejor usabilidad táctil
- **Texto**: Tamaños ajustados para legibilidad

## 6. Performance

### 6.1 Optimizaciones Implementadas

- **Lazy loading**: Imágenes con `loading="lazy"`
- **Renderizado eficiente**: Solo se re-renderiza lo necesario
- **Filtrado en memoria**: No requiere peticiones adicionales
- **Event delegation**: Considerado pero no necesario con cantidad de productos

### 6.2 Consideraciones

- La API se llama al inicio y otra vez si el usuario pulsa Reintentar
- Los filtros se aplican sobre datos en memoria
- El listado del carrito se vuelve a pintar completo al cambiar una cantidad. Con pocos productos el coste es bajo y evita estados a medias
- Al cambiar el tamaño de la ventana, la paginación solo se recalcula si cambia el número de productos por página

## 7. Manejo de Errores

### 7.1 Implementado

- **API errors**: Reintento, catálogo alternativo y, si ambos fallan, mensaje con botón Reintentar
- **Validación de datos**: Se descartan productos sin título o sin precio numérico
- **LocalStorage errors**: Try/catch en funciones de storage
- **Validación de cantidad**: Los botones − y + mantienen la cantidad entre 1 y 99. En 1, el botón − quita el producto
- **Textos dinámicos**: Títulos y descripciones se escapan antes de insertarlos en HTML

### 7.2 Mensajes de Usuario

- Mensajes claros y no técnicos
- Estados vacíos manejados (carrito vacío, sin productos)
- Feedback visual en lugar de solo console.log

## 8. Modularidad del Código

### 8.1 Separación de Responsabilidades

- **api.js**: Comunicación con FakeStore y adaptación del catálogo alternativo
- **icons.js**: Iconos SVG compartidos por las vistas
- **products.js**: Renderizado de productos y paginación
- **cart.js**: Solo lógica de negocio del carrito
- **cartView.js**: Solo renderizado del carrito
- **filters.js**: Solo lógica de filtrado
- **storage.js**: Solo utilidades de localStorage
- **main.js**: Solo orquestación y eventos

**Justificación**:
- Facilita mantenimiento
- Permite reutilización
- Hace testing más fácil
- Clarifica responsabilidades

## 9. Conclusión

Las decisiones tomadas priorizan:
1. **Usabilidad**: Interfaz intuitiva y familiar
2. **Performance**: Operaciones eficientes en memoria
3. **Mantenibilidad**: Código modular y organizado
4. **Escalabilidad**: Estructura que permite agregar funcionalidades
5. **Accesibilidad**: Consideraciones básicas implementadas

El diseño busca balancear funcionalidad completa con simplicidad de uso, siguiendo patrones establecidos en e-commerce moderno.

