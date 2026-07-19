from pydantic import BaseModel, Field
from typing import List, Literal


class ProfileCreateRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Mother's name"
    )

    language: Literal["English", "Hindi", "Telugu"]

    pregnancy_month: int = Field(
        ...,
        ge=1,
        le=9,
        description="Current pregnancy month"
    )

    occupation: Literal[
        "Housewife",
        "Employee",
        "Student",
        "Business",
        "Other"
    ]

    goals: List[
        Literal[
            "Nurture My Baby",
            "Reduce Stress",
            "Healthy Diet",
            "Guided Meditation",
            "Reduce Loneliness",
            "Positive Affirmations"
        ]
    ]

    family_members: int = Field(
        ...,
        ge=1,
        le=20
    )
class ProfileResponse(BaseModel):
    id: str
    name: str
    language: str
    pregnancy_month: int
    occupation: str
    goals: List[str]
    family_members: int

    class Config:
        from_attributes = True