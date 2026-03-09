import React, { useState, useMemo } from 'react';
import { useAI } from '../lib/hooks/useAI';
import { AIPanel } from './AIPanel';
import { useLiveMarket } from '../lib/hooks/useLiveMarket';
import { MultiChartGrid } from './Dashboard/MultiChartGrid';
import useMarketStore from '../store/marketStore';

const assetClasses = {
  Stocks: ['AAPL', 'GOOGL', 'MSFT'],
  Forex: ['OANDA:EUR_USD', 'OANDA:GBP_USD', 'OANDA:USD_JPY'],
  Crypto: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:SOLUSDT'],
};

type AssetClass = keyof typeof assetClasses;

export const AIAssistant: React.FC = () => {
  const { queryAI, model, setModel } = useAI();
  const [activeTab, setActiveTab] = useState<AssetClass>('Stocks');
  const { watchlist, toggleWatchlist } = useMarketStore();

  const symbolsInTab = useMemo(() => assetClasses[activeTab], [activeTab]);
  const symbolsToWatch = useMemo(() => Array.from(new Set([...symbolsInTab, ...watchlist])), [symbolsInTab, watchlist]);

  useLiveMarket(symbolsToWatch);

  const handleTabClick = (tab: AssetClass) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <AIPanel model={model} onModelChange={setModel} onQuery={() => {}} aiResponse="" isLoading={false} />
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          {Object.keys(assetClasses).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab as AssetClass)}
              style={{
                padding: '10px',
                border: activeTab === tab ? '1px solid #fff' : '1px solid #555',
                background: activeTab === tab ? '#333' : '#111',
                color: 'white',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <MultiChartGrid symbols={symbolsInTab} />

        <div style={{ marginTop: '20px' }}>
          <h3>Watchlist</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {symbolsToWatch.map(sym => (
              <button
                key={sym}
                onClick={() => toggleWatchlist(sym)}
                style={{
                  background: watchlist.includes(sym) ? '#0f0' : '#222',
                  color: watchlist.includes(sym) ? 'black' : 'white',
                  padding: '6px 12px',
                  border: '1px solid #555',
                }}
              >
                {sym} {watchlist.includes(sym) ? '✓' : '+'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
