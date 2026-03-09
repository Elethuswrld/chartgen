import { CandlestickData } from '../../components/Chart/chartTypes';

export function findDoji(data: CandlestickData[]): CandlestickData[] {
  return data.filter(c => Math.abs(c.open - c.close) / (c.high - c.low) < 0.1);
}
