
'use client';

import { useState } from 'react';
import { AIPanel } from './AIPanel';

const assetClasses = {
  Stocks: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
  Crypto: ['BTC', 'ETH', 'XRP', 'LTC', 'ADA'],
  Forex: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD', 'USD/CAD'],
  Futures: ['ES', 'NQ', 'CL', 'GC', 'ZB'],
  Options: ['AAPL 240621C00150000', 'TSLA 240621C01000000', 'SPY 240621C00500000'],
};

type AssetClass = keyof typeof assetClasses;

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<AssetClass>('Stocks');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(assetClasses.Stocks[0]);
  const [model, setModel] = useState<'gpt' | 'deepseek'>('gpt');

  return (
    <div>
      <AIPanel model={model} onModelChange={setModel} onGetTrend={() => {}} onGeneratePlan={() => {}} onExplain={() => {}} aiResponse="" isLoading={false} />
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          {Object.keys(assetClasses).map(tab => (
            <button
              key={tab}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #0070f3' : '2px solid transparent',
                background: 'transparent',
                color: activeTab === tab ? '#0070f3' : '#ccc',
                cursor: 'pointer',
              }}
              onClick={() => {
                setActiveTab(tab as AssetClass);
                setSelectedAsset(null);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '200px', borderRight: '1px solid #333' }}>
            {(assetClasses[activeTab] as string[]).map(asset => (
              <div
                key={asset}
                style={{
                  padding: '10px',
                  background: selectedAsset === asset ? '#0070f3' : 'transparent',
                  color: selectedAsset === asset ? 'white' : '#ccc',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedAsset(asset)}
              >
                {asset}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '20px' }}>
            {selectedAsset ? (
              <p>Details for {selectedAsset}</p>
            ) : (
              <p>Select an asset to see details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
