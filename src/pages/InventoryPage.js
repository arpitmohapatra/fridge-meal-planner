import React, { useState, useEffect } from "react";
import {
  addFridgeItem,
  getFridgeItems,
  deleteFridgeItem,
  checkLowStockItems,
  updateFridgeItem,
} from "../services/inventoryService";
import { setupLowStockNotifications } from "../services/notificationService";

// Import shadcn UI components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardFooter } from "../components/ui/card";

// Import icons
import { Trash, Plus, Minus, AlertTriangle } from "lucide-react";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    expiryDate: "",
    lowStockThreshold: 2,
  });

  useEffect(() => {
    const loadInventory = async () => {
      const items = await getFridgeItems();
      setInventory(items);
      const lowStockItems = checkLowStockItems(items);
      setupLowStockNotifications(lowStockItems);
    };

    loadInventory();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const itemId = addFridgeItem(newItem);
    setInventory([...inventory, { ...newItem, id: itemId }]);
    setNewItem({ name: "", quantity: 0, expiryDate: "", lowStockThreshold: 2 });
  };

  const handleDeleteItem = (id) => {
    deleteFridgeItem(id);
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = Math.max(0, item.quantity + change);
    const updatedItem = { ...item, quantity: newQuantity };
    updateFridgeItem(item.id, updatedItem);
    setInventory(
      inventory.map((inv) => (inv.id === item.id ? updatedItem : inv))
    );
  };

  const isLowStock = (item) => {
    return item.quantity <= item.lowStockThreshold;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
        <p className="text-muted-foreground">
          Manage your fridge inventory and track your food items.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-4">
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Add Item
            </Button>
          </form>
        </div>

        <div className="grid gap-4">
          {inventory.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">No items in inventory</h3>
                <p className="text-sm text-muted-foreground">
                  Add items to your inventory to get started.
                </p>
              </div>
            </div>
          ) : (
            inventory.map((item) => (
              <Card
                key={item.id}
                className={isLowStock(item) ? "border-destructive" : ""}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isLowStock(item) && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={item.quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                {isLowStock(item) && (
                  <CardFooter className="bg-destructive/10 p-2 text-xs text-destructive">
                    Low stock! Consider adding more.
                  </CardFooter>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
