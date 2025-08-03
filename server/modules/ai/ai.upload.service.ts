import _AI from "../../utils/ai";

export async function generateSummaryNotesFromPDF(buffer: Buffer) {
  try {
    const contents = [
      {
        text: `Summarize this document. Output JSON only, classnames below.
                h1: text-4xl
                ul: list-disc pl-8 list-outside
                ol: list-decimal pl-8 list-outside
                code: bg-base-200
                hr: "border-t border-base-content/25
                
                Return a JSON string in this format:
                {
                title: string;
                content: string (return in HTML string);
                }
                `.trim(),
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
    const contents = [
      {
        text: `Generate quiz from this document"

                Return a JSON string in this format:
                {
                title: string,
                quiz_content: {
                question: string;
                description: string;
                options: string[];
                correctAnswers: number[];
                }[]
                }

                Only output the JSON string.
                `.trim(),
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
    const contents = [
      {
        text: `
        Generate atleast 10 flashcards from this document.
        Return a JSON string in this format:
        {
        title: string;
        flashcards: { front: string; back: string; }[]
        }
`.trim(),
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
    const contents = [
      {
        text: `Summarize this document. Output JSON only, classnames below.
                h1: text-4xl
                ul: list-disc pl-8 list-outside
                ol: list-decimal pl-8 list-outside
                code: bg-base-200
                hr: "border-t border-base-content/25
                
                Return a JSON string in this format:
                {
                title: string;
                content: string (return in HTML string);
                }
                `.trim(),
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
