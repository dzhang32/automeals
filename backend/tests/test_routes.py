import pytest

from app.data import DATA_DIR


def test_get_recipes(test_client):
    """
    Test that all recipes can be retrieved.
    """
    response = test_client.get("/recipes")

    assert response.status_code == 200

    with open(DATA_DIR.joinpath("recipes.csv")) as recipes_path:
        # Account for header row.
        n_recipes = -1
        for _ in recipes_path:
            n_recipes += 1

    assert len(response.json()) == n_recipes


@pytest.mark.parametrize("recipe_id, expected_status_code", [(1, 200), (0, 404)])
def test_get_recipe(test_client, recipe_id, expected_status_code):
    """
    Test that a recipe can be retrieved by its unique identifier.
    """
    response = test_client.get(f"/recipes/{recipe_id}")

    assert response.status_code == expected_status_code

    if expected_status_code == 200:
        assert (
            response.json()["name"]
            == "Crispy Duck with Fava Beans & Caramelised Onions"
        )
    else:
        assert response.json()["detail"] == "Recipe not found"
