from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Building(BaseModel):
    id: int
    name: Optional[str] = None
    address: Optional[str] = None
    building_type: Optional[str] = None
    height: Optional[float] = None
    num_floors: Optional[int] = None
    year_built: Optional[int] = None
    created_at: datetime
    updated_at: datetime
