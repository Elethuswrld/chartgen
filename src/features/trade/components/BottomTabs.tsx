
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalTab } from './JournalTab';
import { AlertsTab } from './AlertsTab';

export default function BottomTabs() {
  return (
    <div className="h-full border-t border-gray-700">
      <Tabs defaultValue="journal" className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
        <TabsContent value="journal" className="h-full">
          <JournalTab />
        </TabsContent>
        <TabsContent value="alerts" className="h-full">
          <AlertsTab />
        </TabsContent>
        <TabsContent value="news" className="h-full">
          <p>News content goes here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
