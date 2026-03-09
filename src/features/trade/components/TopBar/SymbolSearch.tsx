
'use client';

import { useMarketStore } from '../../../stores/marketStore';

export default function SymbolSearch() {
  const symbol = useMarketStore(state => state.symbol);
  return <div className="text-lg font-bold">{symbol}</div>;
}
