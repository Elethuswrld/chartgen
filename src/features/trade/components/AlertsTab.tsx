
'use client';

import { useAlertsStore } from '@/stores/alertsStore';

export function AlertsTab() {
  const alerts = useAlertsStore(state => state.alerts);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Alerts</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{JSON.stringify(alert)}</li>
        ))}
      </ul>
    </div>
  );
}
