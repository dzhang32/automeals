import RecipeCards from "../components/RecipeCards";
import { DndContext, type Over } from "@dnd-kit/core";
import { useState } from "react";
import Calendar from "../components/Calendar";

interface PlanPageProps {
  searchQuery: string;
}

interface MealData {
  lunch: number | null;
  dinner: number | null;
}

type WeekData = Record<string, MealData>;

export default function PlanPage({ searchQuery }: PlanPageProps) {
  const [mealPlan, setMealPlan] = useState<WeekData>({
    monday: { lunch: null, dinner: null },
    tuesday: { lunch: null, dinner: null },
    wednesday: { lunch: null, dinner: null },
    thursday: { lunch: null, dinner: null },
    friday: { lunch: null, dinner: null },
    saturday: { lunch: null, dinner: null },
    sunday: { lunch: null, dinner: null },
  });

  const updateMeal = (day: string, meal: string, value: number | null) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value,
      },
    }));
  };

  function handleDragEnd({ over, active }: { over: Over | null; active: any }) {
    if (over && typeof over.id === "string") {
      // Parse the droppable ID to extract day and meal type
      // Format: "day-meal" (e.g., "monday-lunch")
      const [day, meal] = over.id.split("-");
      if (day && meal && mealPlan[day]) {
        updateMeal(day, meal, parseInt(active.id));
        console.log(`Recipe ${active.id} dropped on ${day} ${meal}`);
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <h2>Available Recipes</h2>
            <RecipeCards searchQuery={searchQuery} exploreOrPlan="plan" />
          </div>
          <div className="col-md-4">
            <h2>Meal Planner</h2>
            {Object.keys(mealPlan).map((day) => (
              <div key={day} className="mb-3">
                <h5 className="text-capitalize">{day}</h5>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Lunch</small>
                    <Calendar droppableId={`${day}-lunch`}>
                      {mealPlan[day].lunch ? (
                        <p>Recipe ID: {mealPlan[day].lunch}</p>
                      ) : (
                        <p>Drop lunch recipe here</p>
                      )}
                    </Calendar>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Dinner</small>
                    <Calendar droppableId={`${day}-dinner`}>
                      {mealPlan[day].dinner ? (
                        <p>Recipe ID: {mealPlan[day].dinner}</p>
                      ) : (
                        <p>Drop dinner recipe here</p>
                      )}
                    </Calendar>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
