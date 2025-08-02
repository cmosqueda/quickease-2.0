import AsyncStorage from "@react-native-async-storage/async-storage";
import _API_INSTANCE from "@/utils/axios";

import { Quiz } from "@/types/user/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ToastAndroid } from "react-native";

type _useQuiz = {
  quizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
  addQuizzes: (quiz: Quiz, user_id: string) => void;
  deleteQuizzes: (quiz_id: string) => void;
  editQuizzes: (quiz: Quiz, quiz_id: string) => void;

  toggleQuizVisibility: ({
    visibility,
    quiz_id,
  }: {
    visibility: boolean;
    quiz_id: string;
  }) => void;
};
const useQuiz = create<_useQuiz>()(
  persist(
    immer((set, get) => ({
      quizzes: [],

      setQuizzes: (quizzes) => set({ quizzes }),

      addQuizzes: async (quiz, user_id) => {
        try {
          const newQuiz = await _API_INSTANCE.post("quiz/create", {
            title: quiz.title,
            description: quiz.description,
            quiz_content: quiz.quiz_content,
            is_randomized: quiz.is_randomized,
            timed_quiz: quiz.timed_quiz,
            user_id,
          });

          set((state) => {
            state.quizzes.push(newQuiz.data);
          });
          ToastAndroid.show("Quiz added.", ToastAndroid.SHORT);
          return true;
        } catch (err) {
          ToastAndroid.show("Error adding quiz.", ToastAndroid.SHORT);
          return false;
        }
      },
      deleteQuizzes: async (quiz_id) => {
        try {
          await _API_INSTANCE.delete("quiz/delete", {
            data: {
              quiz_id,
            },
          });

          set((state) => {
            state.quizzes = state.quizzes.filter((q) => q.id !== quiz_id);
          });

          ToastAndroid.show("Quiz deleted.", ToastAndroid.SHORT);
          return true;
        } catch (err) {
          ToastAndroid.show("Error deleting quiz.", ToastAndroid.SHORT);
          return false;
        }
      },

      editQuizzes: async (quiz, quiz_id) => {
        try {
          const newQuiz = await _API_INSTANCE.put("quiz/update", {
            title: quiz.title,
            description: quiz.description,
            quiz_content: quiz.quiz_content,
            is_randomized: quiz.is_randomized,
            timed_quiz: quiz.timed_quiz,
            quiz_id: quiz.id,
          });

          set((state) => {
            state.quizzes = state.quizzes.map((q) =>
              q.id === quiz_id ? newQuiz.data : q
            );
          });

          ToastAndroid.show("Quiz updated.", ToastAndroid.SHORT);
          return true;
        } catch (err) {
          ToastAndroid.show("Error updating quiz.", ToastAndroid.SHORT);
          return false;
        }
      },

      toggleQuizVisibility: async ({ visibility, quiz_id }) => {
        try {
          await _API_INSTANCE.put("quiz/toggle-visibility", {
            visibility,
            quiz_id,
          });

          set((state) => {
            const quiz = state.quizzes.find((q) => q.id === quiz_id);
            if (quiz) {
              quiz.is_public = visibility;
            }
          });

          ToastAndroid.show("Quiz visibility updated.", ToastAndroid.SHORT);
          return true;
        } catch (err) {
          ToastAndroid.show(
            "Error updating quiz visibility.",
            ToastAndroid.SHORT
          );
          return false;
        }
      },
    })),
    {
      name: "user-quizzes",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        quizzes: state.quizzes,
      }),
    }
  )
);

export default useQuiz;
