import useTheme from "@/hooks/useTheme";
import clsx from "clsx";

import {
  BookUser,
  ChevronLeft,
  FileQuestion,
  GalleryVertical,
  Menu,
  MessageCircle,
  NotebookTabs,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

export default function Sidebar({ tab }: { tab: string }) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);

  const links = [
    {
      title: "Forum",
      icon: <MessageCircle />,
      link: "/learner",
    },
    {
      title: "Library",
      icon: <BookUser />,
      link: "/learner/library",
    },
    {
      title: "Summarize Notes",
      icon: <NotebookTabs />,
      link: "/learner/summarize",
    },
    {
      title: "Flashcards",
      icon: <GalleryVertical />,
      link: "/learner/flashcards",
    },
    {
      title: "Quiz",
      icon: <FileQuestion />,
      link: "/learner/quiz",
    },
    {
      title: "Pomodoro",
      icon: <Timer />,
      link: "/learner/timer",
    },
  ];

  useEffect(() => {
    setCurrentTab(tab);
  }, [tab]);

  return (
    <div
      className={clsx(
        "w-full p-3",
        "relative bg-base-100 border-r border-base-200 transition-all delay-0 duration-300 ease-in-out lg:px-4 lg:py-8 ",
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
            <div className="divider">
              <h1 className="">Quick Study Tools</h1>
            </div>
            <div className="flex flex-col gap-2">
              {links.slice(2, 6).map((link) => (
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
        <div className="divider">
          <h1 className={clsx("text-gray-400", isOpen ? "block" : "hidden")}>
            Quick Study Tools
          </h1>
        </div>
        {links.slice(2, 6).map((link) => (
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
          "p-2 rounded-full absolute -right-4 top-8 shrink-0 border border-base-200 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow",
          isOpen ? "rotate-180" : "rotate-0"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <label
        className={clsx(
          "swap swap-rotate",
          "hidden lg:grid",
          "p-2 rounded-full absolute -right-4 top-20 shrink-0 border border-base-200 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow"
        )}
      >
        <input
          type="checkbox"
          className="theme-controller"
          value={theme == "dim" ? "light" : "dim"}
          onChange={(e) => {
            if (theme == "dim") {
              setTheme("light");
            } else {
              setTheme(e.target.value);
            }
          }}
        />

        {/* sun icon */}
        <svg
          className="swap-off h-5 w-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>

        <svg
          className="swap-on h-5 w-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
    </div>
  );
}
