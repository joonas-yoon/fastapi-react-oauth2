from fastapi import APIRouter, Depends
from .models import User, UserCreate, UserRead, UserUpdate
from .libs import auth_backend, current_active_user, fastapi_users

CLIENT_REDIRECT_URL = "http://localhost:3000/auth/google"
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_API = "https://oauth2.googleapis.com/token"

router = APIRouter()

get_auth_router = fastapi_users.get_auth_router(auth_backend)
get_register_router = fastapi_users.get_register_router(UserRead, UserCreate)
get_reset_password_router = fastapi_users.get_reset_password_router()
get_verify_router = fastapi_users.get_verify_router(UserRead)
get_users_router = fastapi_users.get_users_router(UserRead, UserUpdate)

routers = [
    (router, dict(prefix="/auth", tags=["auth"])),
    (get_auth_router, dict(prefix="/auth/jwt", tags=["auth"])),
    (get_register_router, dict(prefix="/auth", tags=["auth"])),
    (get_reset_password_router, dict(prefix="/auth", tags=["auth"])),
    (get_verify_router, dict(prefix="/auth", tags=["auth"])),
    (get_users_router, dict(prefix="/users", tags=["users"])),
]


@router.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}
