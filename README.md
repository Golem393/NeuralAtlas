# NeuralAtlas

## 3D Geospatial Visualization Platform with AI-Generated Building Textures

NeuralAtlas transforms "white box" building models into photorealistic 3D
cityscapes using generative AI. The platform combines geospatial data sources
(Overture Maps, OSM, regional datasets) with Stable Diffusion + ControlNet to
generate contextually-appropriate building textures at scale.

## Overview

### The Problem

3D city models often lack realistic textures, making them look sterile and
uninformative. Manually texturing millions of buildings is prohibitively
expensive.

### The Solution

- **Context-Aware Generation**: Extract building context (location, style,
  era) and generate appropriate textures
- **Archetype Strategy**: Create 50 variations per building type (e.g.,
  "Munich Residential, 19th Century") and reuse across similar structures
- **ControlNet Accuracy**: Maintain structural integrity (window/door
  positions) while generating creative facades
- **Probability Scores**: Provide estimates rather than definitive claims to
  avoid legal liability

## Architecture

### Frontend (`/frontend`)

- **React 19** + TypeScript + Vite
- **MapLibre GL JS**: Base 2D map layer
- **deck.gl**: 3D building overlay visualization
- **Three.js**: Custom rendering for AI-generated textures

### Backend (`/backend`)

- **FastAPI**: Python async web framework
- **Supabase**: Managed PostgreSQL + PostGIS for spatial data
- **Martin**: Rust tile server for vector tiles
- **TiTiler**: Raster tile server for satellite imagery
- **DuckDB**: Direct Parquet querying from S3 (Overture Maps)
- **PyTorch**: Stable Diffusion + ControlNet inference (planned)

### Data Sources

- **Building Geometry**: Overture Maps, OSM, LOD2 Gebäudeumringe, NYC 3D,
  3D BAG Netherlands
- **Satellite Imagery**: Sentinel-2, ESA Copernicus, USGS EarthExplorer
- **Terrain**: Mapzen/AWS Terrain Tiles, SRTM
- **Metadata**: TUM GBA for building context

## Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **Supabase** account (free tier)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts at http://localhost:5173
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env  # Edit with your Supabase credentials
fastapi dev app/main.py  # Starts at http://localhost:8000
```

### Pre-commit Hooks

Install automatic code formatting and linting:

```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files  # Run manually
```

Hooks will automatically:

- Format Python with Ruff
- Lint TypeScript with ESLint
- Check types with mypy
- Fix trailing whitespace and line endings
- Validate JSON/YAML

## Project Status

**Current Stage**: Early development / MVP planning

## Development Workflow

### Frontend

```bash
cd frontend
npm run dev      # Dev server with HMR
npm run build    # Production build
npm run lint     # ESLint
```

### Backend

```bash
cd backend
fastapi dev app/main.py    # Dev server with auto-reload
black app/                 # Format code
ruff check app/ --fix      # Lint and fix
mypy app/                  # Type check
pytest                     # Run tests
```

## Documentation

- [`/frontend/README.md`](./frontend/README.md) - React frontend details
- [`/backend/README.md`](./backend/README.md) - FastAPI backend details
- [`/.github/copilot-instructions.md`](./.github/copilot-instructions.md)

## Key Design Decisions

### Tech Choices

- **Supabase over self-hosted PostgreSQL**: Managed PostGIS + auth + storage + realtime
- **React 19 without Compiler**: Better dev performance, acceptable prod performance
- **FastAPI over Django**: Async-first, automatic OpenAPI docs, modern Python
- **Martin over custom tile server**: Zero-code MVT serving from PostGIS
- **DuckDB for Overture**: Query Parquet directly from S3 without full download

## Contributing

This is an early-stage personal project. Guidelines:

- Follow existing code style (enforced by pre-commit hooks)
- Write tests for new features
- Update documentation for API changes
- Use conventional commits

## License

See [LICENSE](./LICENSE) for details.

## Acknowledgments

- **Data Sources**: Overture Maps Foundation, OpenStreetMap contributors, ESA Copernicus
- **Tools**: FastAPI, React, MapLibre GL JS, deck.gl, Supabase
- **ML**: Stable Diffusion, ControlNet
