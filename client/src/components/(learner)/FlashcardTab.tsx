import { NavLink } from "react-router";
import FlashcardCard from "./FlashcardCard";

import { Plus, Search } from "lucide-react";

export default function FlashcardTab({ flashcards }: { flashcards: any[] }) {
  return (
    <>
      <div className="flex flex-row justify-between items-center gap-4">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
        <NavLink to='/learner/flashcards/create' className="btn btn-soft btn-success">
          <Plus />
          <h1>Manually create</h1>
        </NavLink>
      </div>
      <div className="flex flex-row gap-4 flex-wrap">
        <FlashcardCard link="1"/>
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
        <FlashcardCard />
      </div>
    </>
  );
}
