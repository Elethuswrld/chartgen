const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

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
  // 1. Auth Check
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in to use the AI assistant.");
  }

  const { prompt } = data;
  const uid = context.auth.uid;

  // 2. Input Validation (simple size check)
  if (!prompt || typeof prompt !== 'string' || prompt.length > 5000) { // Limit prompt size
    throw new functions.https.HttpsError("invalid-argument", "The prompt is invalid or too long.");
  }

  // 3. Rate Limiting
  const requestsRef = db.collection('users').doc(uid).collection('geminiRequests');
  const now = admin.firestore.Timestamp.now();
  const oneMinuteAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 60000);
  const PER_MINUTE_LIMIT = 5;

  try {
    const snapshot = await requestsRef.where('timestamp', '>=', oneMinuteAgo).get();
    if (snapshot.size >= PER_MINUTE_LIMIT) {
      throw new functions.https.HttpsError('resource-exhausted', `Rate limit exceeded. Try again in a minute. The limit is ${PER_MINUTE_LIMIT} requests per minute.`);
    }

    // Log the current request *before* making the external call
    await requestsRef.add({ timestamp: now });

    // 4. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { response: text };

  } catch (error) {
    // Re-throw specific callable errors, otherwise log and throw a generic internal error.
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    console.error("Error in geminiProxy function:", error);
    throw new functions.https.HttpsError("internal", "An unexpected error occurred while processing your request.");
  }
});

exports.marketDataProxy = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "You must be logged in to access market data.");
    }
  
    const { source, endpoint, params } = data;
    const finnhubApiKey = process.env.FINNHUB_API_KEY;
  
    let url;
  
    try {
      switch (source) {
        case 'finnhub':
          const finnHubUrl = new URL(`https://finnhub.io/api/v1/${endpoint}`);
          finnHubUrl.search = new URLSearchParams(params).toString();
          finnHubUrl.searchParams.append('token', finnhubApiKey);
          url = finnHubUrl.toString();
          break;
        case 'binance':
            const binanceUrl = new URL(`https://api.binance.com/api/v3/${endpoint}`);
            binanceUrl.search = new URLSearchParams(params).toString();
            url = binanceUrl.toString();
          break;
        default:
          throw new functions.https.HttpsError("invalid-argument", "Invalid data source specified.");
      }
  
      const response = await axios.get(url);
      return response.data;
  
    } catch (error) {
      console.error(`Error fetching from ${source} proxy:`, error.message);
      throw new functions.https.HttpsError("internal", `Error fetching data from ${source}.`);
    }
});
