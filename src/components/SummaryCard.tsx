import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change }) => {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h3 className="text-md font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className={change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{change}</p>
    </div>
  );
};
