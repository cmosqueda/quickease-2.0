import NoteCard from "./NoteCard";

import { Plus, Search } from "lucide-react";
import { NavLink } from "react-router";

export default function NotesTab({
  notes,
}: {
  notes: {
    id: string;
    title: string;
    notes_content: string;
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
        <NavLink to="/learner/note/create" className="btn btn-soft btn-success">
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
        {notes.map((note) => (
          <NoteCard title={note.title} date={note.created_at} link={note.id}  />
        ))}
      </div>
    </>
  );
}
