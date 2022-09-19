from datetime import datetime
from typing import Any, Optional

from fastapi import Response
from fastapi_users import models
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy import Strategy
from fastapi_users.authentication.transport import Transport
from fastapi_users.types import DependencyCallable

from ..models import User


class OAuthBackend(AuthenticationBackend):
    def __init__(
        self,
        name: str,
        transport: Transport,
        get_strategy: DependencyCallable[Strategy[models.UP, models.ID]],
        oauth_name: str,
        has_profile_callback: bool = False,
    ):
        super().__init__(name, transport, get_strategy)
        self.oauth_name = oauth_name
        self.has_profile_callback = has_profile_callback

    async def login(self, strategy: Strategy, user: User, response: Response) -> Any:
        strategy_response = await super().login(strategy, user, response)
        user.last_login_at = datetime.now()
        if self.has_profile_callback:
            token = self.get_access_token(user)
            profile = self.get_profile(token)
            user = self.update_profile(user, profile)
        await user.save()
        return strategy_response

    def get_access_token(self, user: User) -> Optional[str]:
        for account in user.oauth_accounts:
            if account.oauth_name == self.oauth_name:
                return account.access_token
        return None

    def get_profile(self, access_token: str) -> dict:
        return {}

    def update_profile(self, user: User, profile: dict) -> User:
        return user
