
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { ChartAdapter } from './chartTypes';

export const chartAdapter: ChartAdapter = {
  chart: null as IChartApi | null,
  candleSeries: null as ISeriesApi<"Candlestick"> | null,

  createChart(container: HTMLElement) {
    this.chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: 'solid', color: '#000000' },
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
  },

  createCandleSeries(data) {
    if (!this.chart) return;
    this.candleSeries = this.chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });
    this.candleSeries.setData(data);
  },

  subscribeCrosshairMove(callback) {
    this.chart?.subscribeCrosshairMove(param => {
      callback(param);
    });
  },

  subscribeClick(callback) {
    this.chart?.subscribeClick(param => {
      callback(param);
    });
  },

  subscribeVisibleTimeRangeChange(callback) {
    this.chart?.timeScale().subscribeVisibleTimeRangeChange(param => {
      callback(param);
    });
  },

  addOverlay(overlay) {
    // Implementation for adding overlays
  },

  getScreenshot() {
    return this.chart?.takeScreenshot() || '';
  },
};
