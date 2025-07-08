from fastapi import APIRouter

router = APIRouter()

RECIPES_DB = {"potato_salad": ["test"]}

@router.get("/")
async def root():
    return {"message": "Hello World"}

@router.get("/recipes")
async def read_recipes() -> dict:
    return RECIPES_DB

@router.get("/ingredients/{recipe}")
async def read_ingredients(recipe: str) -> list:
    return RECIPES_DB.get(recipe)