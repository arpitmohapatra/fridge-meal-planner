import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Alert,
} from "@mui/material";
import KitchenIcon from "@mui/icons-material/Kitchen";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryPage from "./pages/InventoryPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import PredefinedMealsManager from "./pages/PredefinedMealsManager";
import { requestNotificationPermission } from "./services/notificationService";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [value, setValue] = useState(0);

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
        <Box sx={{ pb: 7 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Meal Planner
              </Typography>
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

          <Paper
            sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNavigation
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              showLabels
            >
              <BottomNavigationAction
                component={Link}
                to="/inventory"
                label="Inventory"
                icon={<KitchenIcon />}
              />
              <BottomNavigationAction
                component={Link}
                to="/meal-planner"
                label="Meals"
                icon={<RestaurantMenuIcon />}
              />
              <BottomNavigationAction
                component={Link}
                to="/meal-manager"
                label="Settings"
                icon={<SettingsIcon />}
              />
            </BottomNavigation>
          </Paper>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
