import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { functions } from "./firebase";

export const askAI = async (prompt: string, model: "gemini" | "gpt" | "claude" = "gemini") => {
  const fnName =
    model === "gpt"
      ? "openAIProxy"
      : model === "claude"
      ? "claudeProxy"
      : "geminiProxy";

  const aiFn = httpsCallable(functions, fnName);
  const res: HttpsCallableResult = await aiFn({ prompt });
  const data = res.data as { [key: string]: unknown };

  // normalize outputs
  if (model === "gemini") {
    const candidates = data.candidates as { output_text: string }[];
    return candidates?.[0]?.output_text || "No response.";
  }
  if (model === "gpt") {
    const choices = data.choices as { message: { content: string } }[];
    return choices?.[0]?.message?.content || "No response.";
  }
  if (model === "claude") {
    const content = data.content as { text: string }[];
    return content?.[0]?.text || "No response.";
  }
};
