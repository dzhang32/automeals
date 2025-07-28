import { useEffect, useState } from "react";

interface Recipe {
  name: string;
  instructions: string;
  id: number;
}

export default function RecipeDropDown() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch(() => setRecipes(null));
  }, []);

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Select a recipe
      </button>
      <ul className="dropdown-menu">
        {
            recipes?.map((recipe) => (
                <li>
                    <a className="dropdown-item">{recipe.name}</a>
                </li>
            ))
        }
      </ul>
    </div>
  );
}
