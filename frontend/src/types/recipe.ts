export interface Recipe {
  name: string;
  instructions: string;
  id: number;
}

export interface TidyRecipe extends Omit<Recipe, "instructions"> {
  instructions: string[];
}
