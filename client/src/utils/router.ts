import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "./axios";
import { redirect } from "react-router";

// Shared Auth Redirect Logic
export const checkAuthAndRedirect = async () => {
    try {
        const { status, data } = await _API_INSTANCE.get("/users", {
            withCredentials: true,
        });

        if (status === 200 && typeof data.is_admin === "boolean") {
            useAuth.getState().setUser(data);
            return redirect(data.is_admin ? "/admin" : "/learner");
        }

        console.warn("Unexpected response format", data);
        return null;
    } catch (err: any) {
        return err?.response?.status === 401 ? null : null;
    }
};

// Shared loader for learner resources
export const loadLearnerResources = async () => {
    try {
        const { status, data } = await _API_INSTANCE.get("/users", {
            withCredentials: true,
        });
        if (status === 200) {
            useAuth.getState().setUser(data);
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

// Parse localStorage generated content
export const getGeneratedContent = (key = "QUICKEASE_GENERATED_CONTENT") => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        return parsed.content?.title && parsed.content?.content
            ? {
                title: parsed.content.title,
                content: JSON.parse(parsed.content.content),
            }
            : null;
    } catch {
        return null;
    }
};