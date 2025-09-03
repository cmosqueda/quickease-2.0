/* eslint-disable @typescript-eslint/no-unused-vars */
import FlashcardTab from "@/components/(learner)/FlashcardTab";
import NotesTab from "@/components/(learner)/NotesTab";
import QuizTab from "@/components/(learner)/QuizTab";
import ProfileDropdown from "@/components/(learner)/ProfileDropdown";
import clsx from "clsx";

import { useEffect, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";

export default function LearnerLibraryPage() {
  const data = useLoaderData();
  const [params, setParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    <NotesTab notes={data.notes} />,
    <FlashcardTab flashcards={data.flashcards} />,
    <QuizTab quizzes={data.quizzes} />,
  ];

  useEffect(() => {
    switch (params.get("tab")) {
      case "notes":
        setTabIndex(0);
        break;
      case "flashcards":
        setTabIndex(1);
        break;
      case "quizzes":
        setTabIndex(2);
        break;
      default:
        setTabIndex(0);
        break;
    }
  }, [params]);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold lg:text-4xl text-3xl">Library</h1>
        <div className="lg:flex flex-row items-center gap-2 hidden">
          <ProfileDropdown />
        </div>
      </div>
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx("tab flex-1", tabIndex == 0 ? "tab-active" : null)}
          onClick={() => setTabIndex(0)}
        >
          Summary notes
        </a>
        <a
          role="tab"
          className={clsx("tab flex-1", tabIndex == 1 ? "tab-active" : null)}
          onClick={() => setTabIndex(1)}
        >
          Flashcards
        </a>
        <a
          role="tab"
          className={clsx("tab flex-1", tabIndex == 2 ? "tab-active" : null)}
          onClick={() => setTabIndex(2)}
        >
          Quizzes
        </a>
      </div>
      {tabs[tabIndex]}
    </div>
  );
}
