/* eslint-disable @typescript-eslint/no-unused-vars */
import QuizCard from "../quiz/QuizCard";

import { Search, Plus } from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";
import type { Quiz } from "@/types/types";

export default function QuizTab({ quizzes }: { quizzes: Quiz[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "user" | "ai">("all");

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "user" && !quiz.is_ai_generated) ||
      (filter === "ai" && quiz.is_ai_generated);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-4">
        <label className="input w-full lg:w-fit flex items-center gap-2">
          <Search size={20} />
          <input
            type="search"
            className="w-full lg:w-[20rem]"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <NavLink to="/learner/quizzes/create" className="btn btn-neutral">
          <Plus />
          <span className="lg:block hidden">Manually Create</span>
        </NavLink>
      </div>

      <div className="join my-4">
        <input
          type="radio"
          className="btn join-item"
          name="quiz-filter"
          aria-label="All"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
        />
        <input
          type="radio"
          className="btn join-item"
          name="quiz-filter"
          aria-label="From user"
          checked={filter === "user"}
          onChange={() => setFilter("user")}
        />
        <input
          type="radio"
          className="btn join-item"
          name="quiz-filter"
          aria-label="AI-Generated"
          checked={filter === "ai"}
          onChange={() => setFilter("ai")}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              link={quiz.id}
              date={quiz.created_at}
              title={quiz.title}
              term={quiz.quiz_content.length}
            />
          ))
        ) : (
          <p className="text-center w-full text-gray-500 mt-6">
            No quizzes found.
          </p>
        )}
      </div>
    </>
  );
}
