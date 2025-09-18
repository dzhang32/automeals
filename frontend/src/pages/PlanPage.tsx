import RecipeCards from "../components/RecipeCards";
import { DndContext, type Over } from "@dnd-kit/core";
import { useState } from "react";
import Calendar from "../components/Calendar";

interface PlanPageProps {
  searchQuery: string;
}

interface MealData {
  lunch: number | null;
  dinner: number | null;
}

type WeekData = Record<string, MealData>;

export default function PlanPage({ searchQuery }: PlanPageProps) {
  const [mealPlan, setMealPlan] = useState<WeekData>({
    monday: { lunch: null, dinner: null },
    tuesday: { lunch: null, dinner: null },
    wednesday: { lunch: null, dinner: null },
    thursday: { lunch: null, dinner: null },
    friday: { lunch: null, dinner: null },
    saturday: { lunch: null, dinner: null },
    sunday: { lunch: null, dinner: null },
  });
  const [plannedRecipe, setPlannedRecipe] = useState<number | null>(null);

  function handleDragEnd({ over, active }: { over: Over | null; active: any }) {
    if (over && over.id === "meal-planner") {
      console.log("Recipe dropped on meal planner:", active.id);
      setPlannedRecipe(active.id);
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
              {plannedRecipe ? (
                <p> {plannedRecipe} </p>
              ) : (
                <p>Drop a recipe here to plan your meals</p>
              )}
            </Calendar>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
