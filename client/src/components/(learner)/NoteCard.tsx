import clsx from "clsx";
import { NavLink } from "react-router";

export default function NoteCard({
  title,
  date,
  link,
}: {
  title: string;
  date: string;
  link: string;
}) {
  return (
    <NavLink
      to={link}
      className={clsx(
        "flex flex-col justify-between w-[24rem] h-[16rem] p-4 rounded-3xl bg-white border border-gray-200",
        "transition-all delay-0 duration-300 hover:shadow cursor-pointer"
      )}
    >
      <h1 className="font-bold text-2xl">Lorem ipsum.</h1>
      <p className="text-sm text-gray-400">January 5, 2025</p>
    </NavLink>
  );
}
