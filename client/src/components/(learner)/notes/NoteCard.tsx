import clsx from "clsx";
import dayjs from "dayjs";
import { NavLink } from "react-router";
import type { MouseEventHandler } from "react";

type BaseProps = {
  title: string;
  date?: Date;
  style?: string;
};

type ButtonCardProps = {
  link?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

type LinkCardProps = {
  link: string;
  onClick?: never;
  disabled?: never;
};

type NoteCardProps = BaseProps & (ButtonCardProps | LinkCardProps);

export default function NoteCard({
  title,
  date,
  link,
  onClick,
  style,
  disabled = false,
}: NoteCardProps) {
  const formattedDate =
    date && dayjs(date).isValid()
      ? dayjs(date).format("MMMM DD, YYYY")
      : "Unknown date";

  if (link) {
    return (
      <NavLink
        to={`/learner/note/${link}`}
        className={clsx(
          style,
          "flex flex-col justify-between w-[24rem] min-h-[16rem] p-4 rounded-3xl bg-base-100 border border-base-300 shadow disabled:bg-base-300 disabled:cursor-not-allowed",
          "transition-all delay-0 duration-300 hover:shadow cursor-pointer"
        )}
      >
        <h1 className="font-bold text-2xl line-clamp-2">{title}</h1>
        <p className="text-sm text-gray-400">{formattedDate}</p>
      </NavLink>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        style,
        "flex flex-col justify-between w-[24rem] min-h-[16rem] p-4 rounded-3xl bg-base-100 border border-base-300 shadow disabled:bg-base-300 disabled:cursor-not-allowed",
        "transition-all delay-0 duration-300 hover:shadow cursor-pointer"
      )}
    >
      <h1 className="font-bold text-2xl line-clamp-2">{title}</h1>
      <p className="text-sm text-gray-400">{formattedDate}</p>
    </button>
  );
}
