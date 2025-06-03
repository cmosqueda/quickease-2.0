import {
  ArrowLeft,
  BookDown,
  CalendarRange,
  ClipboardList,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  LucideBold,
  Save,
  X,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

export default function LearnerNotePage() {
  const data = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-row justify-between items-center border-b border-gray-300 p-4 bg-white">
        <ArrowLeft
          onClick={() => navigate("/learner/library")}
          className="cursor-pointer"
        />
        <div className="flex flex-row gap-4">
          <button className="btn btn-soft btn-success flex flex-row gap-4 items-center">
            <Save />
            <p>Save changes</p>
          </button>
          <button
            onClick={() => navigate("/learner/library")}
            className="btn btn-ghost btn-neutral flex flex-row gap-4 items-center"
          >
            <X />
            <p>Cancel</p>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_0.3fr]">
        <div className="flex flex-col gap-2 p-8">
          <h1 className="font-bold text-3xl">
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit...
          </h1>
          <div className="flex flex-row gap-2 p-4 rounded-3xl bg-white border border-gray-300">
            <LucideBold className="shrink-0 p-2 transition-all delay-0 duration-300 hover:bg-gray-200 rounded-xl cursor-pointer" size={36} />
            <Heading className="shrink-0 p-2 transition-all delay-0 duration-300 hover:bg-gray-200 rounded-xl cursor-pointer" size={36} />
            <Heading1 className="shrink-0 p-2 transition-all delay-0 duration-300 hover:bg-gray-200 rounded-xl cursor-pointer" size={36} />
            <Heading2 className="shrink-0 p-2 transition-all delay-0 duration-300 hover:bg-gray-200 rounded-xl cursor-pointer" size={36} />
            <Heading3 className="shrink-0 p-2 transition-all delay-0 duration-300 hover:bg-gray-200 rounded-xl cursor-pointer" size={36} />
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-white border-l border-b border-gray-300 p-4">
          <h1 className="font-bold text-xl">Study options</h1>
          <button className="rounded-3xl btn btn-soft gap-2 join-item">
            <BookDown />
            <h1>Generate summary</h1>
          </button>
          <button className="rounded-3xl btn btn-soft gap-2 join-item">
            <CalendarRange />
            <h1>Generate flashcards</h1>
          </button>
          <button className="rounded-3xl btn btn-soft gap-2 join-item">
            <ClipboardList />
            <h1>Generate quiz</h1>
          </button>
        </div>
      </div>
    </div>
  );
}
