import useAuth from "@/hooks/useAuth";

import { Settings, UserCircle } from "lucide-react";
import { NavLink } from "react-router";
import UserAvatar from "../UserAvatar";

export default function ProfileDropdown() {
  const { user } = useAuth();

  return (
    <details className="dropdown dropdown-end">
      <summary className="list-none">
        <UserCircle
          className="shrink-0 grow p-2 bg-base-100 transition-all delay-0 duration-300 hover:bg-base-200 rounded-full cursor-pointer border border-base-300"
          size={40}
        />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-64 p-2 my-2 shadow-sm border border-base-300 gap-1">
        <li>
          <UserAvatar data={{ user: user }} showDate={false} />
        </li>
        <li>
          <NavLink
            to="/learner/settings"
            className={"flex flex-row items-center gap-3 px-5"}
          >
            <Settings />
            <p>Settings</p>
          </NavLink>
        </li>
      </ul>
    </details>
  );
}
