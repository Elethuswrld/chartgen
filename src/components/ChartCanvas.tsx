'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback } from 'react';
import ChartControlPanel from './ChartControlPanel';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

type BinanceKlineData = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string  // Ignore
];

interface BinanceWebsocketMessage {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
    B: string; // Ignore
  };
}

interface CandlestickData {
    x: Date;
    y: [number, number, number, number];
}

export default function ChartCanvas() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const [series, setSeries] = useState<{ data: CandlestickData[] }[]>([{ data: [] }]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
      );
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data: BinanceKlineData[] = await response.json();
      const initialData: CandlestickData[] = data.map((d: BinanceKlineData) => ({
        x: new Date(d[0]),
        y: [parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4])],
      }));
      setSeries([{ data: initialData }]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setSeries([{ data: [] }]);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  useEffect(() => {
    fetchInitialData();

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    );

    ws.onmessage = (event) => {
      const message: BinanceWebsocketMessage = JSON.parse(event.data);
      const kline = message.k;
      const newCandle: CandlestickData = {
        x: new Date(kline.t),
        y: [
          parseFloat(kline.o),
          parseFloat(kline.h),
          parseFloat(kline.l),
          parseFloat(kline.c),
        ],
      };

      setSeries((prevSeries) => {
        const data = [...prevSeries[0].data];
        if (data.length === 0) {
            return [{ data: [newCandle] }];
        }
        const lastCandle = data[data.length - 1];

        if (lastCandle.x.getTime() === newCandle.x.getTime()) {
          data[data.length - 1] = newCandle;
        } else {
          data.push(newCandle);
          if (data.length > 100) {
            data.shift();
          }
        }
        return [{ data }];
      });
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [symbol, interval, fetchInitialData]);

  const chartOptions = {
    chart: {
      type: 'candlestick' as const,
      height: 450,
      foreColor: '#E6EDF3',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout' as const,
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
      }
    },
    title: {
      text: `${symbol} Live Chart`,
      align: 'left' as const,
      style: {
        fontSize: '20px',
        color: '#E6EDF3',
      },
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        style: {
          colors: '#8A92A9',
        },
      }
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (val: number) => `$${val.toFixed(2)}`,
         style: {
          colors: '#8A92A9',
        },
      },
    },
    grid: {
      borderColor: '#161B22',
      strokeDashArray: 5,
    },
    tooltip: {
      theme: 'dark' as const,
      x: {
        format: 'dd MMM yyyy HH:mm',
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00C49A',
          downward: '#E63946',
        },
        wick: {
            useFillColor: true,
        }
      },
    },
  };

  return (
    <div className='bg-surface rounded-2xl p-4 shadow-glow'>
        <ChartControlPanel 
            symbol={symbol}
            setSymbol={setSymbol}
            interval={interval}
            setInterval={setInterval}
            onRefresh={fetchInitialData}
        />
        <motion.div
            key={symbol + interval}
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {loading ? (
                 <div className="flex flex-col justify-center items-center h-[450px] text-accent">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
                    />
                    <p className="mt-4 text-lg">Loading Chart Data...</p>
                </div>
            ) : (
                <ReactApexChart
                options={chartOptions}
                series={series}
                type="candlestick"
                height={450}
                />
            )}
        </motion.div>
    </div>
  );
}
