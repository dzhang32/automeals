import { useEffect, useState, useMemo } from "react";
import type { Recipe, TidyRecipe } from "../types/recipe";
import InstructionsModal from "./InstructionsModal";
import tidyRecipe from "../utils/tidyRecipe";
import Fuse from "fuse.js";
import { useDraggable, DragOverlay } from "@dnd-kit/core";

interface RecipeCardsProps {
  searchQuery: string;
}

export default function RecipeCards({ searchQuery }: RecipeCardsProps) {
  const [recipes, setRecipes] = useState<TidyRecipe[] | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<TidyRecipe | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

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
    const { attributes, listeners, setNodeRef, isDragging } =
      useDraggable({
        id: recipe.id.toString(),
      });

    // Track active drag
    useEffect(() => {
      if (isDragging) {
        setActiveId(recipe.id.toString());
      }
    }, [isDragging, recipe.id]);

    return (
      <div className="col">
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="card h-100"
          style={{
            opacity: isDragging ? 0.4 : 1,
            cursor: "grab",
          }}
        >
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{recipe.name}</h5>
            <div className="mt-auto">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#instructionsModal"
                onClick={() => setSelectedRecipe(recipe)}
              >
                Instructions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeRecipe = activeId
    ? filteredRecipes?.find((r) => r.id.toString() === activeId)
    : null;

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
      <DragOverlay>
        {activeRecipe ? (
          <div
            className="card"
            style={{
              width: "200px",
              cursor: "grabbing",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div className="card-body py-2 px-3">
              <span className="small fw-medium">{activeRecipe.name}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </>
  );
}
