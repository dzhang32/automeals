from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.lifespan import lifespan
from app.routes import router

# Lifespan is used to initialise and populate the database upon server startup.
app = FastAPI(lifespan=lifespan)

app.include_router(router)

# Add CORS to allow requests from the frontend.
app.add_middleware(
    CORSMiddleware,
    # Vite dev server.
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
