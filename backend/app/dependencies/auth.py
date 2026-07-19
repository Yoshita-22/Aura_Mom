from fastapi import Header, HTTPException
from app.db.config import supabase


async def get_current_user(
    authorization: str = Header(...)
):
    # Check Authorization header
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization Header"
        )

    # Extract JWT
    token = authorization.split(" ")[1]

    try:
        # Verify token with Supabase
        response = supabase.auth.get_user(token)

        # If token is invalid
        if response.user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        return response.user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Authentication Failed"
        )