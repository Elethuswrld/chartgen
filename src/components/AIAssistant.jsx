export function AIAssistant() {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">AI Assistant</h2>
      <div className="bg-muted p-4 rounded-lg mb-4">
        <p className="text-sm">Welcome! How can I help you today?</p>
      </div>
      <input type="text" placeholder="Ask a question..." className="w-full bg-input text-foreground p-2 rounded-lg" suppressHydrationWarning />
    </div>
  );
}
