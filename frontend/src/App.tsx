import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [recipe, setRecipe] = useState<any>(null)

  useEffect(() => {
    fetch('/api/recipes/1')
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch(() => setRecipe({ error: 'Error connecting to backend' }))
  }, [])

  return (
    <>
      <pre>
        Backend says: {recipe ? JSON.stringify(recipe, null, 2) : 'Loading...'}
      </pre>
    </>
  )
}

export default App