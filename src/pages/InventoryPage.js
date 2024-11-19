import React, { useState, useEffect } from "react";
import {
  addFridgeItem,
  getFridgeItems,
  deleteFridgeItem,
  checkLowStockItems,
  updateFridgeItem,
} from "../services/inventoryService";
import { setupLowStockNotifications } from "../services/notificationService";
import {
  TextField,
  Button,
  Container,
  Grid2,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function InventoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    expiryDate: "",
    lowStockThreshold: 2,
  });

  useEffect(() => {
    const loadInventory = () => {
      const items = getFridgeItems();
      setInventory(items);
      const lowStockItems = checkLowStockItems();
      setupLowStockNotifications(lowStockItems);
    };

    loadInventory();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    const itemId = addFridgeItem(newItem);
    setInventory([...inventory, { ...newItem, id: itemId }]);
    setNewItem({ name: "", quantity: 0, expiryDate: "", lowStockThreshold: 2 });
  };

  const handleDeleteItem = (id) => {
    deleteFridgeItem(id);
    setInventory(inventory.filter((item) => item.id !== id));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 2,
        px: isMobile ? 1 : 2,
      }}
    >
      <Grid2 container spacing={isMobile ? 1 : 2}>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Item Name"
            variant="outlined"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            size={isMobile ? "small" : "medium"}
          />
        </Grid2>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            variant="outlined"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
            }
            size={isMobile ? "small" : "medium"}
          />
        </Grid2>
        <Grid2 item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => handleAddItem(e)}
            size={isMobile ? "small" : "medium"}
          >
            Add Item
          </Button>
        </Grid2>
        {inventory.map((item) => (
          <Grid2 item xs={12} key={item.id}>
            <Card>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "stretch" : "center",
                  py: isMobile ? 1 : 2,
                  px: isMobile ? 1 : 2,
                }}
              >
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  sx={{ mb: isMobile ? 1 : 0 }}
                >
                  {item.name} - Quantity: {item.quantity}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : "flex-end",
                    gap: "8px",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      const updatedItem = {
                        ...item,
                        quantity: item.quantity + 1,
                      };
                      updateFridgeItem(item.id, updatedItem);
                      setInventory(
                        inventory.map((inv) =>
                          inv.id === item.id ? updatedItem : inv
                        )
                      );
                    }}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                  >
                    +
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (item.quantity > 0) {
                        const updatedItem = {
                          ...item,
                          quantity: item.quantity - 1,
                        };
                        updateFridgeItem(item.id, updatedItem);
                        setInventory(
                          inventory.map((inv) =>
                            inv.id === item.id ? updatedItem : inv
                          )
                        );
                      }
                    }}
                    color="secondary"
                    disabled={item.quantity === 0}
                    size={isMobile ? "small" : "medium"}
                  >
                    -
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteItem(item.id)}
                    color="error"
                    size={isMobile ? "small" : "medium"}
                  >
                    <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default InventoryPage;
