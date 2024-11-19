export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const sendLocalNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
};

export const setupLowStockNotifications = (lowStockItems) => {
  lowStockItems.forEach((item) => {
    sendLocalNotification(
      "Low Stock Alert",
      `${item.name} is running low. Current quantity: ${item.quantity}`
    );
  });
};
