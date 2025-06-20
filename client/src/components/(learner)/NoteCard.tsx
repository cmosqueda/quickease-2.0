import clsx from "clsx";
import dayjs from "dayjs";
import { NavLink } from "react-router";

export default function NoteCard({
  title,
  date,
  link,
  onClick,
  style,
}: {
  title: string;
  date: string;
  link?: string;
  onClick?: () => void;
  style?: string;
}) {
  if (link)
    return (
      <NavLink
        to={`/learner/note/${link}`}
        className={clsx(
          style,
          "flex flex-col justify-between w-[24rem] min-h-[16rem] p-4 rounded-3xl bg-base-100 ",
          "transition-all delay-0 duration-300 hover:shadow cursor-pointer"
        )}
      >
        <h1 className="font-bold text-2xl">{title}</h1>
        <p className="text-sm text-gray-400">
          {dayjs(date).format("MMMM DD, YYYY").toString()}
        </p>
      </NavLink>
    );

  return (
    <div
      onClick={onClick}
      className={clsx(
        style,
        "flex flex-col justify-between w-[24rem] min-h-[16rem] p-4 rounded-3xl bg-base-100 ",
        "transition-all delay-0 duration-300 hover:shadow cursor-pointer"
      )}
    >
      <h1 className="font-bold text-2xl">Lorem ipsum.</h1>
      <p className="text-sm text-gray-400">January 5, 2025</p>
    </div>
  );
}
