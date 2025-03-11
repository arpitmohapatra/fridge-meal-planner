import React, { useState } from "react";
import {
  savePredefinedMeals,
  getPredefinedMeals,
} from "../services/mealPlanService";

// Import shadcn UI components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Trash } from "lucide-react";

const PredefinedMealsManager = () => {
  const [meals, setMeals] = useState(getPredefinedMeals());
  const [openDialog, setOpenDialog] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    type: "breakfast",
    ingredients: [],
    currentIngredient: "",
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMeal({
      name: "",
      type: "breakfast",
      ingredients: [],
      currentIngredient: "",
    });
  };

  const handleAddIngredient = () => {
    if (newMeal.currentIngredient.trim()) {
      setNewMeal({
        ...newMeal,
        ingredients: [...newMeal.ingredients, newMeal.currentIngredient.trim()],
        currentIngredient: "",
      });
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setNewMeal({
      ...newMeal,
      ingredients: newMeal.ingredients.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  const handleSubmit = () => {
    if (newMeal.name && newMeal.ingredients.length > 0) {
      const updatedMeals = { ...meals };
      const mealToAdd = {
        name: newMeal.name,
        ingredients: newMeal.ingredients,
      };

      updatedMeals[newMeal.type] = [...updatedMeals[newMeal.type], mealToAdd];

      savePredefinedMeals(updatedMeals);
      setMeals(updatedMeals);
      handleCloseDialog();
    }
  };

  const handleDeleteMeal = (type, index) => {
    const updatedMeals = { ...meals };
    updatedMeals[type] = updatedMeals[type].filter((_, i) => i !== index);
    savePredefinedMeals(updatedMeals);
    setMeals(updatedMeals);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Predefined Meals
          </h2>
          <p className="text-muted-foreground">
            Manage your meal templates for meal planning.
          </p>
        </div>
        <Button onClick={handleOpenDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Meal
        </Button>
      </div>

      <div className="grid gap-6">
        {["breakfast", "lunch", "dinner"].map((mealType) => (
          <div key={mealType} className="space-y-4">
            <h3 className="text-lg font-semibold capitalize">{mealType}</h3>

            {meals[mealType]?.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  No {mealType} meals defined. Add some to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {meals[mealType]?.map((meal, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-medium">{meal.name}</h4>
                          <div className="flex flex-wrap gap-1">
                            {meal.ingredients.map((ingredient, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteMeal(mealType, index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
            <Dialog.Title className="text-lg font-semibold">
              Add New Predefined Meal
            </Dialog.Title>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="Enter meal name"
                  value={newMeal.name}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <select
                  id="meal-type"
                  value={newMeal.type}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, type: e.target.value })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ingredient">Add Ingredient</Label>
                <div className="flex gap-2">
                  <Input
                    id="ingredient"
                    placeholder="Enter ingredient"
                    value={newMeal.currentIngredient}
                    onChange={(e) =>
                      setNewMeal({
                        ...newMeal,
                        currentIngredient: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                  />
                  <Button onClick={handleAddIngredient} type="button">
                    Add
                  </Button>
                </div>
              </div>

              {newMeal.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newMeal.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!newMeal.name || newMeal.ingredients.length === 0}
              >
                Save Meal
              </Button>
            </div>

            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default PredefinedMealsManager;
