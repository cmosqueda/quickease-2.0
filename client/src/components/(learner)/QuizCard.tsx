import dayjs from "dayjs";
import clsx from "clsx";

import { NavLink } from "react-router";

type BaseProps = {
  title: string;
  term: number;
  date: Date;
};

type LinkProps = {
  link: string;
  onClick?: never;
};

type ClickableDivProps = {
  link?: undefined;
  onClick: () => void;
};

type QuizCardProps = BaseProps & (LinkProps | ClickableDivProps);

export default function QuizCard({
  title,
  term,
  date,
  link,
  onClick,
}: QuizCardProps) {
  const formattedDate = dayjs(date).isValid()
    ? dayjs(date).format("MMMM DD, YYYY")
    : "Unknown date";

  if (link) {
    return (
      <NavLink
        to={`/learner/quizzes/${link}`}
        className={clsx(
          "flex flex-col gap-2 w-[24rem] min-h-[6rem] rounded-3xl bg-base-100 p-4 cursor-pointer border border-base-300 shadow"
        )}
      >
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold text-xl truncate">{title}</h1>
        </div>
        <p className="text-sm text-gray-500">
          {term} item{term !== 1 && "s"} / {formattedDate}
        </p>
      </NavLink>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex flex-col gap-2 w-[24rem] min-h-[6rem] rounded-3xl bg-base-100 p-4 cursor-pointer border border-base-300 shadow",
        "hover:bg-base-200 transition"
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-xl truncate">{title}</h1>
      </div>
      <p className="text-sm text-gray-500">
        {term} item{term !== 1 && "s"} / {formattedDate}
      </p>
    </div>
  );
}
