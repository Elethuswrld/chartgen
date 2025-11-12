"use client";
import { useState } from "react";
import { useAI } from "@/lib/hooks/useAI";

export default function AIAssistant() {
  const { queryAI, model, setModel, loading } = useAI();
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setChat([...chat, { role: "user", text: input }]);
    const res = await queryAI(input);
    setChat((prev) => [...prev, { role: "ai", text: res }]);
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-gray-900/40 backdrop-blur text-white">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">AI Model:</span>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as "gemini" | "gpt" | "claude")}
          className="bg-gray-800 px-2 py-1 rounded-md"
        >
          <option value="gemini">Gemini</option>
          <option value="gpt">GPT</option>
          <option value="claude">Claude</option>
        </select>
      </div>

      <div className="h-80 overflow-y-auto space-y-3">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${
              m.role === "user" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-gray-800 rounded-l-md p-2 outline-none"
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 px-4 py-2 rounded-r-md"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
