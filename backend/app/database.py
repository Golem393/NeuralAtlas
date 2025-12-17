from typing import Any

from supabase.client import create_client

from .config import settings


def get_supabase_client() -> Any:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise ValueError("Supabase credentials not configured in .env")

    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY,
    )


supabase = get_supabase_client()
