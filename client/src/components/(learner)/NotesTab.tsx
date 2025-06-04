import NoteCard from "./NoteCard";

import { Search } from "lucide-react";

export default function NotesTab({ notes }: { notes: any[] }) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
      </div>
      <div className="flex flex-row gap-4 flex-wrap">
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
        <NoteCard />
      </div>
    </>
  );
}
