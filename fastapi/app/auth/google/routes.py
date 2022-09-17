
import requests
from app.configs import Configs
from httpx_oauth.clients.google import GoogleOAuth2

from ..exceptions import BadCredentialException
from ..libs import auth_backend, fastapi_users

GOOGLE_USERINFO_API = "https://www.googleapis.com/oauth2/v3/userinfo"
GOOGLE_SCOPE_PROFILE = "https://www.googleapis.com/auth/userinfo.profile"
GOOGLE_SCOPE_EMAIL = "https://www.googleapis.com/auth/userinfo.email"

google_oauth_client = GoogleOAuth2(
    client_id=Configs.GOOGLE_CLIENT_ID,
    client_secret=Configs.GOOGLE_CLIENT_SECRET,
    scope=[
        GOOGLE_SCOPE_PROFILE, GOOGLE_SCOPE_EMAIL, "openid"
    ],
)

router = fastapi_users.get_oauth_router(
    oauth_client=google_oauth_client,
    backend=auth_backend,
    state_secret=Configs.SECRET_KEY,
    redirect_url=Configs.GOOGLE_CALLBACK_URL
)


def get_profile_from_google(access_token: str):
    response = requests.get(url=GOOGLE_USERINFO_API,
                            params={'access_token': access_token})

    if not response.ok:
        raise BadCredentialException(
            'Failed to get user information from Google.')

    return response.json()
