import type { Recipe, TidyRecipe } from "../types";

export default function tidyRecipe(recipe: Recipe): TidyRecipe {
  return {
    // Copy all existing properties from the recipe.
    ...recipe,
    // Split instructions into an array, removing number prefix.
    instructions: recipe.instructions
      .split(";")
      .map((instruction) => instruction.trim().replace(/^\d+:\s*/, "")),
  };
}
