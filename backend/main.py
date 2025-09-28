from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
import models, schemas
from core import database, utils
from routers import auth, admin

app = FastAPI(
    title="BuildingControlSys",
    description="Система управления зданиями",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

    async with database.AsyncSessionLocal() as session:
        result = await session.execute(select(models.User))
        first_user = result.scalars().first()
        if not first_user:
            admin_user = models.User(
                username="admin",
                hashed_password=utils.get_password_hash("admin"),
                role=schemas.RoleEnum.admin
            )
            session.add(admin_user)
            await session.commit()
            print("Создан пользователь admin/admin")

app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "BuildingControlSys API"}
