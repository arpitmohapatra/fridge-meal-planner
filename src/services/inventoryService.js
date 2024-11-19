export const addFridgeItem = (item) => {
  const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
  const newItem = {
    ...item,
    id: Date.now().toString(),
  };
  inventory.push(newItem);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  return newItem.id;
};

export const getFridgeItems = () => {
  return JSON.parse(localStorage.getItem("inventory") || "[]");
};

export const checkLowStockItems = () => {
  const inventory = getFridgeItems();
  return inventory.filter(
    (item) => item.quantity <= (item.lowStockThreshold || 2)
  );
};

export const updateFridgeItem = (id, updatedItem) => {
  const inventory = getFridgeItems();
  const index = inventory.findIndex((item) => item.id === id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], ...updatedItem };
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }
};

export const deleteFridgeItem = (id) => {
  const inventory = getFridgeItems();
  const filteredInventory = inventory.filter((item) => item.id !== id);
  localStorage.setItem("inventory", JSON.stringify(filteredInventory));
};
