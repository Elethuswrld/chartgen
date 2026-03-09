
'use client';

import { Button } from '@/components/ui/button';
import { useJournalStore } from '@/stores/journalStore';

export function JournalTab() {
  const saveSetup = useJournalStore(state => state.saveSetup);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Journal</h2>
      <Button onClick={saveSetup}>Save Setup</Button>
    </div>
  );
}
