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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    expiryDate: "",
    lowStockThreshold: 2,
  });

  useEffect(() => {
    // Load inventory on component mount
    const loadInventory = () => {
      const items = getFridgeItems();
      setInventory(items);

      // Check for low stock and send notifications
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Item Name"
            variant="outlined"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
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
          />
        </Grid2>
        <Grid2 item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => handleAddItem(e)}
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
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">
                  {item.name} - Quantity: {item.quantity}
                </Typography>
                <div>
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
                  >
                    -
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteItem(item.id)}
                    color="error"
                  >
                    <DeleteIcon />
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
