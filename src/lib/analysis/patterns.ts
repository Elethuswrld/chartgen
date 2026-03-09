import { CandlestickData } from '../../components/Chart/chartTypes';

export function findDoji(data: CandlestickData[]): CandlestickData[] {
  return data.filter(c => Math.abs(c.open - c.close) / (c.high - c.low) < 0.1);
}

export function findEngulfing(data: CandlestickData[]): CandlestickData[] {
  const engulfingPatterns: CandlestickData[] = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    
    // Bullish Engulfing: previous is bearish, current is bullish and engulfs previous body
    const isBullishEngulfing = prev.close < prev.open &&
                               curr.close > curr.open &&
                               curr.open < prev.close &&
                               curr.close > prev.open;

    // Bearish Engulfing: previous is bullish, current is bearish and engulfs previous body
    const isBearishEngulfing = prev.close > prev.open &&
                               curr.close < curr.open &&
                               curr.open > prev.close &&
                               curr.close < prev.open;

    if (isBullishEngulfing || isBearishEngulfing) {
      engulfingPatterns.push(curr);
    }
  }
  return engulfingPatterns;
}


export function findHammer(data: CandlestickData[]): CandlestickData[] {
  return data.filter(c => {
    const body = Math.abs(c.open - c.close);
    const lowerWick = Math.min(c.open, c.close) - c.low;
    const upperWick = c.high - Math.max(c.open, c.close);
    // Hammer: Long lower wick, small upper wick
    return lowerWick > body * 2 && upperWick < body;
  });
}

export function findShootingStar(data: CandlestickData[]): CandlestickData[] {
  return data.filter(c => {
    const body = Math.abs(c.open - c.close);
    const upperWick = c.high - Math.max(c.open, c.close);
    const lowerWick = Math.min(c.open, c.close) - c.low;
    // Shooting Star: Long upper wick, small lower wick
    return upperWick > body * 2 && lowerWick < body;
  });
}

export function findMorningStar(data: CandlestickData[]): CandlestickData[] {
    const morningStars: CandlestickData[] = [];
    if (data.length < 3) return morningStars;

    for (let i = 2; i < data.length; i++) {
        const first = data[i - 2];
        const second = data[i - 1];
        const third = data[i];

        const firstBody = Math.abs(first.open - first.close);
        const secondBody = Math.abs(second.open - second.close);

        const isBearishFirst = first.close < first.open;
        const isSmallBodySecond = secondBody < firstBody;
        const isBullishThird = third.close > third.open;
        
        if (
            isBearishFirst &&
            isSmallBodySecond &&
            Math.max(second.open, second.close) < first.close && // Gaps down
            isBullishThird &&
            third.close > (first.open + first.close) / 2
        ) {
            morningStars.push(third); 
        }
    }
    return morningStars;
}

export function findEveningStar(data: CandlestickData[]): CandlestickData[] {
    const eveningStars: CandlestickData[] = [];
    if (data.length < 3) return eveningStars;

    for (let i = 2; i < data.length; i++) {
        const first = data[i - 2];
        const second = data[i - 1];
        const third = data[i];

        const firstBody = Math.abs(first.open - first.close);
        const secondBody = Math.abs(second.open - second.close);
        
        const isBullishFirst = first.close > first.open;
        const isSmallBodySecond = secondBody < firstBody;
        const isBearishThird = third.close < third.open;

        if (
            isBullishFirst &&
            isSmallBodySecond &&
            Math.min(second.open, second.close) > first.close && // Gaps up
            isBearishThird &&
            third.close < (first.open + first.close) / 2
        ) {
            eveningStars.push(third);
        }
    }
    return eveningStars;
}
