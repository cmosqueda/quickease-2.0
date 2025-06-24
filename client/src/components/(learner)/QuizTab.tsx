import QuizCard from "./QuizCard";

import { Search, Plus } from "lucide-react";
import { NavLink } from "react-router";

export default function QuizTab({
  quizzes,
}: {
  quizzes: {
    id: string;
    title: string;
    description: string;
    quiz_content: {
      correctAnswers: number[];
      description: string;
      options: string[];
      question: string;
    }[];
    is_public: boolean;
    is_ai_generated: boolean;
    is_randomized: boolean;
    timed_quiz: number;
    created_at: string;
    user_id: string;
  }[];
}) {
  return (
    <>
      <div className="flex flex-row justify-between items-center gap-4">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
        <NavLink
          to="/learner/quizzes/create"
          className="btn btn-soft btn-success"
        >
          <Plus />
          <h1>Manually create</h1>
        </NavLink>
      </div>
      <div className="filter">
        <input
          className="btn filter-reset"
          type="radio"
          name="metaframeworks"
          aria-label="All"
        />
        <input
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label="From user"
        />
        <input
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label="AI-Generated"
        />
      </div>
      <div className="flex flex-row gap-4 flex-wrap">
        {quizzes.map((quiz) => (
          <QuizCard
            link={quiz.id}
            date={quiz.date}
            title={quiz.title}
            term={quiz.quiz_content.length}
          />
        ))}
      </div>
    </>
  );
}
