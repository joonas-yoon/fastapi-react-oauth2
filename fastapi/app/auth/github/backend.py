import requests

from ..base.libs import OAuthBackend
from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User

GITHUB_USERINFO_URL = 'https://api.github.com/user'


class GithubAuthBackend(OAuthBackend):
    def get_profile(self, access_token: str) -> dict:
        headers = dict(Authorization=f'Bearer {access_token}')
        response = requests.get(GITHUB_USERINFO_URL, headers=headers)
        if not response.ok:
            raise BadCredentialException(
                'Failed to get user information from Github.')
        return response.json()

    def update_profile(self, user: User, profile: dict) -> User:
        user = super().update_profile(user, profile)
        try:
            name = profile.get('name').split()
            if user.first_name == None:
                user.first_name = name[0]
            if user.last_name == None:
                user.last_name = name[1]
        except:
            pass
        if user.picture == None:
            user.picture = profile.get('avatar_url')
        return user


auth_backend = GithubAuthBackend(
    name="jwt-github",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
    oauth_name='github',
    has_profile_callback=True,
)
