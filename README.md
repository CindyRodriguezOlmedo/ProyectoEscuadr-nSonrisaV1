# Escuadron Sonrisa

Sitio web estático mobile-first para odontología familiar, odontopediatría, ortopedia y ortodoncia.

## Cambiar colores

Editar las variables en `css/styles.css`, dentro de `:root`.

## Cambiar imágenes

Las fotos usadas están en `assets/plantel`, `assets/logos` y `assets/fotosDelConsultorio`.
Puedes reemplazar esas imagenes manteniendo el mismo nombre o actualizar las rutas en cada archivo `.html`.

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

## Cambiar Instagram, Facebook y número de WhatsApp

Editar `instagramUrl`, `facebookUrl` y `whatsappNumber` en `js/main.js`.
Usar formato internacional sin `+`, espacios ni guiones.

Ejemplo Paraguay:

```js
whatsappNumber: "595982592266"
```

## SEO

Actualizar el dominio final en `sitemap.xml`, `robots.txt` y las etiquetas Open Graph de cada HTML cuando el sitio se publique.
