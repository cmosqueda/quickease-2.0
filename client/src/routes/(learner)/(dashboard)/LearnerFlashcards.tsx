import NoteCard from "@/components/(learner)/NoteCard";
import clsx from "clsx";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";

export default function LearnerFlashcards() {
  const data = useLoaderData();
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    <>
      <div className="flex flex-row gap-4 flex-wrap">
        <NoteCard title={""} date={""} />
      </div>
    </>,
    <>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <input className="input rounded-3xl" />
          <SendHorizonal
            className="p-2 rounded-full bg-base-100 border border-base-content/30 shrink-0 cursor-pointer"
            size={40}
          />
        </div>
        <p className="hover:text-blue-500 text-xs my-2 cursor-pointer text-base-content/30 transition-all delay-0 duration-300">
          Please follow rules & regulations before generating.
        </p>
      </div>
    </>,
  ];

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <div>
        <h1 className="font-bold text-3xl lg:text-4xl">Flashcards</h1>
        <p className="text-base-content/30">
          Generate flashcards from your summary notes or simply prompt to
          generate one.
        </p>
      </div>
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx("tab flex-1", tabIndex == 0 ? "tab-active" : null)}
          onClick={() => setTabIndex(0)}
        >
          From summary notes
        </a>
        <a
          role="tab"
          className={clsx("tab flex-1", tabIndex == 1 ? "tab-active" : null)}
          onClick={() => setTabIndex(1)}
        >
          Generate prompt
        </a>
        <a
          role="tab"
          className={clsx("tab flex-1", tabIndex == 2 ? "tab-active" : null)}
          onClick={() => setTabIndex(2)}
        >
          Saved flashcards
        </a>
      </div>
      {tabs[tabIndex]}
    </div>
  );
}
