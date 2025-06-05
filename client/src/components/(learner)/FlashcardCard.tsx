import { EllipsisVertical } from "lucide-react";
import { NavLink } from "react-router";

export default function FlashcardCard({
  title,
  term,
  date,
  link,
  onClick,
}: {
  title: string;
  term: number;
  date: string;
  link?: string;
  onClick: () => void;
}) {
  if (link) {
    return (
      <NavLink
        to={`/learner/flashcards/${link}`}
        className="flex flex-col gap-2 w-[24rem] min-h-[6rem] rounded-3xl bg-base-100 p-4 "
      >
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold text-xl">Lorem ipsum</h1>
          <details className="dropdown dropdown-end">
            <summary className="list-none cursor-pointer">
              <EllipsisVertical />
            </summary>
            <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <a>Delete</a>
              </li>
            </ul>
          </details>
        </div>
        <p>69 Terms / January 1, 1970</p>
      </NavLink>
    );
  }

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2 w-[24rem] min-h-[6rem] rounded-3xl bg-base-100 p-4 "
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-xl">Lorem ipsum</h1>
        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a>Delete</a>
            </li>
          </ul>
        </details>
      </div>
      <p>69 Terms / January 1, 1970</p>
    </div>
  );
}
