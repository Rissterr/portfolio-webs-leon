# Portafolio Personal — Webs León

Portafolio profesional de creación de webs. Construido con React + Vite.

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── sections/      # Hero, About, Services, Cases, Testimonials, FAQ, Pricing
│   └── ui/            # Button, Card y componentes reutilizables
├── hooks/             # Custom hooks (useReveal, useTilt...)
├── assets/
│   ├── images/        # Fotos, capturas de proyectos
│   └── icons/         # SVGs e iconos
├── styles/
│   └── variables.css  # Design tokens (colores, tipografía, espaciado)
├── data/              # Contenido estático (proyectos, testimonios...)
├── App.jsx            # Componente raíz
├── main.jsx           # Entry point
└── index.css          # Estilos globales
```

## Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción → /dist
npm run preview  # Vista previa del build
```

## Stack

- **React 19** — UI
- **Vite 8** — Build tool
- **CSS puro** — Sin frameworks de estilos
- **Netlify** — Deploy
