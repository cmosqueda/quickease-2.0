import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  MessageCircle,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

export default function LearnerPostPage() {
  const data = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="flex items-center justify-between">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/learner")}
        />
        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical
              className="rounded-full grow shrink-0 p-2 border border-base-200"
              size={36}
            />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 p-2 my-2 shadow-sm">
            <li>
              <a>Report</a>
            </li>
          </ul>
        </details>
      </div>
      <div className="flex flex-row items-center gap-3">
        <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
        <div>
          <p>user123986712893</p>
          <p className="text-base-content/40">January 1, 1970</p>
        </div>
      </div>
      <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp className="cursor-pointer delay-0 duration-300 transition-all hover:text-green-500" />
          <p>1</p>
          <ChevronDown className="cursor-pointer delay-0 duration-300 transition-all hover:text-red-500" />
        </div>
        <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300">
          <MessageCircle />
          <p>2</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1>Sort by</h1>
        <div className="flex flex-row gap-2 items-center">
          <div className="filter">
            <input
              className="btn btn-soft filter-reset"
              type="radio"
              aria-label="All"
              name="post-filters"
            />
            <input
              className="btn btn-soft"
              name="post-filters"
              type="radio"
              aria-label="Best"
            />
            <input
              className="btn btn-soft"
              name="post-filters"
              type="radio"
              aria-label="New"
            />
            <input
              className="btn btn-soft"
              name="post-filters"
              type="radio"
              aria-label="Old"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
