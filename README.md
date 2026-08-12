# NeuralAtlas

## 3D Map Viewer for Overture Maps Data

NeuralAtlas is a browser-based 3D map viewer. It renders locally generated
vector tiles (PMTiles) from [Overture Maps](https://overturemaps.org/) data with
MapLibre GL JS, with extruded buildings, terrain relief, and configurable layer
styling.

The long-term goal is AI-generated building textures (see
[Roadmap](#roadmap)) — **none of that is implemented yet.** Everything described
under [What Works Today](#what-works-today) is what the code actually does.

## What Works Today

- **Two locations**: Munich and Cortina d'Ampezzo (Dolomites), switchable at runtime
- **3D buildings**: Height-extruded building footprints from Overture
- **Terrain**: Raster-DEM hillshading via public Mapzen/AWS terrarium tiles
- **Layer toggles**: Buildings, roads, landuse, terrain
- **Style presets**: Per-layer styles (building/road/landuse) plus a dark/light base
- **Offline tiles**: All map data is served as static PMTiles files — no tile
  server, no database, no network calls except terrain tiles

The backend currently exposes health endpoints only. **The frontend does not
call the backend**; you can run the map standalone.

## Architecture

### Frontend (`/frontend`) — the actual application

- **React 19** + TypeScript + **Vite**
- **MapLibre GL JS** for rendering (2D base map + 3D building extrusions)
- **PMTiles** protocol for reading tile archives directly from static files
- **Zustand** for map state, **Tailwind CSS** + **Radix UI** for the interface

### Backend (`/backend`) — scaffolding

- **FastAPI** application with `/`, `/api/health`, `/api/ready`
- **Supabase** client configured but unused at runtime
- `scripts/` holds the offline PMTiles generation pipeline (see [Generating Map Data](#generating-map-data))

### Database (`/supabase`)

Project config and placeholder schemas. Nothing in the running app reads from
the database — PMTiles handles all base map data statically.

### Data Sources

- **Buildings, roads, landuse**: Overture Maps, downloaded via the `overturemaps` CLI
- **Terrain**: Mapzen/AWS Terrain Tiles (terrarium encoding), fetched live from S3

## Quick Start

### Prerequisites

- **Node.js** 18+ (tested on 22)
- Map data files (see next step) — the map renders blank without them

### 1. Get the map data

PMTiles archives are gitignored because of their size (~94 MB for both
locations). Either generate them yourself (see
[Generating Map Data](#generating-map-data)) or extract the prebuilt copies
stored on the `testold` branch:

```bash
for f in munich_buildings munich_roads munich_landuse \
         dolomites_buildings dolomites_roads dolomites_landuse; do
  git show testold:data/pmtiles/$f.pmtiles > frontend/public/data/$f.pmtiles
done
```

The frontend expects these six files in `frontend/public/data/`, matching the
paths in [`frontend/src/config/mapSources.ts`](./frontend/src/config/mapSources.ts).

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

That's all you need for the map.

### 3. Run the backend (optional)

Not required by the frontend. Only useful if you're extending the API.

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
fastapi dev app/main.py  # http://localhost:8000, docs at /docs
```

## Generating Map Data

The generation scripts download Overture data and tile it with
[tippecanoe](https://github.com/felt/tippecanoe).

Prerequisites:

```bash
pip install overturemaps
# tippecanoe: apt install tippecanoe, brew install tippecanoe, or build from source
```

Then:

```bash
python backend/scripts/generate_pmtiles_fast_munich.py
python backend/scripts/generate_pmtiles_fast_cortina.py
```

Output lands in `data/pmtiles/` at the repo root. Copy the archives the
frontend needs into `frontend/public/data/`. Downloads are large and slow —
Munich buildings alone is ~57 MB tiled.

## Development Workflow

### Frontend

```bash
cd frontend
npm run dev         # Dev server with HMR
npm run build       # Production build
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
npm run format      # Prettier
npm run check       # type-check + lint + format:check
```

### Backend

```bash
cd backend
fastapi dev app/main.py    # Dev server with auto-reload
ruff format .              # Format
ruff check . --fix         # Lint and fix
mypy app/                  # Type check
```

### Repo-wide

```bash
make format      # Format Python
make lint        # Lint Python + JS + Markdown
make type-check  # mypy + tsc
```

### Pre-commit Hooks

```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

## Project Status

**Early development.** A working map viewer; no AI/ML pipeline.

### Roadmap

Not started — these are intentions, not features:

- Texture generation with Stable Diffusion + ControlNet, applied to building facades
- Archetype reuse (generate a limited set of variations per building type rather
  than per building) to keep inference cost bounded
- deck.gl / Three.js overlays for custom-textured geometry (prototyped on the
  `testold` branch, not merged)
- Satellite imagery and additional regional building datasets

## Documentation

- [`/frontend/README.md`](./frontend/README.md) - React frontend details
- [`/backend/README.md`](./backend/README.md) - FastAPI backend details
- [`/.github/copilot-instructions.md`](./.github/copilot-instructions.md)

## Key Design Decisions

- **Static PMTiles over a tile server**: No Martin/PostGIS/backend dependency for
  map rendering; the tradeoff is that data is a build artifact, not a live query
- **Overture via the `overturemaps` CLI**: Simpler than querying Parquet on S3 directly
- **React 19 without the Compiler**: Better dev performance, acceptable in production
- **FastAPI**: Async-first, automatic OpenAPI docs

## Contributing

Early-stage personal project. Guidelines:

- Follow existing code style (enforced by pre-commit hooks)
- Update documentation for API changes
- Use conventional commits

## License

See [LICENSE](./LICENSE) for details.

## Acknowledgments

- **Data Sources**: Overture Maps Foundation, OpenStreetMap contributors
- **Tools**: MapLibre GL JS, PMTiles, tippecanoe, React, Vite, FastAPI
