import dayjs from "dayjs";
import clsx from "clsx";

import { NavLink } from "react-router";

type QuizCardProps = {
  title: string;
  term: number;
  date: string;
  link?: string;
  onClick?: () => void;
};

export default function QuizCard({
  title,
  term,
  date,
  link,
  onClick,
}: QuizCardProps) {
  const Wrapper = link ? NavLink : "div";
  const wrapperProps = link ? { to: `/learner/quizzes/${link}` } : { onClick };

  const formattedDate = dayjs(date).isValid()
    ? dayjs(date).format("MMMM DD, YYYY")
    : "Unknown date";

  return (
    <Wrapper
      {...wrapperProps}
      className={clsx(
        "flex flex-col gap-2 w-[24rem] min-h-[6rem] rounded-3xl bg-base-100 p-4 cursor-pointer",
        !link && onClick && "hover:bg-base-200 transition"
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-xl truncate">{title}</h1>
      </div>
      <p className="text-sm text-gray-500">
        {term} item{term !== 1 && "s"} / {formattedDate}
      </p>
    </Wrapper>
  );
}
