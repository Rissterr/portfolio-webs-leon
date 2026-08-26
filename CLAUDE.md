# León Webs

Portfolio/landing de agencia de diseño web dirigida a pequeños negocios (SMB) en León, España. Propuesta de valor central: **"vender más"**, no "web bonita". Dirigido a negocios que ya facturan offline (barberías, clínicas, asesorías, hoteles) y quieren escalar online.

## Stack técnico

- React + Vite (JSX puro, sin TypeScript)
- **Todo el CSS vive en un único template literal** `const CSS = \`...\`` dentro de `src/App.jsx` — no hay archivos `.css` sueltos por componente (aparte de `App.css`/`index.css` residuales de la plantilla de Vite, que no se usan).
- Sin librerías de animación externas: los efectos (`reveal on scroll`, contadores animados, tilt de tarjetas, starfield) están hechos a mano con `IntersectionObserver`, `requestAnimationFrame` y canvas 2D.
- Sin backend ni base de datos. Los formularios de contacto usan `mailto:`.

## Despliegue

Hosting: **Surge.sh** (gratuito), cuenta `vipbarberleon@gmail.com`.

```bash
npm run build
npx surge dist leon-webs.surge.sh
```

URL en producción: **https://leon-webs.surge.sh**

Cada cambio de código requiere `npm run build` + `npx surge dist leon-webs.surge.sh` para publicarse — no hay CI/CD automático.

## Estructura

```
src/App.jsx        # TODO el proyecto: CSS, data arrays, componentes, JSX de la página
public/assets/      # Imágenes: proyectos, testimonios, avatar, fondos
```

`App.jsx` es deliberadamente un único archivo grande (100K+). No se ha dividido en componentes/archivos separados — mantener ese patrón salvo que se pida explícitamente refactorizar.

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
