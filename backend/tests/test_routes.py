import pytest


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
