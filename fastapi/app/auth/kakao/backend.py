import json

import requests

from ..base.libs import OAuthBackend
from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User

KAKAO_USERINFO_URL = 'https://kapi.kakao.com/v2/user/me'


class KakaoAuthBackend(OAuthBackend):
    def get_profile(self, access_token: str) -> dict:
        headers = dict(Authorization=f'Bearer {access_token}')
        response = requests.post(KAKAO_USERINFO_URL,
                                 headers=headers,
                                 params={"property_keys": json.dumps(["kakao_account.profile"])})
        if not response.ok:
            raise BadCredentialException(
                'Failed to get user information from Kakao.')

        return response.json()

    def update_profile(self, user: User, profile: dict) -> User:
        user = super().update_profile(user, profile)
        kakao_account = profile.get('kakao_account')
        profile = kakao_account.get('profile')
        if user.picture == None:
            user.picture = profile.get('profile_image_url')
        return user


auth_backend = KakaoAuthBackend(
    name="jwt-kakao",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
    oauth_name='kakao',
    has_profile_callback=True,
)
