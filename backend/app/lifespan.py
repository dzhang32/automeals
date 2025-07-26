"""Handles the server start up and shut down tasks."""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db import initialise_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Start up and shut down tasks for the server.

    Everything before/after the yield call is run upon server start/end.
    This initialises and populates the database upon server start up.
    """
    # TODO - Add a logger.
    print("Creating DB and tables...")
    initialise_db()
    yield
    print("App is shutting down...")
