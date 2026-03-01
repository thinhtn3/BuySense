import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3-flash-preview';

let ai = null;

function getClient() {
  if (ai) return ai;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  ai = new GoogleGenAI({ apiKey });
  return ai;
}

/**
 * Send a single prompt and get a text response.
 * @param {string} prompt
 * @param {string} [systemInstruction]
 * @returns {Promise<string>}
 */
export async function chat(prompt, systemInstruction) {
  const response = await getClient().models.generateContent({
    model:    MODEL,
    contents: prompt,
    config:   systemInstruction ? { systemInstruction } : undefined,
  });
  return response.text;
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
export async function chatWithHistory(history = [], userMessage, systemInstruction) {
  const session = getClient().chats.create({
    model:   MODEL,
    history,
    config:  systemInstruction ? { systemInstruction } : undefined,
  });

  const response = await session.sendMessage({ message: userMessage });
  const reply    = response.text;

  return {
    reply,
    history: [
      ...history,
      { role: 'user',  parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: reply }] },
    ],
  };
}
