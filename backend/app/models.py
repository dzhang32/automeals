"""Defines the models for the database."""

from sqlmodel import Field, Relationship, SQLModel


class RecipeIngredientLink(SQLModel, table=True):
    """
    Link recipes to ingredients (many-to-many relationship).
    """

    # Setting both ids as primary keys creates composite primary key.
    # This ensures that each recipe-ingredient pair is unique.
    recipe_id: int = Field(foreign_key="recipe.id", primary_key=True)
    ingredient_id: int = Field(foreign_key="ingredient.id", primary_key=True)


class Recipe(SQLModel, table=True):
    """
    Recipe model.

    Attributes:
        id: Unique identifier for the recipe.
        name: Name of the recipe.
        instructions: Semi-colon separated numbered instructions e.g.
            "1.Preheat oven.;2.Bake for 20 minutes."
        ingredients: List of ingredients, linking to the ingredients table.
    """

    id: int = Field(primary_key=True)
    name: str
    instructions: str
    ingredients: list["Ingredient"] = Relationship(
        back_populates="recipes", link_model=RecipeIngredientLink
    )


class Ingredient(SQLModel, table=True):
    """
    Ingredient model.

    Attributes:
        id: Unique identifier for the ingredient.
        name: Name of the ingredient.
        core: Whether the ingredient is a core ingredient (as opposed to a
            pantry ingredient e.g. salt).
        recipes: List of recipes, linking to the recipes table.
    """

    id: int = Field(primary_key=True)
    name: str
    core: bool
    recipes: list[Recipe] = Relationship(
        back_populates="ingredients", link_model=RecipeIngredientLink
    )
