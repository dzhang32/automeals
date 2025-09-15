import RecipeCards from "../components/RecipeCards";

interface ExplorePageProps {
  searchQuery: string;
}

export default function ExplorePage({ searchQuery }: ExplorePageProps) {
  return (
    <div>
      <RecipeCards searchQuery={searchQuery} ExploreOrPlan="explore" />
    </div>
  );
}
