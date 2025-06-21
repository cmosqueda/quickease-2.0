import { NavLink } from "react-router";
import FlashcardCard from "./FlashcardCard";

import { Plus, Search } from "lucide-react";
import { useEffect } from "react";

export default function FlashcardTab({
  flashcards,
}: {
  flashcards: {
    id: string;
    title: string;
    description: string;
    flashcards: {
      front: string;
      back: string;
    }[];
    is_ai_generated: boolean;
    created_at: string;
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
          to="/learner/flashcards/create"
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
        {flashcards.map((flashcard) => (
          <FlashcardCard
            link={flashcard.id}
            term={flashcard.flashcards.length}
            date={flashcard.created_at}
            title={flashcard.title}
          />
        ))}
      </div>
    </>
  );
}
