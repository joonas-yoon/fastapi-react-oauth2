import json

import requests

from ..base.libs import OAuthBackend
from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User

NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me'


class NaverAuthBackend(OAuthBackend):
    def get_profile(self, access_token: str) -> dict:
        headers = dict(Authorization=f'Bearer {access_token}')
        response = requests.post(NAVER_USERINFO_URL, headers=headers)
        print(response.json())
        if not response.ok:
            raise BadCredentialException(
                'Failed to get user information from NAVER')
        profile = response.json()
        return profile.get('response')

    def update_profile(self, user: User, profile: dict) -> User:
        user = super().update_profile(user, profile)
        print('profile', profile)
        if user.picture == None:
            user.picture = profile.get('profile_image')
        return user


auth_backend = NaverAuthBackend(
    name="jwt-naver",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
    oauth_name='naver',
    has_profile_callback=True,
)
