from datetime import datetime
import json
from typing import Any, Optional

import requests
from fastapi import Response
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy import Strategy

from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User
from .constants import KAKAO_USERINFO_URL


class KakaoAuthBackend(AuthenticationBackend):
    async def login(self, strategy: Strategy, user: User, response: Response) -> Any:
        strategy_response = await super().login(strategy, user, response)
        token = self.get_access_token(user)
        profile = get_profile(token)
        await update_profile(user, profile).save()
        return strategy_response

    def get_access_token(self, user: User) -> Optional[str]:
        for account in user.oauth_accounts:
            if account.oauth_name == 'kakao':
                return account.access_token
        return None


def get_profile(access_token: str) -> dict:
    headers = dict(Authorization=f'Bearer {access_token}')
    response = requests.post(KAKAO_USERINFO_URL,
                             headers=headers,
                             params={"property_keys": json.dumps(["kakao_account.profile"])})
    if not response.ok:
        raise BadCredentialException(
            'Failed to get user information from Kakao.')

    profile = dict(response.json())
    kakao_account = profile.get('kakao_account')
    return kakao_account.get('profile')


def update_profile(user: User, profile: dict) -> User:
    if user.picture == None:
        user.picture = profile.get('profile_image_url')
    user.last_login_at = datetime.now()
    return user


auth_backend_kakao = KakaoAuthBackend(
    name="jwt-kakao",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)
