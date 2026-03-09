import { ColorType, OhlcData, Time } from 'lightweight-charts';

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ChartAdapter {
  createChart(container: HTMLElement): void;
  createCandleSeries(data: CandlestickData[]): void;
  subscribeCrosshairMove(callback: Function): void;
  subscribeClick(callback: Function): void;
  subscribeVisibleTimeRangeChange(callback: Function): void;
  addOverlay(overlay: any): void;
  getScreenshot(): string;
}
