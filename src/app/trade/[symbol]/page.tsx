'use client';

import { useEffect } from 'react';
import TradeShell from '@/features/trade/components/TradeShell';
import useMarketStore from '@/store/marketStore';
import AuthGuard from '@/components/AuthGuard';

export default function TradePage({ params }: { params: { symbol: string } }) {
  const { fetchOhlc } = useMarketStore();

  useEffect(() => {
    fetchOhlc(params.symbol, '1h');
  }, [params.symbol, fetchOhlc]);

  return (
    <AuthGuard>
      <TradeShell symbol={params.symbol} />
    </AuthGuard>
  );
}
