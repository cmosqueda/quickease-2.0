import NoteCard from "@/components/(learner)/NoteCard";
import clsx from "clsx";

import { Search } from "lucide-react";
import { useState } from "react";

export default function LearnerLibraryPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
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
    </>,
  ];

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <h1 className="font-bold lg:text-4xl">Library</h1>
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx("tab", tabIndex == 0 ? "tab-active" : null)}
          onClick={() => setTabIndex(0)}
        >
          Summary notes
        </a>
        <a
          role="tab"
          className={clsx("tab", tabIndex == 1 ? "tab-active" : null)}
          onClick={() => setTabIndex(1)}
        >
          Flashcards
        </a>
        <a
          role="tab"
          className={clsx("tab", tabIndex == 2 ? "tab-active" : null)}
          onClick={() => setTabIndex(2)}
        >
          Quizzes
        </a>
      </div>
      {tabs[tabIndex]}
    </div>
  );
}
