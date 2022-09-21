from app.configs import Configs

from ..libs import fastapi_users
from .client import NaverOAuth2
from .backend import auth_backend

naver_oauth_client = NaverOAuth2(
    client_id=Configs.NAVER_CLIENT_ID,
    client_secret=Configs.NAVER_CLIENT_SECRET
)

naver_oauth_router = fastapi_users.get_oauth_router(
    oauth_client=naver_oauth_client,
    backend=auth_backend,
    state_secret=Configs.SECRET_KEY,
    redirect_url=Configs.NAVER_CALLBACK_URL,
    associate_by_email=True,
)
