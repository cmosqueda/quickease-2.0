import { GoogleGenAI } from "@google/genai";

/**
 * Instance of GoogleGenAI initialized with the API key from environment variables.
 * 
 * This object is used to interact with Google's Generative AI services.
 * 
 * @remarks
 * Ensure that the `GOOGLE_GEN_AI_API_KEY` environment variable is set before using this instance.
 */
const _AI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEN_AI_API_KEY,
});

export default _AI;
