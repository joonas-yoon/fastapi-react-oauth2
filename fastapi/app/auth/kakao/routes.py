from app.configs import Configs

from ..libs import fastapi_users
from .client import KakaoOAuth2
from .backend import auth_backend

kakao_oauth_client = KakaoOAuth2(
    client_id=Configs.KAKAO_CLIENT_ID,
    client_secret=Configs.KAKAO_CLIENT_SECRET,
    scopes=[
        "profile_nickname", "profile_image", "account_email",
    ]
)

kakao_oauth_router = fastapi_users.get_oauth_router(
    oauth_client=kakao_oauth_client,
    backend=auth_backend,
    state_secret=Configs.SECRET_KEY,
    redirect_url=Configs.KAKAO_CALLBACK_URL,
    associate_by_email=True,
)
