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

**Decisión**: Tarjetas con imagen, categoría, título, descripción truncada, precio y botón de acción.

**Justificación**:
- Las tarjetas proporcionan un formato visual claro y organizado
- La descripción truncada evita sobrecargar visualmente pero da contexto
- El precio destacado ayuda en la toma de decisiones rápidas
- El hover effect (elevación) proporciona feedback visual inmediato
- Grid responsive se adapta automáticamente al espacio disponible

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

**Decisión**: Barra de búsqueda, selector de categoría, selector de ordenamiento y botones de acción (Aplicar/Reiniciar) en la misma fila.

**Justificación**:
- **Control explícito**: Los filtros se aplican con botón "Aplicar Filtros", dando control al usuario
- **Botón de reinicio**: Permite limpiar todos los filtros fácilmente
- **Agrupación lógica**: Todos los controles de filtrado juntos
- **Búsqueda con más espacio**: Flex: 2 para el input de búsqueda
- **Enter para aplicar**: Se puede aplicar filtros presionando Enter en el campo de búsqueda
- **En móvil**: Se apilan verticalmente para mejor usabilidad táctil

### 1.5 Feedback Visual

**Decisión**: Animaciones sutiles, cambios de estado en botones, mensajes de confirmación.

**Justificación**:
- El botón "Agregar al carrito" cambia a "✓ Agregado" temporalmente
- Transiciones suaves (0.2s-0.3s) no distraen pero dan feedback
- Hover effects indican elementos interactivos
- El contador del carrito aparece/desaparece según necesidad

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

**Decisión**: Búsqueda con botón "Aplicar Filtros" (evento `click`) o Enter (evento `keypress`) en título y descripción.

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
- **Capitalización**: Mejora legibilidad (ej: "electronics" → "Electronics")
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
- **Popularidad/Rating**: La API no siempre tiene datos consistentes
- **Fecha**: No es relevante para productos estáticos
- **Stock**: La API no proporciona información de inventario

## 4. Consideraciones de Accesibilidad

### 4.1 Implementado

- **Atributos ARIA**: `aria-label` en botones de acción
- **Contraste**: Colores con suficiente contraste (WCAG AA)
- **Navegación por teclado**: Todos los elementos interactivos son accesibles
- **Semántica HTML**: Uso de `<article>`, `<section>`, `<header>`, `<aside>`
- **Alt text**: Imágenes con atributo `alt` descriptivo

### 4.2 Mejoras Futuras

- Agregar `role` y `aria-live` para anuncios de cambios dinámicos
- Mejorar focus visible en navegación por teclado
- Agregar skip links para navegación rápida
- Implementar modo de alto contraste

## 5. Responsive Design

### 5.1 Breakpoints

- **Desktop**: > 1024px (grid 4-5 columnas de productos)
- **Tablet**: 768px - 1024px (grid 2-3 columnas de productos)
- **Móvil**: < 768px (grid 1 columna, carrito modal)
- **Móvil pequeño**: < 480px (ajustes adicionales, botones full-width)

**Justificación**:
- Breakpoints estándar basados en dispositivos comunes
- Transiciones suaves entre breakpoints
- Carrito modal en todas las pantallas optimiza espacio
- Más columnas en desktop al no tener carrito permanente

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

- La API se llama una sola vez al inicio
- Los filtros se aplican sobre datos en memoria
- El carrito se actualiza incrementalmente (no se re-renderiza todo)

## 7. Manejo de Errores

### 7.1 Implementado

- **API errors**: Try/catch con mensajes al usuario
- **Validación de datos**: Verificación de arrays antes de renderizar
- **LocalStorage errors**: Try/catch en funciones de storage
- **Validación de cantidad**: Input numérico con mínimo 1

### 7.2 Mensajes de Usuario

- Mensajes claros y no técnicos
- Estados vacíos manejados (carrito vacío, sin productos)
- Feedback visual en lugar de solo console.log

## 8. Modularidad del Código

### 8.1 Separación de Responsabilidades

- **api.js**: Solo comunicación con API
- **products.js**: Solo renderizado de productos
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

