from app.data import load_recipes_ingredients


def test_load_recipes_ingredients() -> None:
    recipes, ingredients = load_recipes_ingredients()

    assert isinstance(recipes[0]["ingredients"], list)
    assert isinstance(ingredients["garlic"], bool)
