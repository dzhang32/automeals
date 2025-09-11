"""
Manages the database creation and connection.
"""

from typing import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.data import initialise_recipe_ingredients

# Set the database location.
DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL)


def initialise_db() -> None:
    """
    Initialise the database and populate it with recipe data.
    """
    SQLModel.metadata.create_all(engine)
    initialise_recipe_ingredients(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Create a new session connecting to the database.
    """
    with Session(engine) as session:
        yield session
