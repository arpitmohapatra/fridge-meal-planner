import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  savePredefinedMeals,
  getPredefinedMeals,
} from "../services/mealPlanService";

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
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Predefined Meals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add New Meal
        </Button>
      </Box>

      {["breakfast", "lunch", "dinner"].map((mealType) => (
        <Box key={mealType} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ textTransform: "capitalize", mb: 2 }}>
            {mealType}
          </Typography>
          <List>
            {meals[mealType]?.map((meal, index) => (
              <Paper key={index} sx={{ mb: 2, p: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={meal.name}
                    secondary={
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {meal.ingredients.map((ingredient, i) => (
                          <Chip key={i} label={ingredient} size="small" />
                        ))}
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteMeal(mealType, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>
      ))}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Predefined Meal</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Meal Name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={newMeal.type}
                label="Meal Type"
                onChange={(e) =>
                  setNewMeal({ ...newMeal, type: e.target.value })
                }
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Ingredient"
                value={newMeal.currentIngredient}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, currentIngredient: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
              <Button variant="contained" onClick={handleAddIngredient}>
                Add
              </Button>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {newMeal.ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  onDelete={() => handleRemoveIngredient(index)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newMeal.name || newMeal.ingredients.length === 0}
          >
            Save Meal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredefinedMealsManager;
