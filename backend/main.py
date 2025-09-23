from fastapi import FastAPI
import models, database, utils, schemas
from auth import router as auth_router
from admin import router as admin_router
from sqlalchemy import select

app = FastAPI(title="DefectManager")

@app.on_event("startup")
async def startup():
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

    async with database.AsyncSessionLocal() as session:
        result = await session.execute(select(models.User))
        first_user = result.scalars().first()
        if not first_user:
            admin = models.User(
                username="admin",
                hashed_password=utils.get_password_hash("admin"),
                role=schemas.RoleEnum.admin
            )
            session.add(admin)
            await session.commit()
            print("Создан пользователь log:admin/psw:admin")

app.include_router(auth_router, prefix="/auth")
app.include_router(admin_router)
