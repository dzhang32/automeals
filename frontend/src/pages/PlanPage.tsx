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
      <div className="container-fluid p-3">
        <div className="row h-100">
          <div className="col-6">
            <h4 className="mb-3">Available Recipes</h4>
            <div
              style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
            >
              <RecipeCards searchQuery={searchQuery} exploreOrPlan="plan" />
            </div>
          </div>
          <div className="col-6">
            <h4 className="mb-3">Weekly Meal Planner</h4>
            <div
              style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
            >
              <div className="row g-2">
                {Object.keys(mealPlan).map((day) => (
                  <div key={day} className="col-12 mb-2">
                    <div className="card">
                      <div className="card-body p-2">
                        <h6 className="card-title text-capitalize mb-2">
                          {day}
                        </h6>
                        <div className="row g-1">
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Lunch
                            </small>
                            <Calendar droppableId={`${day}-lunch`}>
                              {mealPlan[day].lunch ? (
                                <div className="text-center">
                                  <div
                                    style={{
                                      fontSize: "0.75rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {mealPlan[day].lunch.name}
                                  </div>
                                  <button
                                    className="btn btn-sm btn-outline-danger mt-1"
                                    style={{
                                      fontSize: "0.7rem",
                                      padding: "2px 6px",
                                    }}
                                    onClick={() =>
                                      updateMeal(day, "lunch", null)
                                    }
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <small className="text-muted">
                                  Drop lunch here
                                </small>
                              )}
                            </Calendar>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Dinner
                            </small>
                            <Calendar droppableId={`${day}-dinner`}>
                              {mealPlan[day].dinner ? (
                                <div className="text-center">
                                  <div
                                    style={{
                                      fontSize: "0.75rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {mealPlan[day].dinner.name}
                                  </div>
                                  <button
                                    className="btn btn-sm btn-outline-danger mt-1"
                                    style={{
                                      fontSize: "0.7rem",
                                      padding: "2px 6px",
                                    }}
                                    onClick={() =>
                                      updateMeal(day, "dinner", null)
                                    }
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <small className="text-muted">
                                  Drop dinner here
                                </small>
                              )}
                            </Calendar>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
