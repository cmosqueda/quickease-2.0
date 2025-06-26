/* eslint-disable @typescript-eslint/no-unused-vars */
import FlashcardCard from "./FlashcardCard";

import { NavLink } from "react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import type { Flashcard } from "@/types/types";

export default function FlashcardTab({
  flashcards,
}: {
  flashcards: Flashcard[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "user" | "ai">("all");

  const filteredFlashcards = flashcards.filter((fc) => {
    const matchesSearch = fc.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "user" && !fc.is_ai_generated) ||
      (filter === "ai" && fc.is_ai_generated);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Header: Search + Create */}
      <div className="flex flex-row justify-between items-center gap-4">
        <label className="input w-full lg:w-fit flex items-center gap-2">
          <Search size={20} />
          <input
            type="search"
            className="w-full lg:w-[20rem]"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <NavLink
          to="/learner/flashcards/create"
          className="btn btn-soft btn-success"
        >
          <Plus />
          <span className="lg:block hidden">Manually Create</span>
        </NavLink>
      </div>

      {/* Filter Options */}
      <div className="join my-4">
        <input
          type="radio"
          className="btn join-item"
          name="fc-filter"
          aria-label="All"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
        />
        <input
          type="radio"
          className="btn join-item"
          name="fc-filter"
          aria-label="From user"
          checked={filter === "user"}
          onChange={() => setFilter("user")}
        />
        <input
          type="radio"
          className="btn join-item"
          name="fc-filter"
          aria-label="AI-Generated"
          checked={filter === "ai"}
          onChange={() => setFilter("ai")}
        />
      </div>

      {/* Flashcard Grid */}
      <div className="flex flex-row gap-4 flex-wrap">
        {filteredFlashcards.length > 0 ? (
          filteredFlashcards.map((fc) => (
            <FlashcardCard
              key={fc.id}
              link={fc.id}
              term={fc.flashcards.length}
              date={fc.created_at}
              title={fc.title}
            />
          ))
        ) : (
          <p className="text-center w-full text-gray-500 mt-6">
            No flashcards found.
          </p>
        )}
      </div>
    </>
  );
}
