import { OhlcData, Time, IChartApi, ISeriesApi } from 'lightweight-charts';

export type CandlestickData = OhlcData<Time>;

export interface ChartAdapter {
  chart: IChartApi | null;
  series: ISeriesApi<"Candlestick"> | null;
  init: (container: HTMLElement, options?: any) => void;
  addData: (data: CandlestickData) => void;
  setData: (data: CandlestickData[]) => void;
  destroy: () => void;
}
