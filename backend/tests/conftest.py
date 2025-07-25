import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, StaticPool, create_engine

from app.db import get_session
from app.main import app
from app.models import Recipe


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
def populate_test_data(test_db):
    """Populate the test database with sample data"""
    with Session(test_db) as session:
        # Create a test recipe
        recipe = Recipe(
            id=1,
            name="Crispy Duck with Fava Beans & Caramelised Onions",
            instructions="Test instructions for the duck recipe",
        )
        session.add(recipe)
        session.commit()
    return test_db


@pytest.fixture
def test_client(populate_test_data):
    """Create test client with test database and populated data"""
    return TestClient(app)
