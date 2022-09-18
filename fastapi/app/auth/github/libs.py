from datetime import datetime
from typing import Any, Optional

import requests
from fastapi import Response
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy import Strategy

from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User
from .constants import GITHUB_USERINFO_URL


class GithubAuthBackend(AuthenticationBackend):
    async def login(self, strategy: Strategy, user: User, response: Response) -> Any:
        strategy_response = await super().login(strategy, user, response)
        token = self.get_google_access_token(user)
        profile = get_profile(token)
        await update_profile(user, profile).save()
        await user.save()
        return strategy_response

    def get_google_access_token(self, user: User) -> Optional[str]:
        for account in user.oauth_accounts:
            if account.oauth_name == 'github':
                return account.access_token
        return None


def get_profile(access_token: str) -> dict:
    headers = dict(Authorization=f'Bearer {access_token}')
    response = requests.get(GITHUB_USERINFO_URL, headers=headers)
    if not response.ok:
        raise BadCredentialException(
            'Failed to get user information from Github.')
    profile = dict(response.json())
    name = profile.get('name').split()
    try:
        profile.update({
            "first_name": name[0],
            "last_name": name[1],
        })
    except:
        pass
    return profile


def update_profile(user: User, profile: dict) -> User:
    if user.first_name == None:
        user.first_name = profile.get('first_name')
    if user.last_name == None:
        user.last_name = profile.get('last_name')
    if user.picture == None:
        user.picture = profile.get('avatar_url')
    user.last_login_at = datetime.now()
    return user


auth_backend_github = GithubAuthBackend(
    name="jwt-github",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)
