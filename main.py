from fastapi import FastAPI

app = FastAPI()

RECIPES_DB = {"potato_salad": ["test"]}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/recipes")
async def read_recipes() -> dict:
    return RECIPES_DB

@app.get("/ingredients/{recipe}")
async def read_ingredients(recipe: str) -> list:
    return RECIPES_DB.get(recipe)