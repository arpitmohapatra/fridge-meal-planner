import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { requestNotificationPermission } from "./services/notificationService";
import Favicon from "./components/Favicon";

// Import shadcn UI components
import { Button } from "./components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./components/ui/navigation-menu";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from "./components/ui/toast";

// Import pages
import InventoryPage from "./pages/InventoryPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import PredefinedMealsManager from "./pages/PredefinedMealsManager";

// Import icons
import { Refrigerator, ChefHat, Settings, Utensils } from "lucide-react";

function App() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const initNotifications = async () => {
      const allowed = await requestNotificationPermission();
      setNotificationEnabled(allowed);

      if (allowed) {
        setToastMessage({
          title: "Notifications Enabled",
          description: "You will receive notifications for low stock items",
        });
      } else {
        setToastMessage({
          title: "Notifications Disabled",
          description: "Enable notifications to get alerts for low stock items",
        });
      }
      setShowToast(true);
    };
    initNotifications();
  }, []);

  return (
    <Router>
      <ToastProvider>
        <Favicon />
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex">
                <Link
                  to="/fridge-meal-planner"
                  className="flex items-center space-x-2"
                >
                  <ChefHat className="h-6 w-6" />
                  <span className="font-bold">Meal Planner</span>
                </Link>
              </div>
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/fridge-meal-planner">
                      <NavigationMenuLink
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === 0
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setActiveTab(0)}
                      >
                        Inventory
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/fridge-meal-planner/plan">
                      <NavigationMenuLink
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === 1
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setActiveTab(1)}
                      >
                        Meal Planner
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/fridge-meal-planner/manage">
                      <NavigationMenuLink
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === 2
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setActiveTab(2)}
                      >
                        Settings
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="container py-6">
            <Routes>
              <Route path="/fridge-meal-planner" element={<InventoryPage />} />
              <Route
                path="/fridge-meal-planner/plan"
                element={<MealPlannerPage />}
              />
              <Route
                path="/fridge-meal-planner/manage"
                element={<PredefinedMealsManager />}
              />
            </Routes>
          </main>

          {/* Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:hidden">
            <div className="grid h-16 grid-cols-3">
              <Link
                to="/fridge-meal-planner"
                className={`flex flex-col items-center justify-center ${
                  activeTab === 0 ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab(0)}
              >
                <Refrigerator className="h-5 w-5" />
                <span className="text-xs">Inventory</span>
              </Link>
              <Link
                to="/fridge-meal-planner/plan"
                className={`flex flex-col items-center justify-center ${
                  activeTab === 1 ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab(1)}
              >
                <Utensils className="h-5 w-5" />
                <span className="text-xs">Meals</span>
              </Link>
              <Link
                to="/fridge-meal-planner/manage"
                className={`flex flex-col items-center justify-center ${
                  activeTab === 2 ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab(2)}
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs">Settings</span>
              </Link>
            </div>
          </div>

          {/* Toast */}
          {showToast && (
            <Toast
              className="fixed bottom-4 right-4"
              onOpenChange={(open) => {
                if (!open) setShowToast(false);
              }}
            >
              <ToastTitle>{toastMessage.title}</ToastTitle>
              <ToastDescription>{toastMessage.description}</ToastDescription>
            </Toast>
          )}
        </div>
        <ToastViewport />
      </ToastProvider>
    </Router>
  );
}

export default App;
