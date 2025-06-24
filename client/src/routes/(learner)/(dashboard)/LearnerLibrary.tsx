import FlashcardTab from "@/components/(learner)/FlashcardTab";
import NotesTab from "@/components/(learner)/NotesTab";
import NotificationsDropdown from "@/components/(learner)/NotificationsDropdown";
import ProfileDropdown from "@/components/(learner)/ProfileDropdown";
import QuizTab from "@/components/(learner)/QuizTab";
import clsx from "clsx";

import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

export default function LearnerLibraryPage() {
  const data = useLoaderData();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const tabs = [
    <NotesTab notes={data.notes} />,
    <FlashcardTab flashcards={data.flashcards} />,
    <QuizTab quizzes={data.quizzes} />,
  ]; // 0 - notes | 1 - flashcard | 2 - quiz

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold lg:text-4xl text-3xl">Library</h1>
        <div className="lg:flex flex-row items-center gap-2 hidden">
          <NotificationsDropdown />
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
