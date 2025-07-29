import { useEffect, useState } from "react";
import type { Recipe } from "../types";

export default function RecipeCards() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch(() => setRecipes(null));
  }, []);

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
      {recipes?.map((recipe) => (
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">{recipe.name}</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card’s content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
