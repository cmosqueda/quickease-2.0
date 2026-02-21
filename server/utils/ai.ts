import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GEN_AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GOOGLE_GEN_AI_API_KEY is not defined in the environment variables.",
  );
}

/**
 * Instance of GoogleGenAI initialized with the API key from environment variables.
 *
 * This object is used to interact with Google's Generative AI services.
 *
 * @remarks
 * Ensure that the `GOOGLE_GEN_AI_API_KEY` environment variable is set before using this instance.
 */
const _AI = new GoogleGenAI({ apiKey });

export default _AI;
