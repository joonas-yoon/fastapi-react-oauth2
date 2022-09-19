
from app.configs import Configs
from httpx_oauth.clients.google import GoogleOAuth2

from ..libs import fastapi_users
from .constants import GOOGLE_SCOPE_EMAIL, GOOGLE_SCOPE_PROFILE
from .libs import auth_backend

google_oauth_client = GoogleOAuth2(
    client_id=Configs.GOOGLE_CLIENT_ID,
    client_secret=Configs.GOOGLE_CLIENT_SECRET,
    scope=[
        GOOGLE_SCOPE_PROFILE, GOOGLE_SCOPE_EMAIL, "openid"
    ],
)

google_oauth_router = fastapi_users.get_oauth_router(
    oauth_client=google_oauth_client,
    backend=auth_backend,
    state_secret=Configs.SECRET_KEY,
    redirect_url=Configs.GOOGLE_CALLBACK_URL,
    associate_by_email=True,
)
