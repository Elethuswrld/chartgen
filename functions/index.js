const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.geminiProxy = functions.https.onCall(async (data, context) => {
  const { prompt } = data;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return { response: text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError("internal", "Error calling Gemini API");
  }
});
