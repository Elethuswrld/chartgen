
'use client';

import { useState } from 'react';
import { AIPanel } from '@/components/AIPanel';

export default function RightPanel() {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<'gpt' | 'deepseek'>('gpt');

  const handleGetTrend = async () => {
    setIsLoading(true);
    // Fetch trend data
    setAiResponse('Trend data');
    setIsLoading(false);
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    // Generate trade plan
    setAiResponse('Trade plan');
    setIsLoading(false);
  };

  const handleExplain = async () => {
    setIsLoading(true);
    // Explain something
    setAiResponse('Explanation');
    setIsLoading(false);
  };

  return (
    <div className="w-80 border-l border-gray-700 p-4">
      <AIPanel
        aiResponse={aiResponse}
        isLoading={isLoading}
        onExplain={handleExplain}
        onGeneratePlan={handleGeneratePlan}
        onGetTrend={handleGetTrend}
        model={model}
        onModelChange={setModel}
      />
    </div>
  );
}
