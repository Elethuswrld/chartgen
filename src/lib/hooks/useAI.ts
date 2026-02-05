'use client';
import { useState } from "react";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<"gpt" | "deepseek">("gpt");

  const queryAI = async (prompt: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "AI request failed");

      return data.text as string;
    } finally {
      setLoading(false);
    }
  };

  return { loading, model, setModel, queryAI };
}