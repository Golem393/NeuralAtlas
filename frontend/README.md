# NeuralAtlas Frontend

React 19 + TypeScript + Vite frontend for 3D geospatial visualization.

## Tech Stack

- **React 19.2**: Latest React with new features
- **TypeScript**: Strict mode enabled for type safety
- **Vite**: Fast build tool with HMR
- **MapLibre GL JS**: Base 2D map rendering (planned)
- **deck.gl**: 3D building overlay visualization (planned)
- **Three.js**: Advanced 3D rendering for AI-generated textures (planned)

## Project Structure

```text
frontend/
├── src/
│   ├── main.tsx          # Entry point with StrictMode
│   ├── App.tsx           # Root component
│   ├── index.css         # Global styles
│   └── assets/           # Static assets
├── public/               # Public static files
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── eslint.config.js      # ESLint flat config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

## Development

### Setup

```bash
cd frontend
npm install
```

### Commands

```bash
npm run dev      # Start dev server with HMR at http://localhost:5173
npm run build    # Production build (runs tsc -b && vite build)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Development Notes

- **Strict Mode enabled**: Helps catch bugs by double-rendering components in dev
- **React 19 features**: Available but React Compiler not enabled (performance trade-off)
- **Component purity**: Keep components pure, avoid side effects in render logic

## Code Style

### React Conventions

- **Functional components only**: Use `const` + arrow functions
- **TypeScript strict mode**: No `any` types, define interfaces for all props
- **Component naming**: PascalCase for components, camelCase for functions/variables

### State Management (Planned)

- **Server State**: TanStack Query (no `useEffect` for fetching)
- **Map/High-Frequency State**: Zustand (zoom, hover, camera position)
- **Static Global State**: `useContext` only for low-frequency updates (theme, auth)

### Styling (Planned)

- **Tailwind CSS**: Utility-first CSS framework
- Avoid CSS-in-JS unless needed for dynamic values

## Notes

- Currently using Vite's default React template
- ESLint configured with flat config format
- TypeScript strict mode enabled
- No React Compiler (intentional for dev performance)
