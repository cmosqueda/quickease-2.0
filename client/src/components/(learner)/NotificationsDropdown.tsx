/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";

import { Bell } from "lucide-react";
import { Link } from "react-router";

interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: string;
  resource_id: string;
  resource_type: "POST" | "COMMENT";
  message: string;
  is_read: boolean;
  created_at: Date;
}

export default function NotificationsDropdown({
  notifications,
}: {
  notifications: Notification[];
}) {
  const handleMarkAsRead = async (id: string) => {
    await _API_INSTANCE.put("notifications/mark-as-read", {
      notification_id: id,
    });
  };

  return (
    <details className="dropdown dropdown-end">
      <summary className="list-none">
        <div className="relative">
          {notifications.filter((n) => !n.is_read).length > 0 && (
            <>
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {notifications.filter((n) => !n.is_read).length > 99
                  ? "99+"
                  : notifications.filter((n) => !n.is_read).length}
              </span>
            </>
          )}

          <Bell
            className="shrink-0 grow p-2 bg-base-100 transition-all delay-0 duration-300 hover:bg-base-200 rounded-full cursor-pointer border border-base-300"
            size={40}
          />
        </div>
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-[24rem] p-8 my-2 shadow-md border border-base-300 gap-4 max-h-[52rem]">
        <div className="flex flex-row gap-3 items-center">
          {notifications.filter((n) => !n.is_read).length > 0 && (
            <p className="px-3 py-1 bg-info rounded-full text-base-100">
              {notifications.filter((notif) => notif.is_read == false).length}
            </p>
          )}

          <h1 className="font-bold text-2xl">Notifications</h1>
        </div>

        <div className="flex flex-col gap-2">
          {notifications.map((notification: Notification) => (
            <Link
              key={notification.id}
              className="relative flex flex-row gap-2 items-center rounded-xl p-4 bg-base-100/70 cursor-pointer delay-0 duration-300 hover:bg-base-200"
              to={`post/${notification.resource_id}`}
              onClick={async () => handleMarkAsRead(notification.id)}
            >
              <div className="relative">
                {!notification.is_read ? (
                  <span className="w-[8px] h-[8px] rounded-full bg-error top-0 left-1 absolute" />
                ) : null}

                <Bell size={28} />
              </div>
              <h1>{notification.message}</h1>
            </Link>
          ))}
        </div>
      </ul>
    </details>
  );
}
