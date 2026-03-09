import React from 'react';
import UniversalChart from '../Chart/UniversalChart';

interface MultiChartGridProps {
  symbols: string[];
}

export const MultiChartGrid: React.FC<MultiChartGridProps> = ({ symbols }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
      {symbols.map(symbol => (
        <div key={symbol} style={{ height: '400px' }}>
          <UniversalChart symbol={symbol} />
        </div>
      ))}
    </div>
  );
};
