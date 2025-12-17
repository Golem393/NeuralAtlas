# NeuralAtlas - AI Agent Instructions

## Project Overview

NeuralAtlas is a 3D geospatial visualization platform for generating photorealistic building textures from "white box" models using AI. Additionally, we also want to visualize terrain and other geospatial information. The system combines mapping data (Overture Maps, OSM, TUM GBA) with generative AI (Stable Diffusion + ControlNet) to create textured 3D building, forest and mountain models at scale. (more features will be added)

## Architecture

### Planned Tech Stack (Early Stage)

**Frontend:** React 19 + TypeScript + Vite, with MapLibre GL JS as base layer and deck.gl overlay for 3D visualization. Located in `/frontend`

**Backend:** FastAPI (Python) serving tiles via TiTiler and Martin (Rust tile server). Supabase (managed PostgreSQL + PostGIS) for spatial data, with DuckDB for reading Overture Parquet files directly from S3. Located in `/backend`

# Backend Rules (FastAPI)

- **Structure:** Follow a domain-driven structure (e.g., `routers/`, `schemas/`, `services/`).
- **Pydantic:** Use Pydantic v2. Always use `BaseModel` for request/response schemas.
- **Database:** Use Supabase client for all database operations.
- **Async:** Use `async def` for all route handlers and DB calls.
- **Type Hinting:** Strictly use Python type hints (`str`, `int`, `List`, `Optional`) and Pydantic models.
- **Error Handling:** Use `HTTPException` for errors. Don't return plain dictionaries for errors.

# Frontend Rules (React + Vite)

- **Component Style:** Functional components only. Use `const` + arrow functions.
- **TypeScript:** strict mode. No `any`. Define interfaces for all Props.
- **State Management (The Trinity):**
  - **Server State:** Use `tanstack-query`. Avoid `useEffect` for fetching.
  - **Map/High-Frequency State:** Use `zustand` (e.g., zoom level, hover ID). **Do not** use `useContext` for rapidly changing values.
  - **Static Global State:** Use `useContext` only for low-frequency updates (e.g., Theme, User Auth).
- **Effects & Cleanup:** All `useEffect` hooks initializing 3D contexts (MapLibre/Deck.gl) **must** return a cleanup function (`map.remove()`) to prevent WebGL crashes in Strict Mode.
- **Styling:** Use Tailwind CSS utility classes. Avoid CSS-in-JS unless necessary for dynamic values.
- **Performance:** Keep components pure. Move heavy GeoJSON processing to Web Workers or wrap in `useMemo`.
- **Directory Structure:** Feature-based folders (e.g., `src/features/map/components`, `src/features/auth/hooks`).

### API & Data Fetching Strategy

- **Pattern:** Functional Modules + Custom Query Hooks (No Class-based Repositories).
- **Tooling:** Use `tanstack-query` (v5) for all server state.
- **Structure:**
  - `src/api/client.ts`: Single axios/fetch instance with interceptors (Auth, Base URL).
  - `src/api/endpoints/`: Standalone async functions typed with TypeScript interfaces.
    - *Example:* `export const getBuildings = async (id: string) => { ... }`
  - `src/hooks/queries/`: Custom hooks wrapping `useQuery`.
    - *Example:* `useBuildings(id)`
- **Rules:**
  - **Never** call `fetch`/`axios` directly in components.
  - **Never** use `useEffect` for data fetching (creates waterfalls).
  - **Always** separate the *API definition* (how to get data) from the *State Logic* (caching/loading).
  - **Type Safety:** Ensure API response types exactly match Pydantic schemas from Backend.

# General Coding Principles

- **Clean Code:** Functions should do one thing. Keep files under 200 lines where possible.
- **Comments Policy:**
  - **NO docstrings** on functions/classes/modules where the name is self-explanatory
  - Only add comments to explain **WHY**, never **WHAT**
  - Only add comments when the code cannot speak for itself (complex algorithms, non-obvious decisions)
  - TODOs are acceptable for tracking future work
- **Naming:** Make names so clear that comments are unnecessary
  - Python: `snake_case` for variables/functions, `PascalCase` for classes
  - TS/JS: `camelCase` for variables/functions, `PascalCase` for components
  - Examples: `get_buildings()` not `get()`, `calculate_building_height()` not `calc()`

**ML Pipeline:** PyTorch for Stable Diffusion + ControlNet texture generation. Strategy: Generate archetype textures (e.g., "50 variations of Munich House") and reuse across similar buildings to control costs.

**Data Sources:**

- Building geometry: Overture Maps, OSM, regional datasets (LOD2 Gebäudeumringe, NYC 3D, 3D BAG Netherlands)
- Satellite imagery: Sentinel-2, ESA Copernicus, USGS EarthExplorer
- Terrain: Mapzen/AWS Terrain Tiles, SRTM
- Context data: TUM GBA for building metadata

### Current State

- Frontend scaffolded with Vite + React + TypeScript (v19.2) + TanStack Query
- Backend with FastAPI + Supabase client + Buildings API
- Database schema in `supabase/schemas/` (source of truth)
- Basic end-to-end flow working: Supabase → Backend → Frontend

## Development Workflows

### React Conventions

- **Strict Mode enabled** (`main.tsx` wraps App in `<StrictMode>`) to ensure pure components
- **State management:** Plan to use `useContext` for passing values through component trees
- **Component purity:** Keep components pure; avoid side effects in render logic
- **TypeScript:** All components use `.tsx` extension with strict type checking

## Key Design Decisions

### Cost & Scale Strategy

- **Archetype Generation:** Don't generate textures for all buildings. Create 50 variations per building type (e.g., "Munich Residential, 19th Century") and assign to similar structures
- **Context-Aware Prompting:** Script identifies building context (location, style, era) and generates appropriate Stable Diffusion prompts
- **ControlNet:** Maintains structural accuracy (window/door positions) while allowing creative facade generation

### Data Pipeline Flow

1. Ingest building geometry from Overture/TUM (white box models)
2. Extract context (location, type, era) via Python script
3. Generate 2D facade snapshot for AI input
4. Send to Stable Diffusion + ControlNet with contextual prompt (e.g., "Bavarian stucco facade, red tile roof, sunny day")
5. Generate texture atlas and bake onto 3D model (.glb/.gltf format)
6. Serve via TiTiler/Martin as vector tiles

### Accuracy & Legal Considerations

- Output **probability scores** instead of definitive facts (e.g., "85% sure this house is solar-ready")
- Avoid legal liability by framing as estimates/predictions

## Integration Points

### Frontend-Backend Communication

- Vector tiles served via Martin (Rust) connected to Supabase PostGIS
- TiTiler for raster tile generation
- 3D models delivered as .glb/.gltf files via Supabase Storage
- Real-time streaming via MVT (Mapbox Vector Tiles)
- Supabase Realtime for live data updates (optional)

### Data Access Patterns

- DuckDB queries Overture Parquet files directly from S3 (no full download needed)
- Supabase PostGIS for spatial queries and tile generation
- Martin connects to Supabase for zero-code tile serving (config file only)
- Supabase client for authentication, real-time updates, and storage

### Rendering Pipeline

- MapLibre GL JS renders base 2D map
- deck.gl overlays 3D buildings using `@deck.gl/mapbox` integration
- Three.js handles custom 3D rendering for generated textures

## File Structure Patterns

- `supabase/schemas/*.sql` - **Blueprint/Source of truth** (00_types.sql, 01_tables.sql, etc.)
- `supabase/migrations/*.sql` - **History** (auto-generated, read-only)
- `frontend/src/main.tsx` - Entry point with StrictMode + TanStack Query
- `frontend/src/App.tsx` - Main application component
- `frontend/src/api/client.ts` - API client with TypeScript types
- `backend/app/main.py` - FastAPI app with routers
- `backend/app/database.py` - Supabase client singleton
- `backend/app/schemas.py` - Pydantic models
- `backend/app/api/routes/` - API endpoints by feature

## Database Schema Management (Declarative Workflow)

**CRITICAL**: We use a "Two-Tier" declarative system that separates Blueprint from History.

### Core Philosophy

- **Blueprint** (`supabase/schemas/*.sql`): Source of truth describing desired database state
- **History** (`supabase/migrations/*.sql`): Auto-generated change files for production safety

### Configuration

`supabase/config.toml` contains:

```toml
[db.migrations]
enabled = true
schema_paths = ["./schemas/*.sql"]
```

### Workflow for AI (Production-Only, No Local CLI)

**Step 1: Modify Blueprint**

- Read the relevant file in `supabase/schemas/` (e.g., `10_buildings.sql`)
- Edit the CREATE definition directly (add columns, indexes, policies)
- **Rule**: Do NOT write ALTER TABLE. Update as if creating from scratch
- Use idempotent checks for functions/triggers: `DO $$ ... IF NOT EXISTS`
- **Important**: Since no local testing, ensure SQL is syntactically correct

**Step 2: Instruct User to Apply to Production**

- User copies the entire modified schema file
- User pastes into Supabase SQL Editor (Dashboard)
- User runs the SQL
- **Why**: Idempotent statements (`CREATE TABLE IF NOT EXISTS`, `DO $$ IF NOT EXISTS`) allow safe re-runs

**Step 3: Commit**

- Commit the modified `schemas/` file as source of truth
- No migration file needed for production-only workflow

**Note**: When user eventually sets up local Supabase CLI, workflow will change to:

1. Edit schemas/ → 2. `supabase db reset` → 3. `supabase db diff` → 4. Commit both

### Critical Rules

1. **Never Manual Migrations**: Never create/edit files in `supabase/migrations/` manually
2. **Ordering**: Files in `schemas/` must be numbered (00_, 01_, 10_, 99_) for dependency order
3. **Idempotency**: Use `IF NOT EXISTS` checks to prevent reset errors
4. **Production Safety**: `supabase db reset` is dev only. Production uses generated migrations

## Upcoming Implementation Tasks

1. Install MapLibre GL JS + deck.gl for 3D visualization
2. Configure Martin tile server to connect to Supabase
3. Integrate TiTiler for raster tiles
4. Implement DuckDB connector for Overture data
5. Build context extraction script (location → style prompt)
6. Integrate Stable Diffusion + ControlNet pipeline
7. Implement archetype generation system
8. Add .glb/.gltf texture baking workflow with Supabase Storage

## Notes

- Project uses React 19.2 (latest) with new features available
- No React Compiler enabled (performance trade-off in dev mode)
- Backend architecture fully planned but not yet implemented
- Focus on MVP: Single city demo with archetype generation before scaling
