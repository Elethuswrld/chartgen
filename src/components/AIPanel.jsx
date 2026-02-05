import React from 'react';

export const AIPanel = ({ aiResponse, isLoading, onExplain, onGeneratePlan, onGetTrend }) => {

  const renderJsonResponse = () => {
    try {
      const data = JSON.parse(aiResponse);
      return (
        <div>
            {data.summary && <p><strong>Summary:</strong> {data.summary}</p>}
            {data.trend && (
                <div>
                    <p><strong>Trend:</strong> {data.trend.structure} ({data.trend.bias})</p>
                    <p><strong>Flip Condition:</strong> {data.trend.flip}</p>
                </div>
            )}
            {data.levels && (
                <div>
                    <p><strong>Support:</strong> {data.levels.support.join(', ')}</p>
                    <p><strong>Resistance:</strong> {data.levels.resistance.join(', ')}</p>
                </div>
            )}
            {data.plan && data.plan.long.trigger && (
                <div>
                    <h3 className="font-bold mt-4">Long Plan</h3>
                    <p><strong>Trigger:</strong> {data.plan.long.trigger}</p>
                    <p><strong>Entry:</strong> {data.plan.long.entry}</p>
                    <p><strong>Stop Loss:</strong> {data.plan.long.sl}</p>
                    <p><strong>Take Profit 1:</strong> {data.plan.long.tp1}</p>
                    <p><strong>Take Profit 2:</strong> {data.plan.long.tp2}</p>
                    <p><strong>R:R:</strong> {data.plan.long.rr}</p>
                    <p><strong>Invalidation:</strong> {data.plan.long.invalidation}</p>
                </div>
            )}
            {data.plan && data.plan.short.trigger && (
                <div>
                    <h3 className="font-bold mt-4">Short Plan</h3>
                    <p><strong>Trigger:</strong> {data.plan.short.trigger}</p>
                    <p><strong>Entry:</strong> {data.plan.short.entry}</p>
                    <p><strong>Stop Loss:</strong> {data.plan.short.sl}</p>
                    <p><strong>Take Profit 1:</strong> {data.plan.short.tp1}</p>
                    <p><strong>Take Profit 2:</strong> {data.plan.short.tp2}</p>
                    <p><strong>R:R:</strong> {data.plan.short.rr}</p>
                    <p><strong>Invalidation:</strong> {data.plan.short.invalidation}</p>
                </div>
            )}
            {data.risk_note && <p className="mt-4"><em>{data.risk_note}</em></p>}
        </div>
      );
    } catch (e) {
      return <p className="text-gray-300 whitespace-pre-wrap">{aiResponse}</p>;
    }
  };

  return (
    <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-5">
      <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
      <div className="space-y-4">
        <button
          onClick={onExplain}
          disabled={isLoading}
          className="w-full text-left p-3 bg-[#0E1424] rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          Explain this move
        </button>
        <button
          onClick={onGeneratePlan}
          disabled={isLoading}
          className="w-full text-left p-3 bg-[#0E1424] rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          Generate trade plan
        </button>
        <button
          onClick={onGetTrend}
          disabled={isLoading}
          className="w-full text-left p-3 bg-[#0E1424] rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          What's the trend?
        </button>
      </div>
      {isLoading && <div className="mt-4">Loading...</div>}
      {aiResponse && (
        <div className="mt-4 p-3 bg-[#0E1424] rounded-lg border border-white/10">
          {renderJsonResponse()}
        </div>
      )}
    </div>
  );
};
