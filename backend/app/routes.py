from fastapi import APIRouter
from sqlmodel import Session

from app.db import engine
from app.models import Recipe

router = APIRouter()


@router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}


@router.get("/recipes/{id}", response_model=Recipe)
async def get_recipe(id: int) -> Recipe:
    with Session(engine) as session:
        recipe = session.get(Recipe, id)

    return recipe
