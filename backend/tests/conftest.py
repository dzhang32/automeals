import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, StaticPool, create_engine

from app.data import initialise_recipe_ingredients
from app.db import get_session
from app.main import app


@pytest.fixture
def test_db():
    """
    Creates a temporary database for testing.
    """
    db_fd, db_path = tempfile.mkstemp()
    test_engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    SQLModel.metadata.create_all(test_engine)
    initialise_recipe_ingredients(test_engine)

    # Connect to the test database.
    def get_test_session():
        with Session(test_engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_test_session

    yield test_engine

    # Close and clean up the temp database.
    os.close(db_fd)
    os.unlink(db_path)
    app.dependency_overrides.clear()


@pytest.fixture
def test_client(test_db):
    """Create test client with test database and populated data"""
    return TestClient(app)
