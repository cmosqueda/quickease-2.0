import _AI from "../../utils/ai";

export async function generateSummaryNotesFromPDF(buffer: Buffer) {
  try {
    const prompt = `
Generate a concise summary of the provided document. The output must be a JSON object containing the summary as an HTML string, conforming to the provided schema.

**Content & HTML Rules:**
1.  The summary must accurately reflect the key information in the document.
2.  Generate semantic HTML for the summary content.
3.  Apply the following CSS classes EXACTLY as specified to their corresponding HTML tags:
    - '<h1>': class="text-4xl"
    - '<ul>': class="list-disc pl-8 list-outside"
    - '<ol>': class="list-decimal pl-8 list-outside"
    - '<code>': class="bg-base-200"
    - '<hr>': class="border-t border-base-content/25"

**JSON Schema:**
{
  "title": "string",
  "content": "string"
}`.trim();

    const contents = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const raw = JSON.parse(
      response.text!.replace(/^```json\s*/, "").replace(/```$/, "")
    );

    return {
      title: raw.title,
      content: raw.content,
    };
  } catch (err) {
    console.error("Failed to summarize:", err);
    return false;
  }
}

export async function generateQuizFromPDF(buffer: Buffer) {
  try {
    const prompt = `
Generate a quiz with at least 10 questions based on the provided document. The output must conform to the provided JSON schema.

**Content Rules:**
- Questions must be derived solely from the provided document.
- For multiple-choice questions, create plausible but incorrect distractor options.
- The 'correctAnswers' array must contain the 0-based index of the correct option (e.g., '[1]' for the second option).

**JSON Schema:**
{
  "title": "string",
  "quiz_content": [
    {
      "question": "string",
      "description": "string (can be empty)",
      "options": ["string"],
      "correctAnswers": [number]
    }
  ]
}`.trim();

    const contents = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const raw = JSON.parse(
      response.text!.replace(/^```json\s*/, "").replace(/```$/, "")
    );

    return {
      title: raw.title,
      quiz_content: raw.quiz_content,
    };
  } catch (err) {
    console.error("Failed to generate quiz:", err);
    return false;
  }
}

export async function generateFlashcardsFromPDF(buffer: Buffer) {
  try {
    const prompt = `
Generate a set of at least 10 flashcards based on the provided document. The output must conform to the provided JSON schema.

**Content Rules:**
- Flashcards must be derived solely from the provided document.
- The 'front' of each card must be a key term, name, or concept.
- The 'back' of each card must be its corresponding definition or explanation.

**JSON Schema:**
{
  "title": "string",
  "flashcards": [
    {
      "front": "string",
      "back": "string"
    }
  ]
}`.trim();

    const contents = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const raw = JSON.parse(
      response.text!.replace(/^```json\s*/, "").replace(/```$/, "")
    );

    return {
      title: raw.title,
      flashcards: raw.flashcards,
    };
  } catch (err) {
    console.error("Failed to generate flashcards:", err);
    return false;
  }
}

export async function generateSummaryNotesFromImage(buffer: Buffer) {
  try {
    const prompt = `
Generate a concise summary of the provided image. The output must be a JSON object containing the summary as an HTML string, conforming to the provided schema.

**Content & HTML Rules:**
1.  The summary must accurately describe the key information, text, and concepts present in the image.
2.  Generate semantic HTML for the summary content.
3.  Apply the following CSS classes EXACTLY as specified to their corresponding HTML tags:
    - '<h1>': class="text-4xl"
    - '<ul>': class="list-disc pl-8 list-outside"
    - '<ol>': class="list-decimal pl-8 list-outside"
    - '<code>': class="bg-base-200"
    - '<hr>': class="border-t border-base-content/25"

**JSON Schema:**
{
  "title": "string",
  "content": "string"
}`.trim();

    const contents = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const raw = JSON.parse(
      response.text!.replace(/^```json\s*/, "").replace(/```$/, "")
    );

    return {
      title: raw.title,
      content: raw.content,
    };
  } catch (err) {
    console.error("Failed to generate summary:", err);
    return false;
  }
}
