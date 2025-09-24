import dayjs from "dayjs";
import clsx from "clsx";
import { NavLink, type NavLinkProps } from "react-router";

type FlashcardCardProps = {
  title: string;
  term?: number;
  date?: string | Date;
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

  const Wrapper: React.ElementType = link ? NavLink : "div";
  const wrapperProps: Partial<NavLinkProps> &
    React.HTMLAttributes<HTMLElement> = link
    ? { to: `/learner/flashcards/${link}` }
    : { onClick };

  return (
    <Wrapper
      {...wrapperProps}
      className={clsx(
        "flex flex-col gap-2 w-[24rem] min-h-[6rem] rounded-3xl bg-base-100 p-4 transition-all duration-300 hover:shadow cursor-pointer border-base-300 border shadow",
        className
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-xl line-clamp-1">
          {title || "Untitled"}
        </h1>
      </div>
      <p className="text-sm text-gray-500">
        {term} Term{term !== 1 && "s"} / {formattedDate}
      </p>
    </Wrapper>
  );
}
