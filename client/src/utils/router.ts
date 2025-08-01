/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "./axios";
import { redirect } from "react-router";

// Shared Auth Redirect Logic
export const checkAuthAndRedirect = async () => {
  try {
    const { status, data } = await _API_INSTANCE.get("/users/check", {
      withCredentials: true,
    });

    if (status === 200 && typeof data.is_admin === "boolean") {
      return redirect(data.is_admin ? "/admin" : "/learner");
    }

    console.warn("Unexpected response format", data);
    return null;
  } catch (err: any) {
    return err?.response?.status === 401 ? null : null;
  }
};

export const loadUserNotes = async () => {
  try {
    const { status } = await _API_INSTANCE.get("/users/check", {
      withCredentials: true,
    });

    if (status === 200) {
      const [notes] = await Promise.all([_API_INSTANCE.get("/notes")]);
      return {
        notes: notes.data,
      };
    }
  } catch {
    return redirect("/");
  }
};

export const loadLearnerResources = async () => {
  try {
    const { status } = await _API_INSTANCE.get("/users/check", {
      withCredentials: true,
    });

    if (status === 200) {
      const [notes, flashcard, quiz] = await Promise.all([
        _API_INSTANCE.get("/notes"),
        _API_INSTANCE.get("/flashcard"),
        _API_INSTANCE.get("/quiz"),
      ]);
      return {
        notes: notes.data,
        flashcards: flashcard.data,
        quizzes: quiz.data,
      };
    }
  } catch {
    return redirect("/");
  }
};

export const getGeneratedContent = (
  key = "QUICKEASE_GENERATED_CONTENT"
): { title: string; content: any } | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (!parsed?.content) return null;

    const isJsonContent =
      parsed.content.trim().startsWith("{") ||
      parsed.content.trim().startsWith("[");
    const parsedContent = isJsonContent
      ? JSON.parse(parsed.content)
      : parsed.content;

    return {
      title: parsed.title || "Generated Content",
      content: parsedContent,
    };
  } catch {
    return null;
  }
};
