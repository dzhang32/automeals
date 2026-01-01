/*
 * API configuration utility
 * Uses environment variable in production, falls back to localhost in development
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import type { Recipe } from '../types/recipe';

/**
 * Fetches all recipes from the API and returns them sorted alphabetically by name
 */
export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  const recipes = await response.json();
  return recipes.sort((a: Recipe, b: Recipe) => a.name.localeCompare(b.name));
}
