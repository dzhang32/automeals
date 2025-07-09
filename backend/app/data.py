"""Initialise data."""

import csv
import importlib.resources as pkg_resources

from sqlmodel import Session, select

from app.db import engine
from app.models import Ingredient, Recipe, RecipeIngredientLink

DATA_DIR = pkg_resources.files("app.raw_data")


def load_recipes_ingredients() -> tuple[list[dict], list[dict]]:
    recipes = []
    ingredients = dict()

    with open(DATA_DIR.joinpath("recipes.csv")) as recipes_path:
        recipes_csv = csv.reader(recipes_path)
        # Skip header row.
        next(recipes_csv, None)

        for name, extra_ingredients, core_ingredients, instructions in recipes_csv:
            core_ingredients = core_ingredients.split(";")
            extra_ingredients = extra_ingredients.split(";")

            recipes.append(
                {
                    "name": name,
                    "ingredients": extra_ingredients + core_ingredients,
                    "instructions": instructions,
                }
            )

            for ingred in core_ingredients:
                ingredients[ingred] = True

            for ingred in extra_ingredients:
                ingredients[ingred] = False

    return recipes, ingredients


def initialise_recipe_data() -> None:
    with Session(engine) as session:
        # Only initialise recipes if database is empty.
        first_recipe = session.exec(select(Recipe)).first()

        if not first_recipe:
            recipes, ingredients = load_recipes_ingredients()

            # Link ingredient name to ID for recipe-ingredient relationships.
            ingredient_map = {}
            for name, core in ingredients.items():
                ingredient = Ingredient(name=name, core=core)
                session.add(ingredient)
                session.commit()
                session.refresh(ingredient)
                ingredient_map[ingredient.name] = ingredient

            for recipe_data in recipes:
                recipe = Recipe(
                    name=recipe_data["name"], instructions=recipe_data["instructions"]
                )
                session.add(recipe)
                session.commit()
                session.refresh(recipe)

                for ingred in set(recipe_data["ingredients"]):
                    link = RecipeIngredientLink(
                        recipe_id=recipe.id, ingredient_id=ingredient_map[ingred].id
                    )
                    session.add(link)

        session.commit()
