# Manual de Marca - Sweet Medical

Este documento define las pautas visuales y de interfaz de usuario de **Sweet Medical**. Su objetivo es garantizar consistencia entre todas las vistas, componentes y pantallas del producto.

Aplica a todo el frontend ubicado en `packages/frontend`.

---

## 1. Identidad

| Atributo | Valor |
|----------|-------|
| Nombre | Sweet Medical |
| Logo | No definido aún |
| Tipografía corporativa | No definida aún |
| Eslogan | No definido aún |

> **Nota:** A futuro, si se incorpora un logo o tipografía corporativa, este manual deberá actualizarse para reflejar su uso en headers, favicon, splash screens y materiales de comunicación.

---

## 2. Paleta de Colores

### 2.1. Colores principales

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| Primario | Verde teal | `#087f73` | Botones primarios, acentos, títulos de sección, iconos activos, badges positivos |
| Primario claro | Verde suave | `#e1f0e1` | Fondos de selección, estados hover de chips de turno, indicadores suaves |
| Superficie | Blanco | `#ffffff` | Fondo de tarjetas, modales, dropdowns |
| Fondo | Gris muy claro | `#f5f5f5` | Fondo general de las páginas |
| Texto principal | Casi negro | `#212121` | Títulos, cuerpo, labels principales |
| Texto secundario | Gris medio | `#757575` | Subtítulos, hints, fechas, metadata |
| Borde | Gris claro | `#e2e8f0` | Bordes de tarjetas, divisores, inputs en reposo |

### 2.2. Colores semánticos

| Significado | Color | Hex | Uso |
|-------------|-------|-----|-----|
| Éxito / Confirmado | Verde | `#43A047` | Turnos confirmados, acciones exitosas, badges de estado positivo |
| Advertencia / Pendiente | Naranja | `#EF6C00` | Notificaciones pendientes, estados de atención |
| Error / Cancelado | Rojo | `#C62828` | Cancelar turno, errores, badges de estado negativo |
| Información / Neutro | Gris | `#757575` | Estados intermedios, deshabilitados, metadata |

### 2.3. Dark mode

El proyecto debe soportar **dark mode**. La implementación actual utiliza un theme dinámico de MUI. Las variables de CSS personalizadas ya se actualizan en `index.js`, pero las paletas para dark mode deben definirse y aplicarse de forma consistente en futuras iteraciones.

| Rol (dark) | Color sugerido | Uso |
|------------|----------------|-----|
| Fondo | `#0f172a` | Fondo general |
| Superficie | `#111827` | Tarjetas, modales |
| Texto principal | `#e5e7eb` | Títulos y cuerpo |
| Texto secundario | `#9ca3af` | Subtítulos y metadata |
| Primario | `#087f73` | Mantener identidad en dark mode |

---

## 3. Tipografía

- **Fuente base:** Roboto, sans-serif.
- **Jerarquía tipográfica:**

| Estilo | Tamaño | Peso | Uso |
|--------|--------|------|-----|
| H1 | 24px | 600 | Título de página |
| H2 / Título de sección | 20px | 600 | `TituloSeccion`, títulos de bloques |
| H3 | 16px | 600 | Subtítulos dentro de tarjetas |
| Body 1 | 14px | 400 | Texto principal dentro de tarjetas y párrafos |
| Body 2 | 12px | 400 | Metadata, hints, fechas |
| Small / Caption | 11px | 400 | Labels menores, estados secundarios |

### Título de sección

El título de sección oficial es el componente `TituloSeccion`. Debe:

- Usar el estilo tipográfico H2.
- Mostrar un indicador vertical de color primario (`#087f73`) a la izquierda del texto, de 6px de ancho y 26px de alto, con bordes redondeados.
- Alinear ícono + texto cuando lo lleve.

---

## 4. Tarjetas (Cards)

### Card oficial

La tarjeta oficial de Sweet Medical es `CardBase` (`packages/frontend/src/shared/CardBase/CardBase.jsx`).

**Características:**

- Componente base de MUI `Card`.
- Fondo blanco (`#ffffff`).
- Borde: `1px solid #e2e8f0`.
- Radio de borde: `12px`.
- Padding interno: `20px`.
- Sombra sutil: `box-shadow: 1px 1px 1px grey` (a refinar en theme de MUI).
- Margen inferior entre tarjetas: `16px`.
- Layout interno: flex, vertical por defecto, `justify-content: space-between`.

### Unificación

Todas las tarjetas del sistema deben derivar de `CardBase` o replicar sus estilos. No deben existir tarjetas con bordes, radios, sombras o paddings distintos salvo justificación funcional (p. ej., estadísticas compactas).

Ejemplos de tarjetas a unificar:

- Card de turno próximo (`CardTurno`).
- Card de historial (`TurnoHistorialCard`).
- Card de estadística (`EstadisticaTurnoCard`).
- Card de resultado de búsqueda (`tarjetaTurno`).
- Skeletons de tarjetas.

### Divider de card

Para separar contenido dentro de una misma card, se usa `CardDivider` (`Top` y `Bottom`) con una línea divisoria `1px solid #e2e8f0` y `padding-top: 16px` en la sección inferior.

---

## 5. Botones

### Sistema de botones

Se adopta el sistema de botones de MUI estandarizado con los siguientes estilos oficiales:

| Tipo | Variante MUI | Apariencia | Uso |
|------|--------------|------------|-----|
| Primario | `contained` | Fondo primario (`#087f73`), texto blanco | Acción principal: reservar, confirmar, guardar |
| Secundario | `outlined` | Bordes redondeados tipo "pill", fondo transparente, texto gris oscuro | Acciones secundarias: cambiar fecha, editar |
| Peligro | `contained` | Fondo rojo (`#C62828`), texto blanco | Cancelar turno, eliminar, acciones destructivas |
| Fantasma / Link | `text` | Sin fondo, texto primario | Navegación terciaria |

### Forma

- Todos los botones deben tener esquinas completamente redondeadas: **pill / 999px**.
- `textTransform: none` (ya está en `theme.js`).
- Peso tipográfico: 500 o 600 según jerarquía.
- Padding horizontal: `18px`, vertical: `6px`.

### Estados

- Hover: elevación ligera (`transform: translateY(-1px)`) o cambio de fondo.
- Disabled: opacidad reducida, cursor `not-allowed`, sin transformaciones.

---

## 6. Iconografía

- **Librería oficial:** Material Icons de MUI (`@mui/icons-material`).
- Tamaño por defecto: según contexto (pequeño en chips, mediano en headers).
- Color por defecto: heredar del texto o usar primario/segundario según jerarquía.

---

## 7. Espaciado

El sistema de espaciado utiliza **múltiplos de 4px**:

| Token | Valor | Uso típico |
|-------|-------|------------|
| `xs` | 4px | Gaps muy pequeños, iconos ajustados |
| `sm` | 8px | Padding reducido, gaps entre chips |
| `md` | 16px | Padding interno de secciones, gaps de grupos |
| `lg` | 20px | Padding de cards |
| `xl` | 24px | Padding de modales, separación de bloques |
| `2xl` | 32px | Separación entre secciones de página |

Alineación con esto:

- Padding interno de cards: `20px`.
- Gap entre tarjetas de estadística: `16px`.
- Margen inferior de secciones: `32px`.
- Gap entre icono y texto en filas: `6px` o `8px`.

---

## 8. Modales

- Todos los modales deben seguir un estilo único basado en MUI `Dialog`.
- Fondo de overlay estándar de MUI.
- Superficie blanca con borde redondeado (`12px` o según theme).
- Padding interno consistente (`24px`).
- Botones de acción alineados a la derecha, usando el sistema de botones oficial.
- Título del modal con tipografía H3 o H2 según importancia.

---

## 9. Badges y estados

El sistema de estados de turno debe usar badges con colores semánticos:

| Estado | Color | Fondo del badge | Texto |
|--------|-------|-----------------|-------|
| Confirmado | Verde `#43A047` | Verde muy claro `#e6f4ea` | Verde oscuro `#137333` |
| Pendiente | Naranja `#EF6C00` | Naranja claro `#ffedd5` | Naranja oscuro `#ea580c` |
| Cancelado | Rojo `#C62828` | Rojo claro `#fee2e2` | Rojo oscuro `#dc2626` |
| Finalizado | Gris `#757575` | Gris claro `#f1f5f9` | Gris oscuro `#334155` |
| Reprogramado | Azul info | Azul claro | Azul oscuro |

El badge debe adaptarse automáticamente al modo oscuro.

---

## 10. Avatares

- Los avatares con iniciales se usan en todas las tarjetas y listados que muestran médicos o usuarios.
- Forma: redonda (`Avatar` de MUI).
- Tamaño por defecto: `56px` en headers de tarjeta, `52px` en listados.
- Fondo suave y texto en color primario o derivado.

---

## 11. Formularios

- Inputs, selects, datepickers y demás controles usan el estilo estándar de MUI.
- Bordes en reposo: `#e2e8f0`.
- Label y placeholder en `text.secondary`.
- Estado de foco con color primario.

---

## 12. Modo oscuro

- El proyecto debe soportar dark mode mediante el theme dinámico de MUI.
- Todos los componentes compartidos (`CardBase`, `TituloSeccion`, `BadgeEstado`, botones, etc.) deben ser compatibles con dark mode.
- Evitar colores hardcodeados (#fff, #000) fuera del theme. Preferir referencias a `theme.palette` o variables CSS.

---

## 13. Componentes compartidos obligatorios

Para garantizar consistencia, todas las vistas deben reusar:

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| `CardBase` | `src/shared/CardBase/CardBase.jsx` | Tarjeta base oficial |
| `CardDivider` | `src/components/cards/CardDivider.jsx` | División interna de tarjetas |
| `TituloSeccion` | `src/shared/TituloSeccion/TituloSeccion.jsx` | Título de sección con indicador |
| `BadgeEstado` | `src/shared/BadgeEstado.jsx` | Badge de estado de turno |
| `TurnoCardHeader` | `src/components/cards/CardTurno/TurnoCardHeader.jsx` | Header reutilizable de turno |
| Botones de MUI | `@mui/material/Button` | Sistema de botones |

---

## 14. Archivos relacionados

- `packages/frontend/src/theme.js`: theme base de MUI.
- `packages/frontend/src/index.js`: lógica de tema dinámico y variables CSS.
- `packages/frontend/src/shared/`: componentes reutilizables.

---

## 15. Próximos pasos sugeridos

1. Actualizar `theme.js` para que refleje exactamente esta paleta y soporte dark mode.
2. Refactorizar `CardBase` para que use exclusivamente valores del theme.
3. Derivar todas las tarjetas de `CardBase`.
4. Crear componentes de botones oficiales si es necesario (envoltorios sobre MUI).
5. Revisar y actualizar `BadgeEstado` para que use los colores semánticos oficiales.
6. Eliminar colores hardcodeados y duplicaciones en styled-components y CSS sueltos.
7. Resolver skeletons de tarjetas para que usen `CardBase`.

---

*Última actualización: Junio 2026.*
