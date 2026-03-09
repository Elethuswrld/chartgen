import React, { useState, useMemo } from 'react';
import { useAI } from '../lib/hooks/useAI';
import { AIPanel } from './AIPanel';
import UniversalChart from './Chart/UniversalChart';
import { useLiveMarket } from '../lib/hooks/useLiveMarket';

const assetClasses = {
  Stocks: ['AAPL', 'GOOGL', 'MSFT'],
  Forex: ['OANDA:EUR_USD', 'OANDA:GBP_USD', 'OANDA:USD_JPY'],
  Crypto: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:SOLUSDT'],
};

type AssetClass = keyof typeof assetClasses;

export const AIAssistant: React.FC = () => {
  const { queryAI, loading, model, setModel } = useAI();
  const [aiResponse, setAiResponse] = useState('');
  const [activeTab, setActiveTab] = useState<AssetClass>('Stocks');

  const symbols = useMemo(() => assetClasses[activeTab], [activeTab]);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);

  useLiveMarket(symbols);

  const handleQuery = async (prompt: string) => {
    const response = await queryAI(prompt);
    setAiResponse(response || '');
  };

  const handleTabClick = (tab: AssetClass) => {
    setActiveTab(tab);
    setSelectedSymbol(assetClasses[tab][0]);
  };

  return (
    <div>
      <AIPanel 
        aiResponse={aiResponse}
        isLoading={loading}
        onExplain={() => handleQuery('Explain this move')}
        onGeneratePlan={() => handleQuery('Generate trade plan')}
        onGetTrend={() => handleQuery('Whats the trend?')}
        model={model}
        onModelChange={setModel}
      />

      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          {Object.keys(assetClasses).map((tab) => (
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

        <select 
          value={selectedSymbol} 
          onChange={(e) => setSelectedSymbol(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px' }}
        >
          {symbols.map(symbol => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>

        <div style={{ height: '400px' }}>
          <UniversalChart symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
};
