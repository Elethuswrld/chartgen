import React from "react";
import { useAlertsStore } from "../stores/alertsStore";

export const AlertPanel: React.FC = () => {
  const alerts = useAlertsStore((state) => state.alerts);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4">Active Alerts</h2>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
            <div>
              <p className="text-white">{alert.symbol}</p>
              <p className="text-gray-400 text-sm">{alert.condition}</p>
            </div>
            <p className="text-white font-semibold">{alert.targetValue}</p>
          </div>
        ))}
      </div>
    </div>
  );
};