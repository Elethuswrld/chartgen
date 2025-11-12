import { useState } from "react";
import { askAI } from "../aiRouter";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<"gemini" | "gpt" | "claude">("gemini");

  const queryAI = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await askAI(prompt, model);
      return response;
    } finally {
      setLoading(false);
    }
  };

  return { queryAI, loading, model, setModel };
};
