from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models import Ingredient, Recipe

router = APIRouter()


@router.get("/recipes", response_model=list[Recipe])
async def get_recipes(session: Session = Depends(get_session)) -> list[Recipe]:
    """
    Get all recipes.
    """
    return session.exec(select(Recipe)).all()


@router.get("/recipes/{id}", response_model=Recipe)
async def get_recipe(id: int, session: Session = Depends(get_session)) -> Recipe:
    """
    Get a recipe by its unique identifier.
    """
    recipe = session.get(Recipe, id)

    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return recipe


@router.get("/recipes/{id}/ingredients", response_model=list[Ingredient])
async def get_recipe_ingredients(
    id: int, session: Session = Depends(get_session)
) -> list[Ingredient]:
    """
    Get the ingredients for a recipe by its unique identifier.
    """
    recipe = session.get(Recipe, id)

    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return recipe.ingredients
