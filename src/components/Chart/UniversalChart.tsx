
import { useEffect, useRef } from "react";
import { ChartAdapter } from "./chartAdapter";
import { ChartEventHandler } from "./chartTypes";

interface UniversalChartProps {
  adapter: ChartAdapter;
  onCrosshairMove?: ChartEventHandler;
  onClick?: ChartEventHandler;
  onVisibleRangeChange?: ChartEventHandler;
}

export default function UniversalChart({ 
  adapter,
  onCrosshairMove, 
  onClick, 
  onVisibleRangeChange 
}: UniversalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    adapter.createChart(chartContainerRef.current, {
        layout: {
            background: { color: "#0E1424" },
            textColor: "white",
        },
        grid: {
            vertLines: { color: "rgba(255,255,255,0.05)" },
            horzLines: { color: "rgba(255,255,255,0.05)" },
        },
    });

    if (onCrosshairMove) {
      adapter.subscribe('crosshairMove', onCrosshairMove);
    }
    if (onClick) {
      adapter.subscribe('click', onClick);
    }
    if (onVisibleRangeChange) {
      adapter.subscribe('visibleRangeChange', onVisibleRangeChange);
    }

    const handleResize = () => {
      adapter.createChart(chartContainerRef.current!)
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      adapter.unsubscribe('crosshairMove', onCrosshairMove!);
      adapter.unsubscribe('click', onClick!);
      adapter.unsubscribe('visibleRangeChange', onVisibleRangeChange!);
      adapter.destroy();
    };
  }, [adapter, onCrosshairMove, onClick, onVisibleRangeChange]);

  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%" }} />;
}
