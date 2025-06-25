import clsx from "clsx";
import dayjs from "dayjs";
import { NavLink } from "react-router";

type NoteCardProps = {
  title: string;
  date?: string;
  link?: string;
  onClick?: () => void;
  style?: string;
};

export default function NoteCard({
  title,
  date,
  link,
  onClick,
  style,
}: NoteCardProps) {
  const Wrapper = link ? NavLink : "div";
  const wrapperProps = link ? { to: `/learner/note/${link}` } : { onClick };

  const formattedDate =
    date && dayjs(date).isValid()
      ? dayjs(date).format("MMMM DD, YYYY")
      : "Unknown date";

  return (
    <Wrapper
      {...wrapperProps}
      className={clsx(
        style,
        "flex flex-col justify-between w-[24rem] min-h-[16rem] p-4 rounded-3xl bg-base-100",
        "transition-all delay-0 duration-300 hover:shadow cursor-pointer"
      )}
    >
      <h1 className="font-bold text-2xl line-clamp-2">{title}</h1>
      <p className="text-sm text-gray-400">{formattedDate}</p>
    </Wrapper>
  );
}
