import { useEffect, useState, useMemo } from "react";
import type { Recipe, TidyRecipe } from "../types/recipe";
import InstructionsModal from "./InstructionsModal";
import tidyRecipe from "../utils/tidyRecipe";
import Fuse from "fuse.js";

interface RecipeCardsProps {
  searchQuery: string;
}

export default function RecipeCards({ searchQuery }: RecipeCardsProps) {
  const [recipes, setRecipes] = useState<TidyRecipe[] | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<TidyRecipe | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/recipes")
      .then((res) => res.json())
      .then((res) =>
        res.sort((a: Recipe, b: Recipe) => a.name.localeCompare(b.name))
      )
      .then((data: Recipe[]) => {
        setRecipes(data.map(tidyRecipe));
      })
      .catch(() => setRecipes(null));
  }, []);

  // Initialize Fuse instance for fuzzy search.
  const fuse = useMemo(() => {
    if (!recipes) return null;
    return new Fuse(recipes, {
      keys: ["name"],
      threshold: 0.2,
    });
  }, [recipes]);

  // Filter recipes based on search query.
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim() || !fuse) return recipes;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse, recipes]);

  return (
    <>
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
          {filteredRecipes?.map((recipe) => (
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
      </div>
    </>
  );
}
