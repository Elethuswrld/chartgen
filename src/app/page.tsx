import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SummaryCard } from '@/components/SummaryCard';
import { Watchlist } from '@/components/Watchlist';
import { News } from '@/components/News';
import { AIAssistant } from '@/components/AIAssistant';
import { ChartCanvas } from '@/components/ChartCanvas';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <ChartCanvas />
          </div>
          <div className="space-y-4">
            <SummaryCard title="Portfolio Value" value="$12,345.67" change="+2.3%" />
            <Watchlist />
            <News />
            <AIAssistant />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
