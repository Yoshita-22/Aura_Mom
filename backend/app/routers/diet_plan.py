from fastapi import APIRouter, Depends

from app.db.config import supabase
from app.schemas.diet import DietResponse
from app.services.diet_plan_service import DietPlanService
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/diet-plan",
    tags=["Diet Plan"]
)


@router.get(
    "/today",
    response_model=DietResponse,
    summary="Get today's personalized diet plan"
)
async def get_today_diet(
    current_user=Depends(get_current_user)
):
    service = DietPlanService(supabase)
    
    return await service.get_or_create_today_diet(
        current_user.id
    )