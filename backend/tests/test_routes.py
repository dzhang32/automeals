def test_get_recipe(test_client):
    """
    Test that a recipe can be retrieved by its unique identifier.
    """
    response = test_client.get("/recipes/1")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Crispy Duck with Fava Beans & Caramelised Onions"
