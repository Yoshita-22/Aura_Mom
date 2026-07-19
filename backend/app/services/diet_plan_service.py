import json
import os
from datetime import date
from typing import Optional

from fastapi import HTTPException
from google import genai

from app.schemas.diet import DietResponse


def _safe_data(response) -> Optional[dict]:
    """
    supabase-py v2: .maybe_single().execute() returns None (not a Response)
    when no row matches. This helper safely extracts .data or returns None.
    """
    if response is None:
        return None
    return response.data


class DietPlanService:
    def __init__(self, supabase):
        self.supabase = supabase
        self.client = genai.Client(
            api_key=os.getenv("DIET_PLAN_KEY")
        )

    async def _get_today_diet(
        self,
        user_id: str,
        today: str
    ) -> Optional[dict]:
        """Returns today's diet if it already exists in the DB."""
        response = (
            self.supabase.table("daily_diets")
            .select("*")
            .eq("user_id", user_id)
            .eq("diet_date", today)
            .maybe_single()
            .execute()
        )
        
        return _safe_data(response)

    async def _get_previous_diet(
        self,
        user_id: str
    ) -> Optional[dict]:
        """Returns the latest diet before today."""
        today = date.today().isoformat()
        response = (
            self.supabase.table("daily_diets")
            .select("*")
            .eq("user_id", user_id)
            .lt("diet_date", today)
            .order("diet_date", desc=True)
            .limit(1)
            .maybe_single()
            .execute()
        )
        return _safe_data(response)

    async def _get_profile(
        self,
        user_id: str
    ) -> Optional[dict]:
        """Returns the user's profile."""
        response = (
            self.supabase.table("profiles")
            .select("*")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )
        return _safe_data(response)

    async def _save_diet(
        self,
        user_id: str,
        diet_date: str,
        diet: DietResponse
    ):
        payload = {
            "user_id": user_id,
            "diet_date": diet_date,
            "breakfast": diet.breakfast.model_dump(),
            "morning_snack": diet.morning_snack.model_dump(),
            "lunch": diet.lunch.model_dump(),
            "evening_snack": diet.evening_snack.model_dump(),
            "dinner": diet.dinner.model_dump(),
            "nutrition_summary": diet.nutrition_summary.model_dump() if diet.nutrition_summary else None
        }
        (
            self.supabase.table("daily_diets")
            .insert(payload)
            .execute()
        )

    async def _generate_diet(
        self,
        profile: dict,
        previous_diet: Optional[dict]
    ) -> DietResponse:
        """Generates a personalized one-day pregnancy diet plan using Gemini."""
        previous_diet_text = (
            json.dumps(previous_diet, indent=2)
            if previous_diet
            else "No previous diet available."
        )

        prompt = f"""
You are AuraMom's AI prenatal nutritionist.

Create a healthy one-day Indian diet plan for a pregnant woman.

Profile
-------
Pregnancy Month: {profile["pregnancy_month"]}
Occupation: {profile["occupation"]}
Goals: {", ".join(profile["goals"])}
Preferred Language: {profile["language"]}

Previous Diet
-------------
{previous_diet_text}

Instructions
------------
1. Do NOT repeat meals from the previous diet.
2. Tailor meals according to pregnancy month.
3. Use easily available Indian foods.
4. Mention serving sizes in grams (g), milliliters (ml), or pieces.
5. Give one short reason for each meal.
6. Do NOT recommend medicines or supplements.
7. Estimate total nutrients for the entire day.

Nutrition Summary must include:
- protein_g
- iron_mg
- calcium_mg
- folate_mcg
- fiber_g
- vitamin_c_mg
- water_liters

Return ONLY valid JSON — no markdown, no explanation, just raw JSON.

Expected JSON format:

{{
  "breakfast": {{
    "meal": "",
    "serving_size": "",
    "reason": ""
  }},
  "morning_snack": {{
    "meal": "",
    "serving_size": "",
    "reason": ""
  }},
  "lunch": {{
    "meal": "",
    "serving_size": "",
    "reason": ""
  }},
  "evening_snack": {{
    "meal": "",
    "serving_size": "",
    "reason": ""
  }},
  "dinner": {{
    "meal": "",
    "serving_size": "",
    "reason": ""
  }},
  "nutrition_summary": {{
    "protein_g": 0,
    "iron_mg": 0,
    "calcium_mg": 0,
    "folate_mcg": 0,
    "fiber_g": 0,
    "vitamin_c_mg": 0,
    "water_liters": 0
  }}
}}
"""
        response = self.client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        response_text = response.text.strip()

        # Remove markdown if Gemini returns ```json ... ```
        if response_text.startswith("```"):
            response_text = (
                response_text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

        try:
            diet = json.loads(response_text)
        except json.JSONDecodeError as e:
            raise ValueError(
                f"Gemini returned invalid JSON:\n{response_text}"
            ) from e

        return DietResponse(**diet)

    async def get_or_create_today_diet(self, user_id: str) -> DietResponse:
        """
        Returns today's diet if it already exists.
        Otherwise generates, stores and returns a new diet plan.
        """
        today = date.today().isoformat()

        # Step 1: Check if today's diet already exists
        today_diet = await self._get_today_diet(user_id, today)
        
        if today_diet:
            # Parse any stringified JSON fields returned by Supabase
            for key in ["breakfast", "morning_snack", "lunch", "evening_snack", "dinner", "nutrition_summary"]:
                if isinstance(today_diet.get(key), str):
                    today_diet[key] = json.loads(today_diet[key])
            # Strip Supabase-only fields that DietResponse doesn't know about
            diet_fields = {"breakfast", "morning_snack", "lunch", "evening_snack", "dinner", "nutrition_summary"}
            filtered = {k: v for k, v in today_diet.items() if k in diet_fields}
            return DietResponse(**filtered)

        # Step 2: Fetch user profile
        profile = await self._get_profile(user_id)
        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found. Please complete onboarding first."
            )
        

        # Step 3: Fetch yesterday's diet (if any)
        previous_diet = await self._get_previous_diet(user_id)
        

        # Step 4: Ask Gemini to generate today's diet
        generated_diet = await self._generate_diet(
            profile=profile,
            previous_diet=previous_diet
        )
        

        # Step 5: Save today's diet
        await self._save_diet(
            user_id=user_id,
            diet_date=today,
            diet=generated_diet
        )

        return generated_diet