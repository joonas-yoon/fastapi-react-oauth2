from app import db
from app.auth import AuthRouters
from app.configs import Configs
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=Configs.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router, kwargs in AuthRouters:
    app.include_router(router=router, **kwargs)


@app.on_event("startup")
async def on_startup():
    await db.on_startup()
