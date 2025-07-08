"""Manages the tables within the database."""

from sqlmodel import Field, Relationship, SQLModel


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
