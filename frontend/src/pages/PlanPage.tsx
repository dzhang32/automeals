import RecipeCards from "../components/RecipeCards";

interface PlanPageProps {
  searchQuery: string;
}

export default function PlanPage({ searchQuery }: PlanPageProps) {
  return (
    <div>
      <RecipeCards searchQuery={searchQuery} exploreOrPlan="plan" />
    </div>
  );
}
