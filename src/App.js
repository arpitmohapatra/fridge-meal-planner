import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  Button,
  Alert,
} from "@mui/material";
import InventoryPage from "./pages/InventoryPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import PredefinedMealsManager from "./pages/PredefinedMealsManager";
import { requestNotificationPermission } from "./services/notificationService";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // You can customize this color
    },
    secondary: {
      main: "#f50057", // You can customize this color
    },
  },
});

function App() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const initNotifications = async () => {
      const allowed = await requestNotificationPermission();
      setNotificationEnabled(allowed);
    };
    initNotifications();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Fridge Meal Planner
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button color="inherit" component={Link} to="/inventory">
                  Inventory
                </Button>
                <Button color="inherit" component={Link} to="/meal-planner">
                  Meal Planner
                </Button>
                <Button color="inherit" component={Link} to="/meal-manager">
                  Manage Meals
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          {notificationEnabled ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Notifications are enabled
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Notifications are not enabled
            </Alert>
          )}

          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<InventoryPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/meal-planner" element={<MealPlannerPage />} />
              <Route
                path="/meal-manager"
                element={<PredefinedMealsManager />}
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
