from typing import Any, Dict

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "neuralatlas-backend",
    }


@router.get("/ready")
async def readiness_check() -> Dict[str, Any]:
    return {
        "status": "ready",
        "database": "not_configured",
    }
