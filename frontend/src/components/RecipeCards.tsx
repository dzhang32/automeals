import { useEffect, useState, useMemo } from "react";
import type { Recipe, TidyRecipe } from "../types/recipe";
import InstructionsModal from "./InstructionsModal";
import tidyRecipe from "../utils/tidyRecipe";
import Fuse from "fuse.js";
import { useDraggable } from "@dnd-kit/core";

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

  const RecipeCard = ({ recipe }: { recipe: TidyRecipe }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: recipe.id.toString(),
      });

    const dragButtonStyle = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      opacity: isDragging ? 0.8 : 1,
      zIndex: isDragging ? 9999 : 1,
      position: (isDragging ? "fixed" : "static") as "fixed" | "static",
      cursor: "grab",
    };

    return (
      <div className="col">
        <div className="card h-100">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{recipe.name}</h5>
            <div className="mt-auto d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#instructionsModal"
                onClick={() => setSelectedRecipe(recipe)}
              >
                Instructions
              </button>
              <button
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className="btn btn-outline-secondary btn-sm"
                style={dragButtonStyle}
              >
                Drag to add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-3">
          {filteredRecipes?.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        <InstructionsModal recipe={selectedRecipe} />
      </div>
    </>
  );
}
