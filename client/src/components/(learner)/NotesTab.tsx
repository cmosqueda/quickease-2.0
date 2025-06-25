import NoteCard from "./NoteCard";

import { useState } from "react";
import { NavLink } from "react-router";
import { Plus, Search } from "lucide-react";
import type { Note } from "@/types/types";



export default function NotesTab({ notes }: { notes: Note[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "user" | "ai">("all");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "user" && !note.is_ai_generated) ||
      (filter === "ai" && note.is_ai_generated);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Header: Search + Create */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <label className="input w-full lg:w-fit flex items-center gap-2">
          <Search size={20} />
          <input
            type="search"
            className="w-full lg:w-[20rem]"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <NavLink to="/learner/note/create" className="btn btn-soft btn-success">
          <Plus />
          <span>Manually Create</span>
        </NavLink>
      </div>

      {/* Filter Options */}
      <div className="join my-4">
        <input
          type="radio"
          className="btn join-item"
          name="note-filter"
          aria-label="All"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
        />
        <input
          type="radio"
          className="btn join-item"
          name="note-filter"
          aria-label="From user"
          checked={filter === "user"}
          onChange={() => setFilter("user")}
        />
        <input
          type="radio"
          className="btn join-item"
          name="note-filter"
          aria-label="AI-Generated"
          checked={filter === "ai"}
          onChange={() => setFilter("ai")}
        />
      </div>

      {/* Notes Grid */}
      <div className="flex flex-row gap-4 flex-wrap">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              link={note.id}
              title={note.title}
              date={note.created_at}
            />
          ))
        ) : (
          <p className="text-center w-full text-gray-500 mt-6">
            No notes found.
          </p>
        )}
      </div>
    </>
  );
}
