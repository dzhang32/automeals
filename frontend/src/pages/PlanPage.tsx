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
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );

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

  const formatIngredientName = (name: string): string => {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const toggleIngredient = (ingredientId: number) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  // Collect all unique ingredients from the meal plan and separate by type
  const { coreIngredients, pantryIngredients, allIngredients } = useMemo(() => {
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

    const all = Array.from(ingredientsMap.values());

    const core = all
      .filter((ing) => ing.core)
      .sort((a, b) => a.name.localeCompare(b.name));

    const pantry = all
      .filter((ing) => !ing.core)
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      coreIngredients: core,
      pantryIngredients: pantry,
      allIngredients: all,
    };
  }, [mealPlan]);

  // Compute shopping list separately to avoid infinite loop
  const shoppingList = useMemo(() => {
    return allIngredients
      .filter((ing) => checkedIngredients.has(ing.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allIngredients, checkedIngredients]);

  // Automatically check all core ingredients when they appear
  useEffect(() => {
    if (coreIngredients.length === 0) return;

    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      let changed = false;
      coreIngredients.forEach((ingredient) => {
        if (!newSet.has(ingredient.id)) {
          newSet.add(ingredient.id);
          changed = true;
        }
      });
      return changed ? newSet : prev;
    });
  }, [coreIngredients]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container-fluid p-4">
        {/* Main content area */}
        <div className="row g-4">
          {/* Recipe list */}
          <div className="col-12 col-lg-6">
            <p className="section-header">Recipes</p>
            <div className="recipe-list">
              <RecipeCards searchQuery={searchQuery} />
            </div>
          </div>

          {/* Weekly planner */}
          <div className="col-12 col-lg-6">
            <p className="section-header">Weekly Plan</p>
            <div className="row g-2">
              {Object.keys(mealPlan).map((day) => (
                <div key={day} className="col-12">
                  <div className="card day-card">
                    <div className="card-body py-2 px-3">
                      <div className="row align-items-center">
                        <div className="col-2">
                          <span className="text-capitalize fw-medium" style={{ color: "#ffffff" }}>
                            {day.slice(0, 3)}
                          </span>
                        </div>
                        <div className="col-5">
                          <Calendar droppableId={`${day}-lunch`}>
                            {mealPlan[day].lunch ? (
                              <div className="d-flex align-items-center justify-content-between w-100">
                                <span className="small fw-medium text-truncate me-2">
                                  {mealPlan[day].lunch.name}
                                </span>
                                <button
                                  className="btn btn-sm btn-outline-danger flex-shrink-0"
                                  onClick={() => updateMeal(day, "lunch", null)}
                                  aria-label={`Remove ${mealPlan[day].lunch.name}`}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted small">Lunch</span>
                            )}
                          </Calendar>
                        </div>
                        <div className="col-5">
                          <Calendar droppableId={`${day}-dinner`}>
                            {mealPlan[day].dinner ? (
                              <div className="d-flex align-items-center justify-content-between w-100">
                                <span className="small fw-medium text-truncate me-2">
                                  {mealPlan[day].dinner.name}
                                </span>
                                <button
                                  className="btn btn-sm btn-outline-danger flex-shrink-0"
                                  onClick={() => updateMeal(day, "dinner", null)}
                                  aria-label={`Remove ${mealPlan[day].dinner.name}`}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted small">Dinner</span>
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

        {/* Ingredients section */}
        <div className="row g-3 mt-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="ingredient-header core text-white">
                Core Ingredients
              </div>
              <div className="card-body">
                {coreIngredients.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {coreIngredients.map((ingredient) => (
                      <li key={ingredient.id} className="list-group-item px-0 py-2 border-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`core-${ingredient.id}`}
                            checked={checkedIngredients.has(ingredient.id)}
                            onChange={() => toggleIngredient(ingredient.id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`core-${ingredient.id}`}
                          >
                            {formatIngredientName(ingredient.name)}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small mb-0">
                    Add recipes to see ingredients
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="ingredient-header pantry text-white">
                Pantry
              </div>
              <div className="card-body">
                {pantryIngredients.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {pantryIngredients.map((ingredient) => (
                      <li key={ingredient.id} className="list-group-item px-0 py-2 border-0">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`pantry-${ingredient.id}`}
                            checked={checkedIngredients.has(ingredient.id)}
                            onChange={() => toggleIngredient(ingredient.id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`pantry-${ingredient.id}`}
                          >
                            {formatIngredientName(ingredient.name)}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small mb-0">
                    Add recipes to see pantry items
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="ingredient-header shopping text-white">
                Shopping List
              </div>
              <div className="card-body">
                {shoppingList.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {shoppingList.map((ingredient) => (
                      <li key={ingredient.id} className="list-group-item px-0 py-2 border-0">
                        {formatIngredientName(ingredient.name)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small mb-0">
                    Check ingredients to add to list
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
