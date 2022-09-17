import secrets

import requests
from app.configs import Configs
from app.utils import params_to_uri
from fastapi import APIRouter, Request
from fastapi import status as Status
from fastapi.responses import JSONResponse

from ..exceptions import BadCredentialException
from ..models import User

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_API = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_API = "https://www.googleapis.com/oauth2/v3/userinfo"

GOOGLE_SCOPE_PROFILE = "https://www.googleapis.com/auth/userinfo.profile"
GOOGLE_SCOPE_EMAIL = "https://www.googleapis.com/auth/userinfo.email"

router = APIRouter()


@router.get("/google/authorize")
def google_authorize_url(request: Request):
    scopes = [GOOGLE_SCOPE_PROFILE, GOOGLE_SCOPE_EMAIL, "openid"]
    payload = dict(
        response_type="code",
        client_id=Configs.GOOGLE_CLIENT_ID,
        redirect_uri=Configs.GOOGLE_CALLBACK_URL,
        state=secrets.token_urlsafe(64),
        scope=" ".join(scopes),
    )

    url = GOOGLE_AUTH_URL + "?" + params_to_uri(payload)
    return dict(authorization_url=url)


@router.get("/google/token")
async def google_access_token(request: Request, code: str = ""):
    payload = {
        "client_id": Configs.GOOGLE_CLIENT_ID,
        "client_secret": Configs.GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": Configs.GOOGLE_CALLBACK_URL
    }

    headers = {
        "Accept": "application/json"
    }

    res = requests.post(GOOGLE_TOKEN_API,
                        params=payload,
                        headers=headers)

    response = res.json()
    print(response)

    try:
        if "error" in response:
            raise BadCredentialException(response.get('error'))
        profile = get_profile_from_google(response.get('access_token'))
        await register_by_google(profile)
        return JSONResponse(status_code=Status.HTTP_200_OK, content=response)
    except Exception as e:
        print(e)
        return JSONResponse(status_code=Status.HTTP_400_BAD_REQUEST, content={
            "error": e.__class__.__name__
        })


def get_profile_from_google(access_token: str):
    response = requests.get(url=GOOGLE_USERINFO_API,
                            params={'access_token': access_token})

    if not response.ok:
        raise BadCredentialException(
            'Failed to get user information from Google.')

    return response.json()


async def register_by_google(profile: dict) -> User:
    print('register_by_google', profile)
    email = profile.get('email')

    found = await User.find_one({"email": email})
    if found != None:
        return found

    info = dict(
        email=email,
        username=profile.get('name'),
        first_name=profile.get('given_name'),
        last_name=profile.get('family_name'),
        picture=profile.get('picture'),
        hashed_password=secrets.token_hex(32),
        is_active=True,
        is_verified=profile.get('email_verified'),
    )
    user = User(**info)
    print('user', user)
    await user.save()
    return user
