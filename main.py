from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine


class RecipeIngredientLink(SQLModel, table=True):
    recipe_id: int | None = Field(default=None, foreign_key="recipe.id", primary_key=True)
    ingredient_id: int | None = Field(default=None, foreign_key="ingredient.id", primary_key=True)

class Recipe(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    ingredients: list["Ingredient"] = Relationship(back_populates="recipes", link_model=RecipeIngredientLink)

class Ingredient(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    recipes: list[Recipe] = Relationship(back_populates="ingredients", link_model=RecipeIngredientLink)

DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL)

def create_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This is called at startup
    print("Creating DB and tables...")
    create_tables()
    yield
    # This is called at shutdown
    print("App is shutting down...")

app = FastAPI(lifespan=lifespan)

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