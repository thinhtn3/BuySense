import { GoogleGenerativeAI } from "@google/generative-ai";

let client = null;

function getClient() {
  if (client) return client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  client = new GoogleGenerativeAI(apiKey);
  return client;
}

/**
 * Send a single prompt and get a text response.
 * @param {string} prompt
 * @param {string} [systemInstruction]
 * @returns {Promise<string>}
 */
export async function chat(prompt, systemInstruction) {
  const model = getClient().getGenerativeModel({
    model: "gemini-3-flash-preview",
    ...(systemInstruction ? { systemInstruction } : {}),
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Multi-turn conversation — pass the full history each time.
 * history format: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
 *
 * @param {Array}  history
 * @param {string} userMessage
 * @param {string} [systemInstruction]
 * @returns {Promise<{ reply: string, history: Array }>}
 */
export async function chatWithHistory(
  history = [],
  userMessage,
  systemInstruction,
) {
  const model = getClient().getGenerativeModel({
    model: "gemini-1.5-flash",
    ...(systemInstruction ? { systemInstruction } : {}),
  });

  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessage(userMessage);
  const reply = result.response.text();

  return {
    reply,
    history: [
      ...history,
      { role: "user", parts: [{ text: userMessage }] },
      { role: "model", parts: [{ text: reply }] },
    ],
  };
}
