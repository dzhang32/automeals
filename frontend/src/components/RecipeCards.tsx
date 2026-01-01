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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              className="btn-view"
              onClick={() => {
                setSelectedRecipe(recipe);
                setIsModalOpen(true);
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              View Recipe
            </button>
          </div>
          <span className="drag-indicator">Drag to plan</span>
        </div>
      </div>
    );
  };

  const activeRecipe = activeId
    ? filteredRecipes?.find((r) => r.id.toString() === activeId)
    : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <InstructionsModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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
            <div className="p-3">
              <span className="font-medium text-sm">
                {activeRecipe.name}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </>
  );
}
