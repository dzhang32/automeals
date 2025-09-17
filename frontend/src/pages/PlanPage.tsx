import RecipeCards from "../components/RecipeCards";
import { DndContext, type Over } from "@dnd-kit/core";
import { useState } from "react";
import type { TidyRecipe } from "../types/recipe";
import Calendar from "../components/Calendar";

interface PlanPageProps {
  searchQuery: string;
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
            <Calendar>
              <p>test</p>
            </Calendar>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
