import NoteCard from "./NoteCard";

import { Plus, Search } from "lucide-react";
import { NavLink } from "react-router";

export default function NotesTab({ notes }: { notes: any[] }) {
  return (
    <>
      <div className="flex flex-row justify-between items-center gap-4">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
        <NavLink
          to="/learner/note/create"
          className="btn btn-soft btn-success"
        >
          <Plus />
          <h1>Manually create</h1>
        </NavLink>
      </div>
      <div className="flex flex-row gap-4 flex-wrap">
        <NoteCard link="1" />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
      </div>
    </>
  );
}
