
from typing import Any, Optional

import requests
from fastapi import Response
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy import Strategy

from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User
from .constants import GOOGLE_USERINFO_API


class GoogleAuthBackend(AuthenticationBackend):
    async def login(self, strategy: Strategy, user: User, response: Response) -> Any:
        strategy_response = await super().login(strategy, user, response)
        token = self.get_google_access_token(user)
        userinfo = get_profile_from_google(token)
        user.first_name = userinfo.get('given_name')
        user.last_name = userinfo.get('family_name')
        user.picture = userinfo.get('picture')
        await user.save()
        return strategy_response

    def get_google_access_token(self, user: User) -> Optional[str]:
        for account in user.oauth_accounts:
            if account.oauth_name == 'google':
                return account.access_token
        return None


def get_profile_from_google(access_token: str) -> dict:
    response = requests.get(url=GOOGLE_USERINFO_API,
                            params={'access_token': access_token})
    if not response.ok:
        raise BadCredentialException(
            'Failed to get user information from Google.')
    return response.json()


auth_backend_google = GoogleAuthBackend(
    name="jwt-google",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)
