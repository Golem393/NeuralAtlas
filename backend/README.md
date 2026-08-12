# NeuralAtlas Backend

FastAPI backend for NeuralAtlas.

## Status

This is scaffolding. The backend currently serves **health check endpoints
only**, and the frontend does not call it — the map viewer reads static PMTiles
files directly and runs standalone.

The one piece of real functionality here is `scripts/`, the offline pipeline
that generates those PMTiles from Overture Maps data.

## Tech Stack

- **FastAPI**: Async Python web framework
- **Supabase**: Client configured in `app/database.py`, unused by the running app
- **overturemaps CLI + tippecanoe**: Offline tile generation (`scripts/`)

## Project Structure

```text
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Settings (pydantic-settings)
│   ├── database.py          # Supabase client factory (unused at runtime)
│   └── api/
│       └── routes/
│           └── health.py    # Health check endpoints
├── scripts/
│   ├── generate_pmtiles_fast_munich.py
│   └── generate_pmtiles_fast_cortina.py
├── pyproject.toml
└── .env.example
```

## Setup

Requires Python 3.11+.

```bash
cd backend
pip install -e ".[dev]"
cp .env.example .env
fastapi dev app/main.py
```

Available at:

- API: <http://localhost:8000>
- Interactive docs: <http://localhost:8000/docs>
- Alternative docs: <http://localhost:8000/redoc>

No Supabase credentials are needed to start the server — `app/main.py` does not
import `database.py`. (Note that importing `database.py` without credentials
raises at import time.)

### Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

- `GET /` - Root endpoint with API info
- `GET /api/health` - Health check
- `GET /api/ready` - Readiness check (always reports `database: not_configured`)

That is the complete surface. There are no tile, data, or texture endpoints.

## Tile Generation Scripts

`scripts/generate_pmtiles_fast_*.py` download Overture Maps layers for a
bounding box and tile them into PMTiles archives under `data/pmtiles/` at the
repo root.

Prerequisites:

```bash
pip install overturemaps
# tippecanoe: apt install tippecanoe, brew install tippecanoe, or build from source
```

Then run a script and copy the resulting archives into
`frontend/public/data/`. See the [root README](../README.md#generating-map-data).

## Development

```bash
ruff format .        # Format
ruff check . --fix   # Lint and auto-fix
mypy app/            # Type check
pytest               # Tests (none written yet)
```

### Pre-commit Hooks

```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

## Configuration

See `.env.example`. The only variables the running app reads are `APP_NAME`,
`VERSION`, `ENVIRONMENT`, and `CORS_ORIGINS`; the rest are placeholders for
future use.
