import { UserCircle } from "lucide-react";

export default function ProfileDropdown() {
  return (
    <details className="dropdown dropdown-end">
      <summary className="list-none">
        <UserCircle
          className="shrink-0 grow p-2 bg-white transition-all delay-0 duration-300 hover:bg-gray-100 rounded-full cursor-pointer border border-gray-300"
          size={40}
        />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 my-2 shadow-sm">
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
