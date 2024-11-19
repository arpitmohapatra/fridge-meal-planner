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
    <Container maxWidth="lg" sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={3}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          <RestaurantIcon
            sx={{ mr: 1, fontSize: { xs: 28, sm: 32, md: 35 } }}
          />
          Weekly Meal Plan
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={regenerateMealPlan}
          startIcon={<RefreshIcon />}
          fullWidth
          sx={{
            maxWidth: { xs: "100%", sm: "auto" },
          }}
        >
          Regenerate Plan
        </Button>
      </Box>

      <Grid2 container spacing={2}>
        {Object.entries(mealPlan).map(([day, meals]) => (
          <Grid2 item xs={12} sm={6} lg={4} key={day}>
            <Card elevation={3}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  {day}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  <strong>Breakfast:</strong> {meals.breakfast.name}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  <strong>Lunch:</strong> {meals.lunch.name}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
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
