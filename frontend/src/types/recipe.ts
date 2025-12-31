export interface Ingredient {
  id: number;
  name: string;
  core: boolean;
}

export interface Recipe {
  name: string;
  instructions: string;
  id: number;
  ingredients: Ingredient[];
}

export interface TidyRecipe extends Omit<Recipe, "instructions"> {
  instructions: string[];
}
