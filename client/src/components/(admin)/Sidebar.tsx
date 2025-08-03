import clsx from "clsx";
import ThemeBox from "../ThemeBox";

import {
  BookOpen,
  ChevronLeft,
  LogOut,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import _API_INSTANCE from "@/utils/axios";
import { toast } from "sonner";

export default function Sidebar({ tab }: { tab: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);
  const navigate = useNavigate();

  const links = [
    {
      title: "Manage Users",
      icon: <Users />,
      link: "/admin",
    },
    {
      title: "Report Management",
      icon: <BookOpen />,
      link: "/admin/reports",
    },
  ];

  useEffect(() => {
    setCurrentTab(tab);
  }, [tab]);

  return (
    <div
      className={clsx(
        "w-full p-3",
        "relative bg-base-100 border-r border-base-300 transition-all delay-0 duration-300 ease-in-out lg:px-4 lg:py-8 ",
        isOpen ? "lg:w-[18rem] " : "lg:w-[8rem]"
      )}
    >
      {/* desktop sidebar heading */}
      {isOpen ? (
        <div className="hidden lg:flex flex-row gap-4 items-center justify-center">
          <img
            src="/assets/images/icon.png"
            className="w-[52px] h-[52px] aspect-square"
          />
          <h1
            className={clsx(
              "lg:block hidden",
              "font-bold text-center transition-all delay-0 duration-100",
              isOpen ? "text-3xl block" : "hidden"
            )}
          >
            QuickEase
          </h1>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col items-center justify-center">
          <img
            src="/assets/images/icon.png"
            className="w-[52px] h-[52px] aspect-square"
          />
        </div>
      )}
      {/* desktop sidebar heading */}

      <div className="flex flex-row lg:hidden justify-between gap-4">
        <div className="flex flex-row gap-3 items-center">
          <img
            src="/assets/images/icon.png"
            className="w-[36px] h-[36px] aspect-square"
          />
          <h1 className="font-bold text-xl">QuickEase</h1>
        </div>
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <label htmlFor="mobile-drawer" className="lg:hidden">
            <Menu />
          </label>
        </div>
      </div>

      {/* mobile drawer here, TODO pa */}
      <div className="drawer lg:hidden">
        <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label
            htmlFor="mobile-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="w-[20rem] p-4 flex flex-col gap-8 bg-base-100 h-screen">
            <div className="flex flex-row gap-4">
              <img
                src="/assets/images/icon.png"
                className="w-[36px] h-[36px] aspect-square"
              />
              <h1 className="font-bold text-3xl">QuickEase</h1>
            </div>
            <div className="flex flex-col gap-2">
              {links.slice(0, 2).map((link) => (
                <NavLink
                  to={link.link}
                  className={clsx(
                    "flex flex-row gap-4 items-center cursor-pointer transition-all delay-0 duration-300 p-4 rounded-xl",
                    currentTab == link.link
                      ? "bg-neutral text-white"
                      : "hover:bg-base-200",
                    isOpen ? "justify-start" : "justify-center"
                  )}
                >
                  {link.icon}
                  <h1 className={clsx(isOpen ? "block" : "hidden")}>
                    {link.title}
                  </h1>
                </NavLink>
              ))}
            </div>
          </ul>
        </div>
      </div>
      {/* mobile drawer here, TODO pa */}

      {/* desktop sidebar */}
      <div className="hidden relative lg:sticky lg:top-0 lg:flex flex-col gap-2 p-4">
        {links.slice(0, 2).map((link) => (
          <NavLink
            to={link.link}
            className={clsx(
              "flex flex-row gap-4 items-center cursor-pointer transition-all delay-0 duration-300 p-4 rounded-xl",
              currentTab == link.link
                ? "bg-neutral text-white"
                : "hover:bg-base-200",
              isOpen ? "justify-start" : "justify-center"
            )}
          >
            {link.icon}
            <h1 className={clsx(isOpen ? "block" : "hidden")}>{link.title}</h1>
          </NavLink>
        ))}
      </div>
      {/* desktop sidebar */}

      <ChevronLeft
        size={36}
        className={clsx(
          "hidden lg:block",
          "p-2 rounded-full absolute -right-4 top-8 shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow",
          isOpen ? "rotate-180" : "rotate-0"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {window.screen.width > 480 && (
        <>
          <ThemeBox />
          <div className="tooltip absolute -right-4 top-34" data-tip="Settings">
            <Settings
              size={36}
              className={clsx(
                "hidden lg:block",
                "p-2 rounded-full shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow",
                isOpen ? "rotate-180" : "rotate-0"
              )}
              onClick={() =>
                navigate("/admin/settings", { viewTransition: true })
              }
            />
          </div>
          <div className="tooltip absolute -right-4 top-46" data-tip="Log-out">
            <LogOut
              size={36}
              className={clsx(
                "hidden lg:block",
                "p-2 rounded-full shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow",
                isOpen ? "rotate-180" : "rotate-0"
              )}
              onClick={async () => {
                try {
                  localStorage.removeItem("QUICKEASE_CURRENT_QUIZ");
                  localStorage.removeItem("QUICKEASE_GENERATED_CONTENT");
                  localStorage.removeItem("QUICKEASE_USER");

                  await _API_INSTANCE.post(
                    "/auth/logout",
                    {},
                    { withCredentials: true }
                  );
                  navigate("/", { viewTransition: true });
                } catch (err) {
                  toast.error("Logout error.");
                  throw err;
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
