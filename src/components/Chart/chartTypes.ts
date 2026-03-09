
import { ColorType, OhlcData, Time } from 'lightweight-charts';

export interface ChartAdapter {
  createChart(container: HTMLElement): void;
  createCandleSeries(data: OhlcData<Time>[]): void;
  subscribeCrosshairMove(callback: Function): void;
  subscribeClick(callback: Function): void;
  subscribeVisibleTimeRangeChange(callback: Function): void;
  addOverlay(overlay: any): void;
  getScreenshot(): string;
}
