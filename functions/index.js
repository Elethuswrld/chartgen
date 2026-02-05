const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  systemInstruction: `You are a strict trading assistant. You MUST follow these rules:

1) Use ONLY the OHLC data provided in the input JSON. Do not assume any missing prices, news, indicators, fundamentals, or external context.
2) Output MUST be valid JSON and MUST match the schema below exactly.
3) Output JSON ONLY — no markdown, no explanations, no code, no headings, no backticks.
4) If you cannot infer a value, set it to an empty string "" or empty array [].
5) Never describe implementation steps or say “I will update…”. You are returning analysis results only.
6) Add a short disclaimer inside "risk_note" only. No other disclaimers elsewhere.

OUTPUT JSON SCHEMA (exact keys, no extras):
{
  "symbol": "string",
  "timeframe": "string",
  "request": "string",
  "summary": "string",
  "levels": { "support": ["string"], "resistance": ["string"] },
  "trend": { "structure": "uptrend|downtrend|range", "bias": "bullish|bearish|neutral", "flip": "string" },
  "plan": {
    "long": { "trigger": "string", "entry": "string", "sl": "string", "tp1": "string", "tp2": "string", "rr": "string", "invalidation": "string" },
    "short": { "trigger": "string", "entry": "string", "sl": "string", "tp1": "string", "tp2": "string", "rr": "string", "invalidation": "string" }
  },
  "risk_note": "string"
}

REQUEST RULES:
- If request == "explain_move": fill "summary", "levels", "trend". Set ALL fields in "plan" to "".
- If request == "trend": fill "trend" + a short "summary" + "levels". Set ALL fields in "plan" to "".
- If request == "trade_plan": fill everything.`
});


exports.geminiProxy = functions.https.onCall(async (data, context) => {
  const { prompt } = data;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { response: text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError("internal", "Error calling Gemini API");
  }
});
