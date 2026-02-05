'use client';

import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';
import ReactMarkdown from 'react-markdown';

export default function AI() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const geminiProxy = httpsCallable(functions, 'geminiProxy');
      const result = await geminiProxy({ prompt });
      setResponse(result.data as string);
    } catch (error) { 
      console.error('Error calling Gemini API:', error);
      setResponse('Error: Could not get a response from the AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the AI anything about the market..."
          className="w-full p-2 border rounded bg-background text-foreground"
          rows={4}
        />
        <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {response && (
        <div className="p-4 border rounded bg-secondary">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
