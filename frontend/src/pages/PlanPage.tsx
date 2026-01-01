import RecipeCards from "../components/RecipeCards";
import { DndContext, type Over } from "@dnd-kit/core";
import { useState, useEffect, useMemo } from "react";
import Calendar from "../components/Calendar";
import type { Recipe, TidyRecipe, Ingredient } from "../types/recipe";
import tidyRecipe from "../utils/tidyRecipe";
import { API_BASE_URL } from "../utils/api";

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
    fetch(`${API_BASE_URL}/recipes`)
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
        const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}/ingredients`);
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

  const downloadShoppingList = () => {
    if (shoppingList.length === 0) return;

    const csvContent = shoppingList
      .map((ingredient) => `${formatIngredientName(ingredient.name)},1`)
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shopping_list.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div className="w-full p-6">
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recipe list */}
          <div>
            <p className="section-header px-4">Recipes</p>
            <div className="recipe-list">
              <RecipeCards searchQuery={searchQuery} />
            </div>
          </div>

          {/* Weekly planner */}
          <div>
            <p className="section-header px-4">Weekly Plan</p>
            <div className="flex flex-col gap-3 px-4">
              {Object.keys(mealPlan).map((day) => (
                <div key={day} className="card day-card">
                  <div className="card-body py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-[16.67%]">
                        <span className="capitalize font-medium text-white">
                          {day.slice(0, 3)}
                        </span>
                      </div>
                      <div className="w-[41.67%] pr-2">
                        <Calendar droppableId={`${day}-lunch`}>
                          {mealPlan[day].lunch ? (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm font-medium truncate mr-2">
                                {mealPlan[day].lunch.name}
                              </span>
                              <button
                                className="btn-outline-danger shrink-0"
                                onClick={() => updateMeal(day, "lunch", null)}
                                aria-label={`Remove ${mealPlan[day].lunch.name}`}
                              >
                                &times;
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted text-sm">Lunch</span>
                          )}
                        </Calendar>
                      </div>
                      <div className="w-[41.67%]">
                        <Calendar droppableId={`${day}-dinner`}>
                          {mealPlan[day].dinner ? (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm font-medium truncate mr-2">
                                {mealPlan[day].dinner.name}
                              </span>
                              <button
                                className="btn-outline-danger shrink-0"
                                onClick={() => updateMeal(day, "dinner", null)}
                                aria-label={`Remove ${mealPlan[day].dinner.name}`}
                              >
                                &times;
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted text-sm">Dinner</span>
                          )}
                        </Calendar>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ingredients section */}
        <p className="section-header mt-8">Ingredients</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card h-full">
            <div className="ingredient-header">
              Core
            </div>
            <div className="card-body">
              {coreIngredients.length > 0 ? (
                <ul className="flex flex-col">
                  {coreIngredients.map((ingredient) => (
                    <li key={ingredient.id} className="py-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          id={`core-${ingredient.id}`}
                          checked={checkedIngredients.has(ingredient.id)}
                          onChange={() => toggleIngredient(ingredient.id)}
                        />
                        <span className="text-sm">{formatIngredientName(ingredient.name)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-sm mb-0">
                  Add recipes to see ingredients
                </p>
              )}
            </div>
          </div>

          <div className="card h-full">
            <div className="ingredient-header">
              Pantry
            </div>
            <div className="card-body">
              {pantryIngredients.length > 0 ? (
                <ul className="flex flex-col">
                  {pantryIngredients.map((ingredient) => (
                    <li key={ingredient.id} className="py-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          id={`pantry-${ingredient.id}`}
                          checked={checkedIngredients.has(ingredient.id)}
                          onChange={() => toggleIngredient(ingredient.id)}
                        />
                        <span className="text-sm">{formatIngredientName(ingredient.name)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-sm mb-0">
                  Add recipes to see pantry items
                </p>
              )}
            </div>
          </div>

          <div className="card h-full">
            <div className="ingredient-header flex items-center justify-between">
              <span>Shopping List</span>
              {shoppingList.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={downloadShoppingList}
                  title="Download shopping list as CSV"
                >
                  Download CSV
                </button>
              )}
            </div>
            <div className="card-body">
              {shoppingList.length > 0 ? (
                <ul className="flex flex-col">
                  {shoppingList.map((ingredient) => (
                    <li key={ingredient.id} className="py-2 text-sm">
                      {formatIngredientName(ingredient.name)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-sm mb-0">
                  Check ingredients to add to list
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
