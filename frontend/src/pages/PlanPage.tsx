import RecipeCards from "../components/RecipeCards";
import { DndContext, useDroppable, type Over } from "@dnd-kit/core";
import { useState } from "react";
import type { TidyRecipe } from "../types/recipe";

interface PlanPageProps {
  searchQuery: string;
}

function DroppableArea() {
  const { isOver, setNodeRef } = useDroppable({
    id: "meal-planner",
  });

  const style = {
    backgroundColor: isOver ? "#e3f2fd" : "#f5f5f5",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px",
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <p>Drop recipes here to plan your meals</p>
    </div>
  );
}

export default function PlanPage({ searchQuery }: PlanPageProps) {
  const [plannedRecipes, setPlannedRecipes] = useState<TidyRecipe[]>([]);

  function handleDragEnd({ over, active }: { over: Over | null; active: any }) {
    console.log("Drag ended:", { over, active });

    if (over && over.id === "meal-planner") {
      console.log("Recipe dropped on meal planner:", active.id);
      // Here you can add logic to handle the dropped recipe
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <h2>Available Recipes</h2>
            <RecipeCards searchQuery={searchQuery} exploreOrPlan="plan" />
          </div>
          <div className="col-md-4">
            <h2>Meal Planner</h2>
            <DroppableArea />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
