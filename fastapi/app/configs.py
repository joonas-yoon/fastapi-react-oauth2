import os
from functools import lru_cache
from typing import List

from pydantic import BaseSettings, Field


def get_env_file():
    stage = os.environ.get('ENV') or 'dev'
    return f'{stage}.env'


class Settings(BaseSettings):
    DEBUG: bool = False

    APP_NAME: str = "The Endings"
    HTTPS: bool = False
    HOST: str = "localhost"

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    DB_DATABASE: str
    DB_URL: str

    ORIGINS: List[str] = Field(['http://localhost'], env='ORIGINS')
    ALLOWED_HOSTS: List[str] = Field(..., env='ALLOWED_HOSTS')

    GOOGLE_CLIENT_ID: str = None
    GOOGLE_CLIENT_SECRET: str = None
    GOOGLE_CALLBACK_URL: str = None

    GITHUB_CLIENT_ID: str = None
    GITHUB_CLIENT_SECRET: str = None
    GITHUB_CALLBACK_URL: str = None

    KAKAO_CLIENT_ID: str = None
    KAKAO_CLIENT_SECRET: str = None
    KAKAO_CALLBACK_URL: str = None

    NAVER_CLIENT_ID: str = None
    NAVER_CLIENT_SECRET: str = None
    NAVER_CALLBACK_URL: str = None

    class Config:
        env_file = get_env_file()

    @property
    def URL(self) -> str:
        protocol = 'https' if self.HTTPS else 'http'
        return f'{protocol}://{self.HOST}'


Configs = Settings()

print('Configs:\n', Configs)


@lru_cache()
def get_settings():
    return Configs
