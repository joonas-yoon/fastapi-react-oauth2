from fastapi import FastAPI

from app import db
from app.auth import AuthRouters

app = FastAPI()

for router, kwargs in AuthRouters:
    app.include_router(router=router, **kwargs)


@app.on_event("startup")
async def on_startup():
    await db.on_startup()
