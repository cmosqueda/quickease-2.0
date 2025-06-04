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
  Paintbrush,
  PaintBucket,
  PaintRoller,
  PaintRollerIcon,
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
  const lightThemes = ["light", "cupcake", "bumblebee", "emerald", "valentine"];
  const darkThemes = [
    "dark",
    "halloween",
    "forest",
    "luxury",
    "dracula",
    "business",
    "dim",
    "sunset",
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
          "p-2 rounded-full absolute -right-4 top-8 shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow",
          isOpen ? "rotate-180" : "rotate-0"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <details
        className={clsx(
          "dropdown dropdown-right",
          "hidden lg:grid",
          "p-1.5 rounded-full absolute -right-4 top-20 shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow"
        )}
      >
        <summary className="list-none">
          <Paintbrush />
        </summary>
        <ul className="border border-base-300 flex flex-col p-4 gap-8 dropdown-content bg-base-100 rounded-box z-1 w-[52rem] shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-xl">Dark themes</h1>
            <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {darkThemes.map((theme) => (
                <div
                  className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent"
                  data-act-className="outline-base-content!"
                  data-set-theme={theme}
                  onClick={() => setTheme(theme)}
                >
                  <div
                    className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                    data-theme={theme}
                  >
                    <div className="grid grid-cols-5 grid-rows-3">
                      <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>{" "}
                      <div className="bg-base-300 col-start-1 row-start-3"></div>{" "}
                      <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                        <div className="font-bold">{theme}</div>{" "}
                        <div className="flex flex-wrap gap-1">
                          <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-primary-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-secondary-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-accent-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-neutral-content text-sm font-bold">
                              A
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-xl">Light themes</h1>
            <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {lightThemes.map((theme) => (
                <div
                  className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent"
                  data-act-className="outline-base-content!"
                  data-set-theme={theme}
                  onClick={() => setTheme(theme)}
                >
                  <div
                    className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                    data-theme={theme}
                  >
                    <div className="grid grid-cols-5 grid-rows-3">
                      <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>{" "}
                      <div className="bg-base-300 col-start-1 row-start-3"></div>{" "}
                      <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                        <div className="font-bold">{theme}</div>{" "}
                        <div className="flex flex-wrap gap-1">
                          <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-primary-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-secondary-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-accent-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-neutral-content text-sm font-bold">
                              A
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ul>
      </details>
    </div>
  );
}
