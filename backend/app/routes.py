from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db import get_session
from app.models import Recipe

router = APIRouter()


@router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}


@router.get("/recipes/{id}", response_model=Recipe)
async def get_recipe(id: int, session: Session = Depends(get_session)) -> Recipe:
    recipe = session.get(Recipe, id)
    return recipe
