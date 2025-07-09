"""Handles the start up and shut down tasks."""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.data import initialise_recipe_data
from app.db import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This is called at startup
    print("Creating DB and tables...")
    create_db_and_tables()
    initialise_recipe_data()
    yield
    # This is called at shutdown
    print("App is shutting down...")
