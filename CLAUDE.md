# León Webs

Portfolio/landing de agencia de diseño web dirigida a pequeños negocios (SMB) en León, España. Propuesta de valor central: **"vender más"**, no "web bonita". Dirigido a negocios que ya facturan offline (barberías, clínicas, asesorías, hoteles) y quieren escalar online.

## Stack técnico

- React + Vite (JSX puro, sin TypeScript)
- **Todo el CSS vive en un único template literal** `const CSS = \`...\`` dentro de `src/App.jsx` — no hay archivos `.css` sueltos por componente (aparte de `App.css`/`index.css` residuales de la plantilla de Vite, que no se usan).
- Sin librerías de animación externas: los efectos (`reveal on scroll`, contadores animados, tilt de tarjetas, starfield) están hechos a mano con `IntersectionObserver`, `requestAnimationFrame` y canvas 2D.
- Sin backend ni base de datos. Los formularios de contacto usan `mailto:`.

## Despliegue

Hosting actual: **GitHub Pages**, repo público `Rissterr/portfolio-webs-leon`, publicado desde la rama `gh-pages`.

```bash
npm run build -- --base=/portfolio-webs-leon/
npx gh-pages -d dist -m "mensaje del cambio"
```

URL en producción: **https://rissterr.github.io/portfolio-webs-leon/**

Importante: como la web vive en una subcarpeta (`/portfolio-webs-leon/`), todas las rutas a `public/assets/...` en el código deben ser **relativas** (`assets/foo.png`, sin `/` inicial) — si se usa una ruta absoluta (`/assets/foo.png`) las imágenes se rompen en este hosting. `index.html` (favicon, script de entrada) no necesita tocarse: Vite reescribe esas rutas automáticamente con `--base`.

Cada cambio de código requiere `npm run build -- --base=/portfolio-webs-leon/` + `npx gh-pages -d dist` para publicarse — no hay CI/CD automático. La CDN de GitHub Pages puede tardar 1-3 minutos en servir la versión nueva tras el despliegue.

### Histórico: Surge.sh (pendiente de recuperar)

Antes se usaba **Surge.sh**, cuenta `vipbarberleon@gmail.com`, dominio `leon-webs.surge.sh`. Se perdió el acceso (contraseña olvidada) y se migró a GitHub Pages como solución rápida. Si se recupera el acceso a Surge (contactando con support@surge.sh) y se quiere volver a usar ese dominio:

```bash
npm run build
npx surge dist leon-webs.surge.sh
```

## Estructura

```
src/App.jsx        # TODO el proyecto: CSS, data arrays, componentes, JSX de la página
public/assets/      # Imágenes: proyectos, testimonios, avatar, fondos
```

`App.jsx` es deliberadamente un único archivo grande (100K+). No se ha dividido en componentes/archivos separados — mantener ese patrón salvo que se pida explícitamente refactorizar.

## Rutas / react-router

El proyecto usa `react-router-dom` con `BrowserRouter` (NO `HashRouter` — la web ya usa `#ancla` en todas partes para scroll interno de la home, así que HashRouter chocaría con eso). El `basename` del router es dinámico: `<BrowserRouter basename={import.meta.env.BASE_URL}>`, así funciona igual en la raíz (Surge) que en una subcarpeta (`/portfolio-webs-leon/` en GitHub Pages) sin tocar código.

Rutas actuales:
- `/` → `HomePage` (la landing principal, todo el contenido original)
- `/plan-arranque`, `/plan-crecimiento`, `/por-horas`, `/tienda-online` → páginas de detalle de cada plan, enlazadas desde las tarjetas de precio ("Ver detalle completo →"). Reutilizan el mismo sistema visual (fondo con puntos + glow que sigue el cursor, `PlanCard`, `Btn`) que el resto de la web mediante el componente compartido `PlanShell`.

Los enlaces DESDE las páginas de detalle HACIA anclas de la home (`#contact`, `#faq`, etc.) usan `<a href={homeHref("#ancla")}>` (navegación real de navegador, no `<Link>` de react-router) — necesario porque bajo `BrowserRouter` un `<Link to="/#contact">` no hace scroll automático al ancla tras el cambio de ruta. El helper `homeHref()` (definido cerca del top del archivo) añade el `BASE_URL` correcto según el hosting.

**Como el sitio usa `BrowserRouter`, cualquier hosting estático necesita servir `index.html` para rutas no encontradas** (para que recargar `/plan-arranque` directamente no dé 404). Ya está resuelto con un script `postbuild` en `package.json` que copia `dist/index.html` a `dist/200.html` (convención de Surge) y `dist/404.html` (truco estándar de GitHub Pages) automáticamente en cada build.

## Reglas de diseño y flujo de trabajo establecidas

- **Cliente objetivo**: dueños de pequeños negocios en León sin conocimientos técnicos. El copy debe ser simple, directo, sin jerga, y centrado en resultados de venta (no en "diseño bonito").
- **Mobile-first real**: la mayoría del tráfico esperado es móvil. Cualquier cambio visual debe verificarse en viewport móvil, no solo escritorio.
- **Nunca dejar precios sin sentido de negocio**: los precios se calcularon con un cálculo real de horas/tarifa (ver histórico de conversación) — no cambiar precios "a ojo" sin justificar el porqué.
- **Efectos visuales con cuidado de rendimiento en móvil**: `shadowBlur` en canvas y animaciones pesadas deben desactivarse o reducirse en `isMobile` — ya hubo un incidente real de página colgándose en móvil por esto.
- **Nunca usar textos con guión suelto tipo "X — Y" sin que ambas partes tengan sentido propio** — se corrigió varias veces porque sonaba "roto" o poco profesional.
- **Los testimonios (`TESTI`) son placeholders** tomados de otro portfolio (nombres/fotos no son clientes reales de León). Sustituir por testimonios reales de clientes de León en cuanto estén disponibles — ver sección de comentarios en el código.
- **El fondo animado (`Starfield`, `.grid-overlay`, `.site-ambient`) es global**, no debe limitarse a una sola sección — se corrigió explícitamente para que cubra toda la web con difuminados suaves entre secciones, sin bordes duros ni efectos "encajonados" dentro de un `.wrap` de ancho limitado.
- **Animaciones "reveal on scroll" (`useReveal`)**: si un elemento ya está en el viewport al montar (ej. usuario entra directo a un enlace con `#ancla`), debe revelarse inmediatamente sin depender solo de `IntersectionObserver` — hay una comprobación de fallback para esto, no quitarla.
- **Confirmar con el usuario antes de acciones irreversibles** (sobrescribir repos, borrar assets) — el usuario es no técnico y trabaja por voz/mensajes cortos, prefiere explicaciones simples y directas.

## Contacto / WhatsApp

Los botones de "Llamar" / "WhatsApp" en el dock móvil usan un número de marcador de posición (`+34600000000`) — **pendiente de reemplazar por el número real del negocio**.

## Imágenes: siempre optimizar a WebP antes de subir

Hubo un incidente real donde varias imágenes nuevas se subieron directamente en PNG a resolución completa (1.2-1.8MB cada una, ~19MB en total solo esas) sin comprimir, lo que habría hecho la web muy lenta en móvil. Se corrigió convirtiendo todo a WebP con ffmpeg:
```bash
ffmpeg -y -i archivo.png -vf "scale=ANCHO:-1" -quality 82 -update 1 archivo.webp
```
Anchos usados: 700px para tarjetas pequeñas, 900px para capturas de proyecto, 1200-1600px para imágenes de hero. Resultado: 44MB → ~1MB en `public/assets/`. **Cualquier imagen nueva que se añada debe pasar por este proceso antes de commitear** — nunca subir un PNG/JPG de más de ~200-300KB sin comprimir primero. Las imágenes viejas sin optimizar y sin usar se movieron a `_revisar_assets/` en la raíz del proyecto (no se borraron).

## Auditoría general — estado a 30/08/2026

**Corregido en la última auditoría:**
- 6 imágenes de proyectos que estaban completamente cruzadas (cada nombre mostraba la captura de otro proyecto)
- 6 enlaces "Ver →" de proyectos que eran muertos (`href="#"`) — ahora llevan a contacto
- `<title>` de la página seguía siendo "portfolio-dev" (el genérico de Vite) — ahora tiene título, descripción y Open Graph reales
- `lang="en"` en el HTML de una web en español — corregido a `lang="es"`
- 44MB de imágenes sin optimizar — reducido a ~1MB

**Pendiente antes de considerar la web lista para entregar a un cliente real:**
1. Número de teléfono/WhatsApp real (ahora mismo es un placeholder +34600000000)
2. Testimonios reales de clientes de León (ahora son de otro portfolio, con nombres extranjeros)
3. Página legal: Aviso Legal, Política de Privacidad y Política de Cookies — obligatorias en España para cualquier web con formulario de contacto (LOPD/RGPD). Ahora mismo no existen.
4. Decidir dominio definitivo (GitHub Pages actual vs Surge vs comprar leonwebs.es) — el og:image y las URLs canónicas están fijadas a la URL de GitHub Pages actual, hay que actualizarlas si cambia
5. Enlaces de Instagram/LinkedIn en el footer siguen siendo `#` (no hay cuentas reales enlazadas)
6. robots.txt y sitemap.xml no existen (no crítico para una web pequeña, pero ayuda al SEO)
