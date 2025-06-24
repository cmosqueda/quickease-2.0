import dayjs from "dayjs";
import clsx from "clsx";
import { EllipsisVertical } from "lucide-react";
import { NavLink } from "react-router";

type FlashcardCardProps = {
  title: string;
  term?: number;
  date?: string;
  link?: string;
  onClick?: () => void;
  className?: string;
};

export default function FlashcardCard({
  title,
  term = 0,
  date,
  link,
  onClick,
  className,
}: FlashcardCardProps) {
  const formattedDate =
    date && dayjs(date).isValid()
      ? dayjs(date).format("MMMM DD, YYYY")
      : "Unknown date";

  const Wrapper = link ? NavLink : "div";
  const wrapperProps = link
    ? { to: `/learner/flashcards/${link}` }
    : { onClick };

  return (
    <Wrapper
      {...wrapperProps}
      className={clsx(
        "flex flex-col gap-2 w-[24rem] min-h-[6rem] rounded-3xl bg-base-100 p-4 transition-all duration-300 hover:shadow cursor-pointer",
        className
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-xl line-clamp-1">
          {title || "Untitled"}
        </h1>
        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <button type="button">Delete</button>
            </li>
          </ul>
        </details>
      </div>
      <p className="text-sm text-gray-500">
        {term} Terms / {formattedDate}
      </p>
    </Wrapper>
  );
}
