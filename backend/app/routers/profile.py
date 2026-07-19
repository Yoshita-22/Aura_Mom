from fastapi import APIRouter, Depends

from app.schemas.profile import ProfileCreateRequest
from app.services.profile_service import ProfileService
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)
@router.post("/")
async def create_profile(
    profile: ProfileCreateRequest,
    user=Depends(get_current_user)
):

    return ProfileService.create_profile(
        user.id,
        profile
    )
@router.get("/")
async def get_profile(
    user=Depends(get_current_user)
):

    return ProfileService.get_profile(
        user.id
    )
@router.put("/")
async def update_profile(
    profile: ProfileCreateRequest,
    user=Depends(get_current_user)
):

    return ProfileService.update_profile(
        user.id,
        profile
    )

@router.delete("/")
async def delete_profile(
    user=Depends(get_current_user)
):
    return ProfileService.delete_profile(user.id)