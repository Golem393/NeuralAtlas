# NeuralAtlas - AI Agent Instructions

## Project Overview

NeuralAtlas is a 3D geospatial visualization platform for generating photorealistic building textures from "white box" models using AI. The system combines mapping data (Overture Maps, OSM) with generative AI (Stable Diffusion + ControlNet) to create textured 3D building models at scale.

## Architecture

### Current Tech Stack

**Frontend:** React 19 + TypeScript + Vite, MapLibre GL JS for base 2D/3D map rendering. PMTiles for serverless vector tiles. Blueprint JS for UI components. Located in `/frontend`

**Backend:** FastAPI (Python) for future texture generation API. Currently minimal - no tile server needed (PMTiles handles everything statically). Located in `/backend`

**Database:** Supabase (PostgreSQL + PostGIS) reserved for future features (generated textures storage, user data). Currently not used for base map data.

**Map Data:** PMTiles format - pre-generated vector tiles served statically via HTTP Range Requests. No database ingestion needed.

# Backend Rules (FastAPI)

- **Structure:** Follow domain-driven structure (`routers/`, `schemas/`, `services/`)
- **Pydantic:** Use Pydantic v2. Always use `BaseModel` for request/response schemas
- **Database:** Use Supabase client for future texture storage operations
- **Async:** Use `async def` for all route handlers
- **Type Hinting:** Strictly use Python type hints (`str`, `int`, `List`, `Optional`)
- **Error Handling:** Use `HTTPException` for errors

# Frontend Rules (React + Vite)

- **Component Style:** Functional components only. Use `const` + arrow functions
- **TypeScript:** strict mode. No `any`. Define interfaces for all Props
- **State Management:**
  - **Map State:** Use `zustand` for map controls, layer visibility, styling (e.g., `mapStore.ts`)
  - **Server State:** Use `tanstack-query` for future API calls (texture generation)
  - **Avoid:** Do NOT use `useContext` for rapidly changing map state
- **Effects & Cleanup:** All `useEffect` hooks initializing MapLibre **must** return a cleanup function (`map.remove()`) to prevent WebGL crashes in Strict Mode
- **UI Framework:** Custom lightweight UI components in `src/components/ui/`:
  - `Button`, `Checkbox`, `Select`, `Slider`, `ColorPicker`
  - Tailwind CSS for styling and layout (flex, grid, positioning, colors)
  - Components are self-contained with minimal dependencies
- **Performance:** Keep components pure. Use `useMemo` for expensive calculations
- **Directory Structure:** 
  - `src/features/map/` - Map page and map-specific components
  - `src/features/map/hooks/` - Custom hooks (useMapUpdates)
  - `src/features/map/utils/` - Map utility functions
  - `src/components/ui/` - Reusable UI components (Button, Checkbox, ColorPicker, Select, Slider)
  - `src/stores/` - Zustand stores for global state
  - `src/styles/map/` - MapLibre layer styles and configurations
  - `src/api/` - Future API client and endpoints

### Map Rendering Architecture (PMTiles + MapLibre)

**Current Implementation:**
- **Base Layer:** PMTiles vector tiles loaded directly via `pmtiles://` protocol
- **No Tile Server:** PMTiles uses HTTP Range Requests for efficient static serving
- **3D Buildings:** MapLibre GL JS fill-extrusion layers (no deck.gl needed yet)
- **Dynamic Styling:** Layer visibility and building height controlled via zustand store

**Key Files:**
- `frontend/src/features/map/MapView.tsx` - MapLibre initialization and layer management
- `frontend/src/features/map/hooks/useMapUpdates.ts` - Custom hook for map style updates
- `frontend/src/features/map/utils/mapUpdaters.ts` - Layer update utility functions
- `frontend/src/features/map/utils/mapCalculations.ts` - Map calculation utilities
- `frontend/src/config/mapSources.ts` - PMTiles source definitions
- `frontend/src/styles/map/` - Map layer styles and configurations
- `frontend/src/stores/mapStore.ts` - Map state (layer visibility, styling, building height)

**Layer Management Pattern:**
```typescript
// In MapView.tsx
useEffect(() => {
  if (!map.current) return;
  
  // Update layer visibility when store changes
  const layerIds = ['buildings-fill', 'buildings-3d'];
  layerIds.forEach(id => {
    if (map.current?.getLayer(id)) {
      map.current.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
    }
  });
}, [visibleLayers.buildings]);
```

### UI Layout Pattern (Custom Components + Floating Sidebar)

**Current Layout:**
- Full-screen map background
- Floating white sidebar (top-left) with rounded corners and shadow
- Collapsible sidebar with toggle button
- Custom UI components with Tailwind styling

**Components:**
- `LayerToggle.tsx` - Checkbox controls for layer visibility
- `StyleSelector.tsx` - Select, Slider, ColorPicker for styling
- `MapPage.tsx` - Layout container with collapsible sidebar
- `src/components/ui/*` - Reusable Button, Checkbox, Select, Slider, ColorPicker

**Style Pattern:**
```tsx
<div className="relative w-full h-screen">
  <MapView />
  {sidebarOpen && (
    <div className="absolute top-[10px] left-[10px] w-[300px] bg-white p-[15px] rounded-[5px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <Button onClick={() => setSidebarOpen(false)} className="mb-[10px]">Close</Button>
      <div className="flex flex-col gap-[20px]">
        <LayerToggle />
        <StyleSelector />
      </div>
    </div>
  )}
</div>
```

# General Coding Principles

- **Clean Code:** Functions should do one thing. Keep files under 200 lines where possible
- **Comments Policy:**
  - **NO docstrings** on functions/classes/modules where the name is self-explanatory
  - Only add comments to explain **WHY**, never **WHAT**
  - Only add comments when the code cannot speak for itself (complex algorithms, non-obvious decisions)
  - TODOs are acceptable for tracking future work
- **Naming:** Make names so clear that comments are unnecessary
  - Python: `snake_case` for variables/functions, `PascalCase` for classes
  - TS/JS: `camelCase` for variables/functions, `PascalCase` for components
  - Examples: `get_buildings()` not `get()`, `calculate_building_height()` not `calc()`

## Key Design Decisions

### PMTiles Serverless Architecture

**Why PMTiles:**
- No tile server needed (Martin/TiTiler removed)
- No database ingestion (direct S3 Parquet → PMTiles conversion)
- HTTP Range Requests = efficient, scalable, cheap
- Static hosting via CDN or local files

**Workflow:**
1. Extract Overture Maps Parquet data for region
2. Convert to PMTiles using `tippecanoe` or `felt/tippecanoe`
3. Serve PMTiles file statically (no backend needed)
4. MapLibre loads tiles on-demand via `pmtiles://` protocol

### Future Texture Generation Strategy

**Cost & Scale:**
- **Archetype Generation:** Create 50 variations per building type (e.g., "Munich Residential, 19th Century")
- **Context-Aware Prompting:** Extract building context (location, style, era) → Stable Diffusion prompt
- **ControlNet:** Maintain structural accuracy (window/door positions) while generating facade textures

**Planned Workflow:**
1. User clicks building on map
2. Frontend sends building ID + context to FastAPI backend
3. Backend generates texture via Stable Diffusion + ControlNet
4. Backend uploads texture to Supabase Storage
5. Backend returns texture URL
6. Frontend renders building with custom texture (deck.gl overlay or MapLibre pattern)

**Rendering Options:**
- **Option A:** deck.gl GeoJsonLayer with custom textures (full 3D control)
- **Option B:** MapLibre fill-extrusion with image patterns (lighter weight)
- **Option C:** Load .glb/.gltf models with Three.js overlay (highest fidelity)

### Data Pipeline Flow

1. Download Overture Maps Parquet files for region
2. Filter buildings, roads, landuse data
3. Convert to GeoJSON or PMTiles format
4. Serve statically - no database needed
5. Future: Store generated textures in Supabase Storage, reference in PostGIS table

## File Structure Patterns

**Frontend:**
- `src/features/map/MapPage.tsx` - Main map layout with floating UI cards
- `src/features/map/MapView.tsx` - MapLibre map initialization and layer management
- `src/features/map/LayerToggle.tsx` - Layer visibility toggle controls
- `src/features/map/StyleSelector.tsx` - Styling controls (buildings, roads, landuse, background)
- `src/stores/mapStore.ts` - Zustand store for map state (layers, styling, building height)
- `src/config/mapSources.ts` - PMTiles source definitions
- `src/styles/map/` - MapLibre layer definitions and styling configurations
- `src/api/client.ts` - Future: API client for texture generation

**Backend:**
- `backend/app/main.py` - FastAPI app entry point
- `backend/app/api/routes/` - Future: Texture generation endpoints
- `backend/app/schemas.py` - Pydantic models for API requests/responses
- `backend/app/services/` - Future: Stable Diffusion + ControlNet integration

**Database:**
- `supabase/schemas/01_init.sql` - PostGIS extension setup
- `supabase/schemas/02_map_config.sql` - Placeholder for future texture storage tables
- **Note:** No base map data in database (PMTiles handles it)

## Database Schema Management

**Current State:** Minimal database usage. PostGIS enabled for future features.

**Future Tables (not yet implemented):**
- `generated_textures` - Store AI-generated building textures (URLs, metadata)
- `custom_buildings` - User-created or modified buildings with custom geometry/textures
- `texture_cache` - Archetype textures to reuse across similar buildings

**Schema Workflow:**
1. Edit `supabase/schemas/*.sql` files (declarative, idempotent)
2. User applies SQL via Supabase Dashboard (production-only workflow for now)
3. Commit changes to source control

## Current Implementation Status

✅ **Completed:**
- PMTiles integration with MapLibre GL JS
- Layer visibility controls (buildings, roads, landuse)
- Dynamic styling (building height, colors, styles)
- Blueprint JS UI with floating cards
- Zustand state management for map controls
- 3D building extrusions with height multiplier

🚧 **Not Yet Implemented:**
- Texture generation backend (Stable Diffusion + ControlNet)
- Building selection/click handlers
- deck.gl overlay for textured buildings
- Supabase Storage integration for textures
- User authentication
- Texture archetype caching

## Development Workflow

1. **Frontend Development:** `cd frontend && npm run dev`
2. **Backend Development:** `cd backend && uvicorn app.main:app --reload` (currently minimal)
3. **PMTiles Generation:** Use `tippecanoe` or `felt/tippecanoe` to convert GeoJSON → PMTiles

## Notes

- React 19.2 with Strict Mode enabled
- Blueprint JS components instead of shadcn/ui (desktop-like UI framework)
- No tile server or database ingestion (PMTiles serverless approach)
- Supabase reserved for future texture storage and user data
- Focus: Get texture generation working before scaling to multiple cities
