def test_get_recipe(test_client):
    response = test_client.get("/recipes/1")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Crispy Duck with Fava Beans & Caramelised Onions"
