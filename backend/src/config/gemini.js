const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;

let aiClient = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Error initializing GoogleGenAI client:', err.message);
  }
}

const getGeminiClient = () => aiClient;

module.exports = {
  getGeminiClient,
};
