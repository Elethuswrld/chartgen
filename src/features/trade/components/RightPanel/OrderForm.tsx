
'use client';

import { useMarketStore } from '../../../../stores/marketStore';

export default function OrderForm() {
  const symbol = useMarketStore(state => state.symbol);
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Order Form for {symbol}</h2>
      {/* Add your order form fields here */}
    </div>
  );
}
