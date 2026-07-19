from pydantic import BaseModel


class Meal(BaseModel):
    meal: str
    serving_size: str
    reason: str = ""


class NutritionSummary(BaseModel):
    protein_g: float
    iron_mg: float
    calcium_mg: float
    folate_mcg: float
    fiber_g: float
    vitamin_c_mg: float
    water_liters: float = 0.0


class DietResponse(BaseModel):
    breakfast: Meal
    morning_snack: Meal
    lunch: Meal
    evening_snack: Meal
    dinner: Meal
    nutrition_summary: NutritionSummary | None = None