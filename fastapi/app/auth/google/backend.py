import requests

from ..base.libs import OAuthBackend
from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User

GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
GOOGLE_SCOPE_PROFILE = "https://www.googleapis.com/auth/userinfo.profile"
GOOGLE_SCOPE_EMAIL = "https://www.googleapis.com/auth/userinfo.email"


class GoogleAuthBackend(OAuthBackend):
    def get_profile(self, access_token: str) -> dict:
        response = requests.get(url=GOOGLE_USERINFO_URL,
                                params={'access_token': access_token})
        if not response.ok:
            raise BadCredentialException(
                'Failed to get user information from Google.')
        return response.json()

    def update_profile(self, user: User, profile: dict) -> User:
        user = super().update_profile(user, profile)
        if user.first_name == None:
            user.first_name = profile.get('given_name')
        if user.last_name == None:
            user.last_name = profile.get('family_name')
        if user.picture == None:
            user.picture = profile.get('picture')
        return user


auth_backend = GoogleAuthBackend(
    name="jwt-google",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
    oauth_name='google',
    has_profile_callback=True,
)
