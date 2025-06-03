import { UserCircle } from "lucide-react";

export default function ProfileDropdown() {
  return (
    <details className="dropdown dropdown-end">
      <summary className="list-none">
        <UserCircle
          className="shrink-0 grow p-2 bg-base-100 transition-all delay-0 duration-300 hover:bg-base-200 rounded-full cursor-pointer border border-base-300"
          size={40}
        />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 my-2 shadow-sm border border-base-300">
        <li>
          <a>USERNAME</a>
        </li>
        <li>
          <a>Settings</a>
        </li>
      </ul>
    </details>
  );
}
