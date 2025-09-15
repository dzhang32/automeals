import RecipeCards from "../components/RecipeCards";

interface PickPageProps {
  searchQuery: string;
}

export default function PickPage({ searchQuery }: PickPageProps) {
  return (
    <div>
      <RecipeCards searchQuery={searchQuery} />
    </div>
  );
}
