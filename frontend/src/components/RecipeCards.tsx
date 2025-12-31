import { useEffect, useState, useMemo } from "react";
import type { Recipe, TidyRecipe } from "../types/recipe";
import InstructionsModal from "./InstructionsModal";
import tidyRecipe from "../utils/tidyRecipe";
import Fuse from "fuse.js";
import { useDraggable, DragOverlay, useDndMonitor } from "@dnd-kit/core";

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

  // Track drag state using dnd-kit monitor
  useDndMonitor({
    onDragStart: (event) => setActiveId(event.active.id.toString()),
    onDragEnd: () => setActiveId(null),
    onDragCancel: () => setActiveId(null),
  });

  const RecipeCard = ({ recipe }: { recipe: TidyRecipe }) => {
    const { attributes, listeners, setNodeRef, isDragging } =
      useDraggable({
        id: recipe.id.toString(),
      });

    return (
      <div className="col">
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="card recipe-card"
          style={{
            opacity: isDragging ? 0.4 : 1,
            cursor: "grab",
          }}
        >
          <div className="card-body">
            <h5 className="card-title">{recipe.name}</h5>
            <div className="card-actions">
              <button
                type="button"
                className="btn btn-view"
                data-bs-toggle="modal"
                data-bs-target="#instructionsModal"
                onClick={() => setSelectedRecipe(recipe)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                View Recipe
              </button>
            </div>
            <span className="drag-indicator">Drag to plan</span>
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
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
        {filteredRecipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <InstructionsModal recipe={selectedRecipe} />
      <DragOverlay>
        {activeRecipe ? (
          <div
            className="card recipe-card"
            style={{
              width: "200px",
              cursor: "grabbing",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
              borderColor: "#7ec89b",
              aspectRatio: "auto",
              minHeight: "auto",
            }}
          >
            <div className="card-body" style={{ padding: "12px 16px" }}>
              <span className="fw-medium" style={{ fontSize: "0.875rem" }}>
                {activeRecipe.name}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </>
  );
}
