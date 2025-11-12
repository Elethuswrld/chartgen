export function SummaryCard({ title, value, change }) {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h3 className="text-md font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className={change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{change}</p>
    </div>
  );
}
