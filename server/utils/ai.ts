import { GoogleGenAI } from "@google/genai";

const _AI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEN_AI_API_KEY,
})

export default _AI