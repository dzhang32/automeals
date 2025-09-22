import RecipeCards from "../components/RecipeCards";
import { DndContext, type Over } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import type { Recipe, TidyRecipe } from "../types/recipe";
import tidyRecipe from "../utils/tidyRecipe";

interface PlanPageProps {
  searchQuery: string;
}

interface MealData {
  lunch: TidyRecipe | null;
  dinner: TidyRecipe | null;
}

type WeekData = Record<string, MealData>;

export default function PlanPage({ searchQuery }: PlanPageProps) {
  const [recipes, setRecipes] = useState<TidyRecipe[] | null>(null);
  const [mealPlan, setMealPlan] = useState<WeekData>({
    monday: { lunch: null, dinner: null },
    tuesday: { lunch: null, dinner: null },
    wednesday: { lunch: null, dinner: null },
    thursday: { lunch: null, dinner: null },
    friday: { lunch: null, dinner: null },
    saturday: { lunch: null, dinner: null },
    sunday: { lunch: null, dinner: null },
  });

  // Fetch recipes to have access to recipe data for lookups
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

  const updateMeal = (day: string, meal: string, recipe: TidyRecipe | null) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: recipe,
      },
    }));
  };

  function handleDragEnd({ over, active }: { over: Over | null; active: any }) {
    if (over && typeof over.id === "string" && recipes) {
      // Parse the droppable ID to extract day and meal type
      // Format: "day-meal" (e.g., "monday-lunch")
      const [day, meal] = over.id.split("-");
      if (day && meal && mealPlan[day]) {
        // Find the recipe by ID
        const recipe = recipes.find((r) => r.id.toString() === active.id);
        if (recipe) {
          updateMeal(day, meal, recipe);
          console.log(`Recipe "${recipe.name}" dropped on ${day} ${meal}`);
        }
      }
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
            {Object.keys(mealPlan).map((day) => (
              <div key={day} className="mb-3">
                <h5 className="text-capitalize">{day}</h5>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Lunch</small>
                    <Calendar droppableId={`${day}-lunch`}>
                      {mealPlan[day].lunch ? (
                        <div className="text-center">
                          <strong>{mealPlan[day].lunch.name}</strong>
                          <button
                            className="btn btn-sm btn-outline-danger mt-2 d-block mx-auto"
                            onClick={() => updateMeal(day, "lunch", null)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <p>Drop lunch recipe here</p>
                      )}
                    </Calendar>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Dinner</small>
                    <Calendar droppableId={`${day}-dinner`}>
                      {mealPlan[day].dinner ? (
                        <div className="text-center">
                          <strong>{mealPlan[day].dinner.name}</strong>
                          <button
                            className="btn btn-sm btn-outline-danger mt-2 d-block mx-auto"
                            onClick={() => updateMeal(day, "dinner", null)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <p>Drop dinner recipe here</p>
                      )}
                    </Calendar>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
