const predefinedMeals = {
  breakfast: [
    {
      name: "Oatmeal",
      ingredients: ["oats", "milk", "honey", "berries", "nuts"],
    },
    {
      name: "Eggs",
      ingredients: ["eggs", "bread", "butter", "salt", "pepper"],
    },
    {
      name: "Pancakes",
      ingredients: ["flour", "eggs", "milk", "butter", "maple syrup"],
    },
    {
      name: "Smoothie",
      ingredients: ["banana", "berries", "yogurt", "milk", "honey"],
    },
    { name: "Toast", ingredients: ["bread", "butter", "jam", "peanut butter"] },
  ],
  lunch: [
    {
      name: "Salad",
      ingredients: ["lettuce", "tomatoes", "cucumber", "olive oil", "vinegar"],
    },
    {
      name: "Sandwich",
      ingredients: ["bread", "cheese", "ham", "lettuce", "tomato", "mayo"],
    },
    {
      name: "Soup",
      ingredients: ["vegetable broth", "carrots", "celery", "onion", "noodles"],
    },
    {
      name: "Wrap",
      ingredients: ["tortilla", "chicken", "lettuce", "tomato", "sauce"],
    },
    {
      name: "Buddha Bowl",
      ingredients: ["quinoa", "chickpeas", "sweet potato", "kale", "tahini"],
    },
  ],
  dinner: [
    {
      name: "Pasta",
      ingredients: ["pasta", "tomato sauce", "garlic", "olive oil", "parmesan"],
    },
    {
      name: "Stir Fry",
      ingredients: ["rice", "vegetables", "soy sauce", "oil", "protein"],
    },
    {
      name: "Grilled Chicken",
      ingredients: ["chicken breast", "herbs", "olive oil", "vegetables"],
    },
    {
      name: "Fish",
      ingredients: ["fish fillet", "lemon", "herbs", "butter", "garlic"],
    },
    {
      name: "Vegetarian Curry",
      ingredients: [
        "rice",
        "chickpeas",
        "coconut milk",
        "curry paste",
        "vegetables",
      ],
    },
  ],
};
// Save predefined meals to session storage
export const savePredefinedMeals = () => {
  localStorage.setItem("predefinedMeals", JSON.stringify(predefinedMeals));
};

// Get predefined meals from session storage
export const getPredefinedMeals = () => {
  const savedMeals = localStorage.getItem("predefinedMeals");
  return savedMeals ? JSON.parse(savedMeals) : predefinedMeals;
};

export const generateWeeklyMealPlan = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealPlan = {};

  days.forEach((day) => {
    mealPlan[day] = {
      breakfast:
        predefinedMeals.breakfast[
          Math.floor(Math.random() * predefinedMeals.breakfast.length)
        ],
      lunch:
        predefinedMeals.lunch[
          Math.floor(Math.random() * predefinedMeals.lunch.length)
        ],
      dinner:
        predefinedMeals.dinner[
          Math.floor(Math.random() * predefinedMeals.dinner.length)
        ],
    };
  });

  // Save meal plan to session storage
  localStorage.setItem("weeklyMealPlan", JSON.stringify(mealPlan));

  return mealPlan;
};

export const getSavedMealPlan = () => {
  const savedPlan = localStorage.getItem("weeklyMealPlan");
  return savedPlan ? JSON.parse(savedPlan) : generateWeeklyMealPlan();
};
