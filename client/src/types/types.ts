export type Flashcard = {
    id: string;
    title: string;
    description: string;
    flashcards: { front: string; back: string }[];
    is_ai_generated: boolean;
    created_at: string;
};

export type Note = {
    id: string;
    title: string;
    notes_content: string;
    created_at: string;
    is_ai_generated?: boolean;
};

export type Quiz = {
    id: string;
    title: string;
    description: string;
    quiz_content: {
        correctAnswers: number[];
        description: string;
        options: string[];
        question: string;
    };
    is_public: boolean;
    is_ai_generated: boolean;
    is_randomized: boolean;
    timed_quiz: number;
    created_at: string;
    user_id: string;
    date: string;
};