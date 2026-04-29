# F1-tienda
Evaluacion 2 de Front End

PROMPT USADO 

Actúa como un Senior Frontend Developer. Debo desarrollar una Single Page Application (SPA) profesional llamada 'Paddock Store F1'. Es un Carrito Didáctico de merchandising de Fórmula 1 que debe cumplir con la rúbrica de evaluación más exigente (Nivel Excelente).

Requerimientos de Arquitectura (Nivel Pro):

Modularidad ES6: Organiza el código en funciones puras y reutilizables. Separa la lógica de negocio (cálculos de precios/stock) de la manipulación del DOM.

Estructura de Datos: Usa un arreglo de objetos llamado inventory para los productos y un arreglo cart para las compras. Cada objeto debe tener id, name, team, price, stock e image.

Seguridad Crítica (Evaluación Máxima):

Anti-XSS: Prohibido el uso de .innerHTML. Toda actualización del DOM debe usar document.createElement, classList, y textContent.

Sanitización: Implementa una función que limpie los inputs de texto para evitar inyecciones de HTML/Scripts.

Validaciones: Uso de Regex para el formulario de cliente (Nombre, Email y cantidad de productos).

Funcionalidades Específicas:

Catálogo Dinámico: Renderizado automático de tarjetas de productos (Red Bull, Ferrari, Mercedes, etc.) desde el arreglo de objetos.

Lógica de Carrito: Funciones para addItem, removeItem, y calculateTotal. El total debe incluir un cálculo dinámico de IVA (19% para Chile) y descuentos por cantidad.

UI/UX F1: El diseño debe ser responsivo, usando una paleta de colores profesional (Negro carbón, Rojo Ferrari #FF2800, y Blanco). Usa fuentes tipo Sans-serif modernas.

Entregables requeridos en el código:

Documentación JSDoc en cada función explicando parámetros y retornos.

Un bloque de comentarios al inicio que explique la estrategia de seguridad aplicada para prevenir vulnerabilidades.

Persistencia de datos mediante localStorage para que el carrito no se borre al refrescar.

Instrucción de Control de Calidad:
Antes de generar el código, asegúrate de que el sistema de validación del formulario bloquee cualquier intento de ingresar números negativos o scripts maliciosos. Genera el HTML, CSS y JavaScript por separado para asegurar mantenibilidad.


Ajustes al prompt 

1. Arquitectura y Seguridad
Prompt: "Desarrollar una Single Page Application (SPA) modular para una tienda de F1 utilizando HTML5, CSS3 y JavaScript (ES6+). Implementar medidas de seguridad estrictas contra ataques XSS, prohibiendo el uso de .innerHTML y utilizando exclusivamente métodos de manipulación del DOM (createElement, textContent)."
2. Experiencia de Usuario (UI/UX) y Diseño
Prompt: "Crear una interfaz premium con estética 'Gamer/F1' usando una paleta de colores basada en Carbono (#0A0A0A), Rojo Ferrari (#FF2800) y Blanco. Implementar un sistema de 'Glow' neón para elementos interactivos y efectos de desenfoque de fondo (backdrop-filter) en modales."
Prompt: "Diseñar un botón lateral interactivo (handle) para los filtros que sea rojo con un resplandor (glow). El botón debe estar físicamente anclado al borde del sidebar mediante CSS, asegurando que se desplace de forma sincronizada con el panel tanto en escritorio como en móvil."
3. Funcionalidad de E-commerce y Persistencia
Prompt: "Desarrollar un sistema de autenticación que persista los datos del usuario en localStorage, permitiendo que la sesión se mantenga activa al recargar la página."
Prompt: "Implementar un carrito de compras dinámico con cálculos de subtotal, IVA (19%) y descuentos por cantidad. Al finalizar la compra, generar una boleta electrónica (factura) detallada en un modal que incluya datos del cliente, desglose de productos y métodos de logística, permitiendo su visualización prolija en cualquier dispositivo."
4. Métodos de Pago
Prompt: "Integrar una pasarela de pago simulada que ofrezca opciones dinámicas para: Transferencia Bancaria (mostrando datos de cuenta), WebPay (con grid de bancos seleccionables) y Tarjeta de Crédito (con validación de formato)."
5. Optimización Responsiva (Mobile-First)
Prompt: "Refactorizar el CSS bajo una arquitectura 'Mobile-First', eliminando consultas de medios (media queries) conflictivas. Asegurar que el catálogo de productos use un grid fluido que pase de 1 columna (móvil pequeño) a 2 columnas (móvil medio) y hasta 4 en escritorio, sin desbordamientos horizontales."
Prompt: "Optimizar los modales de descripción de producto para incluir barras de desplazamiento internas (overflow-y: auto) y asegurar que las imágenes utilicen object-fit: contain para mostrarse completas y prolijas sin cortes, adaptándose automáticamente al espacio disponible."
6. Interactividad Avanzada
Prompt: "Hacer que el footer sea completamente interactivo, vinculando cada enlace a filtros automáticos del catálogo o a ventanas informativas de términos y condiciones."
Prompt: "Implementar un sistema de navegación SPA que oculte/muestre secciones (hero vs catalog) sin recargar la página, gestionando la visibilidad del botón de scroll-top y el estado del sidebar de filtros mediante clases de estado."

7. Ajustes y Refinamientos Finales
Prompt: "Realizar auditorías de compatibilidad entre navegadores, especialmente en Safari Mobile, para corregir cualquier problema de renderizado en el footer interactivo."
Prompt: "Implementar un sistema de 'toast' (notificaciones efímeras) para retroalimentar al usuario de forma no intrusiva tras cada acción (ej. 'Producto agregado')."
Prompt: "Optimizar el rendimiento del carrusel de equipos en el hero para que funcione de manera fluida en dispositivos de gama baja, reduciendo la carga de imágenes."

El enfoque principal fue la prolijidad del código y la compatibilidad total, asegurando que ninguna acción se "buguee" al cambiar entre dispositivos móviles y computadoras.