import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.lifespan import lifespan
from app.routes import router

# Lifespan is used to initialise and populate the database upon server startup.
app = FastAPI(lifespan=lifespan)

app.include_router(router)

# Add CORS to allow requests from the frontend.

# Get allowed origins from environment variable or default to localhost for dev
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
