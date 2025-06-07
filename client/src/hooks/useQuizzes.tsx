import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Question = {
  title: string;
  description?: string;
  answers: {
    index: number;
    text: string;
  }[];
  correctAnswerIndex: number;
};

type Quiz = {
  id: string;
  content: Question[];
  title: string;
  description?: string;
  updated_at: string | Date;
  created_at: string | Date;
  user: string; // relational -> user
};

type QuizStore = {
  quizzes?: Quiz[];
  createQuiz: (content: Question[], title: string, description: string) => void;
  updateQuiz: (
    id: string,
    content: Question[],
    title: string,
    description: string
  ) => void;
  deleteQuiz: (id: string) => void;
};

const useQuizzes = create<QuizStore>()(
  immer((set, get) => ({
    quizzes: undefined,
    createQuiz: (content, title, description) => {},
    updateQuiz: (id, content, title, description) => {},
    deleteQuiz: (id) => {},
  }))
);

export default useQuizzes;
