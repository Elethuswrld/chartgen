import React, { useState } from 'react';

export const AIPanel = ({ onExplain, onGeneratePlan, onGetTrend }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    setIsLoading(true);
    const response = await onExplain();
    setAiResponse(response);
    setIsLoading(false);
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    const response = await onGeneratePlan();
    setAiResponse(response);
    setIsLoading(false);
  };

  const handleGetTrend = async () => {
    setIsLoading(true);
    const response = await onGetTrend();
    setAiResponse(response);
    setIsLoading(false);
  };

  return (
    <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-5">
      <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
      <div className="space-y-4">
        <button
          onClick={handleExplain}
          disabled={isLoading}
          className="w-full text-left p-3 bg-[#0E1424] rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          Explain this move
        </button>
        <button
          onClick={handleGeneratePlan}
          disabled={isLoading}
          className="w-full text-left p-3 bg-[#0E1424] rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          Generate trade plan
        </button>
        <button
          onClick={handleGetTrend}
          disabled={isLoading}
          className="w-full text-left p-3 bg-[#0E1424] rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          What's the trend?
        </button>
      </div>
      {isLoading && <div className="mt-4">Loading...</div>}
      {aiResponse && (
        <div className="mt-4 p-3 bg-[#0E1424] rounded-lg border border-white/10">
          <p className="text-gray-300 whitespace-pre-wrap">{aiResponse}</p>
        </div>
      )}
    </div>
  );
};
