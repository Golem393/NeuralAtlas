from typing import Any, List, cast

from fastapi import APIRouter, HTTPException

from app.database import supabase
from app.schemas import Building

router = APIRouter()


@router.get("/", response_model=List[Building])
async def get_buildings() -> List[Building]:
    try:
        response = supabase.table("buildings").select("*").execute()
        return cast(List[Building], response.data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{building_id}", response_model=Building)
async def get_building(building_id: int) -> Building:
    try:
        response = supabase.table("buildings").select("*").eq("id", building_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Building not found")

        data: List[Any] = response.data
        return cast(Building, data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
