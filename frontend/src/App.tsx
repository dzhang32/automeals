import { useEffect, useState } from 'react'
import './App.css'

interface Recipe {
  name: string;
  instructions: string;
  id: number;
}

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/recipes/1')
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch(() => setRecipe(null))
  }, [])

  if (!recipe) {
    return <div>No recipe found</div>;
  }

  const { name, instructions, id } = recipe; 

  return (
    <div>
      <h1>{name}</h1>
      <p>{instructions}</p>
      <p>ID: {id}</p>
    </div>
  );
}

export default App