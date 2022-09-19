
from app.configs import Configs
from httpx_oauth.clients.github import GitHubOAuth2

from ..libs import fastapi_users
from .backend import auth_backend

github_oauth_client = GitHubOAuth2(
    client_id=Configs.GITHUB_CLIENT_ID,
    client_secret=Configs.GITHUB_CLIENT_SECRET,
)

github_oauth_router = fastapi_users.get_oauth_router(
    oauth_client=github_oauth_client,
    backend=auth_backend,
    state_secret=Configs.SECRET_KEY,
    redirect_url=Configs.GITHUB_CALLBACK_URL,
    associate_by_email=True,
)
