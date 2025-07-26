from fastapi import FastAPI

from app.lifespan import lifespan
from app.routes import router

# Lifespan is used to initialise and populate the database upon server startup.
app = FastAPI(lifespan=lifespan)

app.include_router(router)
