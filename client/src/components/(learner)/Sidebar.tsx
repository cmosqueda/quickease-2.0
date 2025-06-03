import clsx from "clsx";

import { BookUser, ChevronLeft, MessageCircle, Settings } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ tab }: { tab: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);

  const links = [
    {
      title: "Forum",
      icon: <MessageCircle />,
    },
    {
      title: "Library",
      icon: <BookUser />,
    },
    {
      title: "Settings",
      icon: <Settings />,
    },
  ];

  return (
    <div
      className={clsx(
        "relative bg-white border-r border-gray-200 transition-all delay-0 duration-300 ease-in-out px-4 py-8",
        isOpen ? "w-[16rem] " : "w-[8rem]"
      )}
    >
      {isOpen ? (
        <h1
          className={clsx(
            "font-bold text-center transition-all delay-0 duration-100",
            isOpen ? "text-3xl block" : "hidden"
          )}
        >
          QuickEase
        </h1>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/assets/images/icon.png"
            className="w-[52px] h-[52px] aspect-square"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 p-4">
        {links.map((link) => (
          <button
            className={clsx(
              "flex flex-row gap-4 items-center cursor-pointer transition-all delay-0 duration-300 p-4 rounded-xl",
              currentTab == link.title
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200",
              isOpen ? "justify-start" : "justify-center"
            )}
          >
            {link.icon}
            <h1 className={clsx(isOpen ? "block" : "hidden")}>{link.title}</h1>
          </button>
        ))}
      </div>

      <ChevronLeft
        size={36}
        className={clsx(
          "p-2 rounded-full absolute -right-4 top-8 shrink-0 border border-gray-200 bg-white transition-all delay-0 duration-300 cursor-pointer hover:shadow",
          isOpen ? "rotate-180" : "rotate-0"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      />
    </div>
  );
}
