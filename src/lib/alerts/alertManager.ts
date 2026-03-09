// src/lib/alerts/alertManager.ts
export function sendPatternAlert(symbol: string, pattern: string) {
  // Browser notification
  if (Notification.permission === "granted") {
    new Notification(`${pattern} detected on ${symbol}`, {
      body: `Check the chart for details!`,
      // icon: "/chart-icon.png", // Make sure you have this icon in your /public folder
    });
  }

  // Play sound
  // const audio = new Audio("/alert-sound.mp3"); // Make sure you have this sound in your /public folder
  // audio.play().catch(e => console.error("Error playing sound:", e));
}

// Ask permission once
export function requestNotificationPermission() {
  if (typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}
