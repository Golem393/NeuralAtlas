# NeuralAtlas Backend

FastAPI backend for the NeuralAtlas 3D geospatial visualization platform.

## Architecture

This backend serves as the data and processing layer for NeuralAtlas, providing:

- **Vector Tiles**: Proxying to Martin (Rust tile server) for building geometry from PostGIS
- **Raster Tiles**: Proxying to TiTiler for satellite imagery and terrain data
- **AI Texture Generation**: API endpoints for Stable Diffusion + ControlNet texture generation
- **Data Pipeline**: Integration with Overture Maps, OSM, and other geospatial data sources

## Tech Stack

- **FastAPI**: Modern async Python web framework
- **Supabase**: Managed PostgreSQL + PostGIS spatial database
- **Martin**: Rust-based vector tile server (external service)
- **TiTiler**: Raster tile server (external service)
- **DuckDB**: Direct Parquet file querying from S3
- **PyTorch**: ML model inference (planned)

## Project Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Settings and configuration
│   └── api/
│       └── routes/
│           ├── health.py    # Health check endpoints
│           └── tiles.py     # Tile proxy endpoints
├── pyproject.toml           # Project dependencies and config
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Setup

### Prerequisites

- Python 3.11+
- Supabase account (free tier includes PostGIS)
- Martin tile server (optional, for vector tiles)
- TiTiler (optional, for raster tiles)

### Installation

1. **Install dependencies**:

   ```bash
   cd backend
   pip install -e ".[dev]"
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run development server**:

   ```bash
   fastapi dev app/main.py
   ```

   The API will be available at:
   - API: <http://localhost:8000>
   - Interactive docs: <http://localhost:8000/docs>
   - Alternative docs: <http://localhost:8000/redoc>

### Production

Run with uvicorn:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Core Endpoints

- `GET /` - Root endpoint with API info
- `GET /api/health` - Health check
- `GET /api/ready` - Readiness check (includes DB status)

### Tile Endpoints (Planned)

- `GET /api/tiles/` - List available tile sources
- `GET /api/tiles/{source_id}/{z}/{x}/{y}.mvt` - Vector tiles (proxied to Martin)
- `GET /api/tiles/raster/{z}/{x}/{y}.png` - Raster tiles (proxied to TiTiler)

## Development

### Code Quality

Format code:

```bash
black app/
ruff check app/ --fix  # Auto-fix issues
```

Type checking:

```bash
mypy app/
```

### Testing

Run tests:

```bash
pytest
pytest --cov=app  # With coverage
```

### Pre-commit Hooks

Automatically format and lint before each commit:

```bash
# Install pre-commit (from root directory)
pip install pre-commit
pre-commit install

# Run manually on all files
pre-commit run --all-files
```

Hooks will:

- Format Python code with Black
- Lint with Ruff and auto-fix issues
- Check types with mypy
- Sort imports
- Remove trailing whitespace
- Check YAML/JSON syntax

## Configuration

Key environment variables (see `.env.example`):

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous/public key
- `SUPABASE_SERVICE_KEY`: Supabase service role key (backend only)
- `DATABASE_URL`: Supabase PostgreSQL connection string (for direct SQL access)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `TITILER_URL`: TiTiler service URL
- `MARTIN_URL`: Martin tile server URL
- `ENVIRONMENT`: deployment environment (development/production)

## Integration with Frontend

The frontend (React + MapLibre + deck.gl) will:

1. Fetch vector tiles from `/api/tiles/{source}/{z}/{x}/{y}.mvt`
2. Fetch raster tiles from `/api/tiles/raster/{z}/{x}/{y}.png`
3. Request 3D model texture generation via AI endpoints (to be implemented)
