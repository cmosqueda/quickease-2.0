/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import dayjs from "dayjs";
import { NavLink } from "react-router";

export default function UserAvatar({
  data,
  size = "2.5rem",
  fullName = `${data?.user?.first_name ?? "Unknown"} ${
    data?.user?.last_name ?? "User"
  }`,
  showDate = true,
  isAdmin = false,
}: {
  data: any;
  size?: string;
  fullName?: string;
  showDate?: boolean;
  isAdmin?: boolean;
}) {
  const formattedDate = dayjs(data.created_at).isValid()
    ? dayjs(data.created_at).format("MMMM DD, YYYY")
    : "Unknown date";

  return (
    <div className="flex flex-row gap-3 items-center">
      <img
        src={
          data.user?.avatar
            ? `/assets/images/avatars/${data.user?.avatar}.svg`
            : "/assets/images/avatars/blue.svg"
        }
        className={clsx(`w-[${size}] aspect-square`)}
      />
      <div>
        <NavLink
          to={
            isAdmin
              ? `/admin/user/${data.user?.id}`
              : `/learner/profile/${data.user?.id}`
          }
          className="font-semibold"
        >
          {fullName}
        </NavLink>
        {showDate && <p className="text-sm text-gray-500">{formattedDate}</p>}
      </div>
    </div>
  );
}
