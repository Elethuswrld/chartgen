export function News() {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">News</h2>
      <ul>
        <li className="mb-2 p-2 border-b">
          <p className="font-medium">Market Hits All-Time High</p>
          <p className="text-sm text-muted-foreground">2 hours ago</p>
        </li>
        <li className="mb-2 p-2 border-b">
          <p className="font-medium">New Tech Disrupting Finance</p>
          <p className="text-sm text-muted-foreground">1 day ago</p>
        </li>
      </ul>
    </div>
  );
}
