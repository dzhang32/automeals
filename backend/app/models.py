"""Defines the models for the database."""

from sqlmodel import Field, Relationship, SQLModel


class RecipeIngredientLink(SQLModel, table=True):
    """
    Link recipes to ingredients (many-to-many relationship).
    """

    recipe_id: int = Field(foreign_key="recipe.id", primary_key=True)
    ingredient_id: int = Field(foreign_key="ingredient.id", primary_key=True)


class Recipe(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str
    instructions: str
    ingredients: list["Ingredient"] = Relationship(
        back_populates="recipes", link_model=RecipeIngredientLink
    )


class Ingredient(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str
    core: bool
    recipes: list[Recipe] = Relationship(
        back_populates="ingredients", link_model=RecipeIngredientLink
    )
