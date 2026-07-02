# Escuadrón Sonrisa

Sitio web estático mobile-first para odontología pediátrica inclusiva y especializada.

## Cambiar colores

Editar las variables en `css/styles.css`, dentro de `:root`.

## Cambiar imágenes

Las fotos principales están en:

- `assets/plantel`
- `assets/galeria`
- `assets/servicios`
- `assets/logos`

Para reemplazar una foto sin tocar código, subir una imagen nueva con el mismo nombre del archivo actual.

## Cambiar textos

Cada página es independiente:

- `index.html`
- `sobre.html`
- `servicios.html`
- `primera-visita.html`
- `formulario.html`
- `consejos.html`
- `galeria.html`
- `contacto.html`

## Cambiar la promo del mes desde cPanel

La forma más simple es reemplazar esta imagen manteniendo el mismo nombre:

`assets/promos/promo-regresoaclases.webp`

En cPanel:

1. Entrar a **Administrador de archivos**.
2. Abrir la carpeta del sitio.
3. Entrar a `assets/promos`.
4. Subir la nueva promo con el nombre `promo-regresoaclases.webp`.
5. Reemplazar el archivo anterior.

También se puede cambiar el título, descripción, botón o ruta de imagen desde:

`data/novedades.json`

En cPanel:

1. Entrar a **Administrador de archivos**.
2. Abrir la carpeta del sitio.
3. Entrar a `data`.
4. Editar `novedades.json`.
5. Cambiar solo los textos entre comillas.
6. Guardar.

Ejemplo:

```json
{
  "visible": true,
  "eyebrow": "Promo del mes",
  "titulo": "",
  "descripcion": "",
  "boton": "Consultar promo",
  "imagen": "assets/promos/promo-regresoaclases.webp",
  "whatsappMensaje": "Hola Escuadrón Sonrisa, quiero consultar la promo del mes."
}
```

Para ocultar la tarjeta, cambiar `"visible": true` por `"visible": false`.

## Cambiar Instagram, Facebook y número de WhatsApp

Editar `instagramUrl`, `facebookUrl` y `whatsappNumber` en `js/main.js`.
Usar formato internacional sin `+`, espacios ni guiones.

Ejemplo Paraguay:

```js
whatsappNumber: "595982592266"
```

## SEO

Actualizar el dominio final en `sitemap.xml`, `robots.txt` y las etiquetas Open Graph de cada HTML cuando el sitio se publique.
