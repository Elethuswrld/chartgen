
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { ChartAdapter, CandlestickData } from './chartTypes';

export const chartAdapter: ChartAdapter = {
  chart: null as IChartApi | null,
  series: null as ISeriesApi<"Candlestick"> | null,

  init(container: HTMLElement) {
    this.chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: '#000000' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.5)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.5)',
        },
      },
      crosshair: {
        mode: 1, // Magnet
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
    });
    this.series = this.chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });
  },

  addData(data: CandlestickData) {
    if (!this.series) return;
    this.series.update(data);
  },

  setData(data: CandlestickData[]) {
    if (!this.series) return;
    this.series.setData(data);
  },

  destroy() {
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
  }
};
