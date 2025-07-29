import { useEffect, useState } from "react";
import type { Recipe } from "../types";
import InstructionsModal from "./InstructionsModal";

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
    <>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
        {recipes?.map((recipe) => (
          <div className="col" key={recipe.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#instructionsModal"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  Instructions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <InstructionsModal recipe={selectedRecipe} />
    </>
  );
}
