import ChartCanvas from '../components/ChartCanvas';
import SummaryCard from '../components/SummaryCard';
import Watchlist from '../components/Watchlist';
import News from '../components/News';

export default function Home() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-text mb-6">Crypto Dashboard</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-9">
          <ChartCanvas />
        </div>
        <div className="col-span-12 xl:col-span-3 space-y-6">
          <SummaryCard />
          <Watchlist />
        </div>
        <div className="col-span-12">
          <News />
        </div>
      </div>
    </div>
  );
}
