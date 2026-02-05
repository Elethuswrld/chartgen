import React, { useState } from 'react';
import { useAI } from '../lib/hooks/useAI';
import { AIPanel } from './AIPanel';

export const AIAssistant: React.FC = () => {
  const { queryAI, loading, model, setModel } = useAI();
  const [aiResponse, setAiResponse] = useState('');

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
    </div>
  );
};