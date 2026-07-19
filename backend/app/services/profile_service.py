from app.db.config import supabase


class ProfileService:

    @staticmethod
    def create_profile(user_id: str, profile):

        data = {
            "id": user_id,
            "name": profile.name,
            "language": profile.language,
            "pregnancy_month": profile.pregnancy_month,
            "occupation": profile.occupation,
            "goals": profile.goals,
            "family_members": profile.family_members,
        }

        response = (
            supabase
            .table("profiles")
            .insert(data)
            .execute()
        )

        return {"message": "Profile created successfully"}

    @staticmethod
    def update_profile(user_id: str, profile):

        data = {
            "name": profile.name,
            "language": profile.language,
            "pregnancy_month": profile.pregnancy_month,
            "occupation": profile.occupation,
            "goals": profile.goals,
            "family_members": profile.family_members,
        }

        response = (
            supabase
            .table("profiles")
            .update(data)
            .eq("id", user_id)
            .execute()
        )

        return response.data

    @staticmethod
    def get_profile(user_id: str):

        response = (
            supabase
            .table("profiles")
            .select("*")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )

        # supabase-py v2: maybe_single() returns None (not a Response) when no row found
        if response is None:
            return None
        return response.data

    @staticmethod
    def delete_profile(user_id: str):
        # Delete user from auth.users (cascade deletes their data)
        response = supabase.auth.admin.delete_user(user_id)
        return {"message": "Account deleted permanently"}