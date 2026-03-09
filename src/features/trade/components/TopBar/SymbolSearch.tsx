
'use client';

import useMarketStore from '@/store/marketStore';

export default function SymbolSearch() {
  const symbol = useMarketStore(state => state.symbol);
  const setSymbol = useMarketStore(state => state.setSymbol);

  return (
    <div className="symbol-search">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter symbol (e.g., BTCUSD)"
      />
    </div>
  );
}
