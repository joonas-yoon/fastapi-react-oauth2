from beanie import init_beanie
from motor import motor_asyncio

from .auth.models import User
from .configs import Configs

client = motor_asyncio.AsyncIOMotorClient(
    Configs.DB_URL, uuidRepresentation="standard"
)
database = client[Configs.DB_DATABASE]


async def on_startup():
    await init_beanie(
        database=database,
        document_models=[
            User,
        ],
    )
