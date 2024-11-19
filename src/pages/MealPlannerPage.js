import React, { useState, useEffect } from "react";
import {
  generateWeeklyMealPlan,
  getSavedMealPlan,
} from "../services/mealPlanService";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid2,
  Button,
  Box,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RefreshIcon from "@mui/icons-material/Refresh";

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          <RestaurantIcon sx={{ mr: 2, fontSize: 35 }} />
          Weekly Meal Plan
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={regenerateMealPlan}
          startIcon={<RefreshIcon />}
        >
          Regenerate Plan
        </Button>
      </Box>

      <Grid2 container spacing={3}>
        {Object.entries(mealPlan).map(([day, meals]) => (
          <Grid2 item xs={12} md={6} lg={4} key={day}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  {day}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Breakfast:</strong> {meals.breakfast.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Lunch:</strong> {meals.lunch.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Dinner:</strong> {meals.dinner.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default MealPlannerPage;
