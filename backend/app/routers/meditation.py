from typing import List
from fastapi import APIRouter, Depends

from pydantic import BaseModel
from app.services.meditation_service import MeditationService
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/meditation",
    tags=["Meditation"]
)

class MeditationRequest(BaseModel):
    feeling: str
    bothers: List[str]
    pregnancy_month: int

@router.post("/generate")
async def generate_meditation(
    req: MeditationRequest,
    user=Depends(get_current_user)
):
    service = MeditationService()
    return service.generate_meditation(
        feeling=req.feeling,
        bothers=req.bothers,
        pregnancy_month=req.pregnancy_month
    )
