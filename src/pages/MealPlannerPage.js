import React, { useState, useEffect } from "react";
import {
  generateWeeklyMealPlan,
  getSavedMealPlan,
} from "../services/mealPlanService";

// Import shadcn UI components
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

// Import icons
import { Utensils, RefreshCw } from "lucide-react";

function MealPlannerPage() {
  const [mealPlan, setMealPlan] = useState({});

  useEffect(() => {
    // Load or generate meal plan
    const loadMealPlan = () => {
      const plan = getSavedMealPlan();
      setMealPlan(plan);
    };

    loadMealPlan();
  }, []);

  const regenerateMealPlan = () => {
    const newPlan = generateWeeklyMealPlan();
    setMealPlan(newPlan);
  };

  const days = Object.entries(mealPlan);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            Weekly Meal Plan
          </h2>
          <p className="text-muted-foreground">
            Your personalized meal plan based on your inventory.
          </p>
        </div>
        <Button onClick={regenerateMealPlan} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate Plan
        </Button>
      </div>

      {days.length === 0 ? (
        <div className="flex h-60 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-medium">No meal plan generated</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Regenerate Plan" button to create a meal plan.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {days.map(([day, meals]) => (
            <Card key={day} className="overflow-hidden">
              <div className="bg-primary p-4">
                <h3 className="font-semibold text-lg text-primary-foreground">
                  {day}
                </h3>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Breakfast
                  </h4>
                  <p>{meals.breakfast.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Lunch
                  </h4>
                  <p>{meals.lunch.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Dinner
                  </h4>
                  <p>{meals.dinner.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MealPlannerPage;
