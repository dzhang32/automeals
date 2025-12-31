import RecipeCards from "../components/RecipeCards";
import { DndContext, type Over } from "@dnd-kit/core";
import { useState, useEffect, useMemo } from "react";
import Calendar from "../components/Calendar";
import type { Recipe, TidyRecipe, Ingredient } from "../types/recipe";
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
        const recipesWithIngredients = data.map((recipe: Recipe) => ({
          ...recipe,
          ingredients: [],
        }));
        setRecipes(recipesWithIngredients.map(tidyRecipe));
      })
      .catch(() => setRecipes(null));
  }, []);

  const updateMeal = async (day: string, meal: string, recipe: TidyRecipe | null) => {
    if (recipe && recipe.ingredients.length === 0) {
      try {
        const response = await fetch(`http://localhost:8000/recipes/${recipe.id}/ingredients`);
        const ingredients = await response.json();
        recipe = { ...recipe, ingredients };
      } catch (error) {
        console.error('Failed to fetch ingredients:', error);
        recipe = { ...recipe, ingredients: [] };
      }
    }

    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: recipe,
      },
    }));
  };

  async function handleDragEnd({ over, active }: { over: Over | null; active: any }) {
    if (over && typeof over.id === "string" && recipes) {
      // Parse the droppable ID to extract day and meal type
      // Format: "day-meal" (e.g., "monday-lunch")
      const [day, meal] = over.id.split("-");
      if (day && meal && mealPlan[day]) {
        // Find the recipe by ID
        const recipe = recipes.find((r) => r.id.toString() === active.id);
        if (recipe) {
          await updateMeal(day, meal, recipe);
          console.log(`Recipe "${recipe.name}" dropped on ${day} ${meal}`);
        }
      }
    }
  }

  // Collect all unique ingredients from the meal plan
  const allIngredients = useMemo(() => {
    const ingredientsMap = new Map<number, Ingredient>();

    Object.values(mealPlan).forEach((day) => {
      [day.lunch, day.dinner].forEach((recipe) => {
        if (recipe?.ingredients) {
          recipe.ingredients.forEach((ingredient) => {
            ingredientsMap.set(ingredient.id, ingredient);
          });
        }
      });
    });

    return Array.from(ingredientsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [mealPlan]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container-fluid p-3">
        <div className="row h-100">
          <div className="col-6">
            <RecipeCards searchQuery={searchQuery} exploreOrPlan="plan" />
          </div>
          <div className="col-6">
            <div className="row g-2">
              {Object.keys(mealPlan).map((day) => (
                <div key={day} className="col-12 mb-1">
                  <div className="card">
                    <div className="card-body p-1">
                      <h6
                        className="card-title text-capitalize mb-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {day}
                      </h6>
                      <div className="row g-1">
                        <div className="col-6">
                          <Calendar droppableId={`${day}-lunch`}>
                            {mealPlan[day].lunch ? (
                              <div className="text-center">
                                <div
                                  style={{
                                    fontSize: "0.65rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {mealPlan[day].lunch.name}
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{
                                    fontSize: "0.6rem",
                                    padding: "1px 4px",
                                    marginTop: "2px",
                                  }}
                                  onClick={() => updateMeal(day, "lunch", null)}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.6rem" }}
                              >
                                Lunch
                              </small>
                            )}
                          </Calendar>
                        </div>
                        <div className="col-6">
                          <Calendar droppableId={`${day}-dinner`}>
                            {mealPlan[day].dinner ? (
                              <div className="text-center">
                                <div
                                  style={{
                                    fontSize: "0.65rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {mealPlan[day].dinner.name}
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{
                                    fontSize: "0.6rem",
                                    padding: "1px 4px",
                                    marginTop: "2px",
                                  }}
                                  onClick={() =>
                                    updateMeal(day, "dinner", null)
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.6rem" }}
                              >
                                Dinner
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

        {allIngredients.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Shopping List</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <ul className="list-unstyled mb-0">
                        {allIngredients.map((ingredient) => (
                          <li key={ingredient.id} className="mb-1">
                            {ingredient.name}
                            {!ingredient.core && (
                              <span className="badge bg-secondary ms-2">
                                Pantry
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}
