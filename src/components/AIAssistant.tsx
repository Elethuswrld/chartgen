import React, { useState } from 'react';
import { useAI } from '../lib/hooks/useAI';
import { AIPanel } from './AIPanel';
import UniversalChart from './Chart/UniversalChart';
import { useLiveMarket } from '../lib/hooks/useLiveMarket';

export const AIAssistant: React.FC = () => {
  const { queryAI, loading, model, setModel } = useAI();
  const [aiResponse, setAiResponse] = useState('');
  const symbols = ['AAPL', 'GOOGL', 'MSFT']; // Example symbols

  useLiveMarket(symbols);

  const handleQuery = async (prompt: string) => {
    const response = await queryAI(prompt);
    setAiResponse(response || '');
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
      <div style={{ height: '400px', marginTop: '20px' }}>
        <h2>Live Chart Example</h2>
        <UniversalChart symbol="AAPL" />
      </div>
    </div>
  );
};
