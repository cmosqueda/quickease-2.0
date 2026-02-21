import _AI from "./utils/ai";

async function testAI() {
  try {
    console.log("Checking AI client initialization...");
    const model = _AI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Model instance created successfully.");

    // We don't necessarily need to make a network call to verify the client has the API key
    // But we can check if it's there.
    if ((_AI as any).apiKey) {
      console.log("API Key is present in the client.");
    } else {
      console.error("API Key is MISSING in the client.");
    }
  } catch (error) {
    console.error("AI Initialization failed:", error);
    process.exit(1);
  }
}

testAI();
