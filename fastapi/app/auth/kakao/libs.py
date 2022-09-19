from datetime import datetime
from typing import Any, Optional

import requests
from fastapi import Response
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy import Strategy

from ..exceptions import BadCredentialException
from ..libs import bearer_transport, get_jwt_strategy
from ..models import User


class KakaoAuthBackend(AuthenticationBackend):
    async def login(self, strategy: Strategy, user: User, response: Response) -> Any:
        strategy_response = await super().login(strategy, user, response)
        print('user', user)
        return strategy_response

    def get_google_access_token(self, user: User) -> Optional[str]:
        for account in user.oauth_accounts:
            if account.oauth_name == 'kakao':
                return account.access_token
        return None


auth_backend_kakao = KakaoAuthBackend(
    name="jwt-kakao",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)
