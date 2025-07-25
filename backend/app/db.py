"""Manages the database creation and connection."""

from typing import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.data import initialise_recipe_data


DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL)


def initialise_db() -> None:
    SQLModel.metadata.create_all(engine)
    initialise_recipe_data(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
