
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TradePage() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Get last used symbol from store/localStorage
    router.replace('/trade/XAUUSD');
  }, [router]);

  return null; // or a loading spinner
}
