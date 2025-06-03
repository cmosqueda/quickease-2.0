import { Bell } from "lucide-react";

export default function NotificationsDropdown() {
  return (
    <details className="dropdown dropdown-end">
      <summary className="list-none">
        <Bell
          className="shrink-0 grow p-2 bg-base-100 transition-all delay-0 duration-300 hover:bg-base-200 rounded-full cursor-pointer border border-base-300"
          size={40}
        />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-[24rem] p-8 my-2 shadow-md border border-base-300 gap-4">
        <h1 className="font-bold text-2xl">Notifications</h1>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center rounded-xl p-4 bg-base-100/70 cursor-pointer delay-0 duration-300 hover:bg-base-200">
            <Bell />
            <p>Someone commented on your post!</p>
          </div>
        </div>
      </ul>
    </details>
  );
}
