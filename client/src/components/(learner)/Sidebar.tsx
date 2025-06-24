import clsx from "clsx";
import ThemeBox from "../ThemeBox";

import {
  BookUser,
  ChevronLeft,
  FileQuestion,
  GalleryVertical,
  LogOut,
  Menu,
  MessageCircle,
  NotebookTabs,
  Settings,
  Timer,
} from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { NavLink, useNavigate, type NavigateFunction } from "react-router";
import _API_INSTANCE from "@/utils/axios";

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
    element: "generate-summary-modal-global",
  },
  {
    title: "Flashcards",
    icon: <GalleryVertical />,
    element: "generate-flashcard-modal-global",
  },
  {
    title: "Quizzes",
    icon: <FileQuestion />,
    element: "generate-quiz-modal-global",
  },
  {
    title: "Pomodoro",
    icon: <Timer />,
    link: "/learner/timer",
  },
];

const Mobile = ({
  currentTab,
  isOpen,
  navigate,
}: {
  currentTab: string;
  isOpen: boolean;
  navigate: NavigateFunction;
}) => {
  return (
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
            {links.slice(2, 5).map((link) => (
              <button
                onClick={() =>
                  document.getElementById(link.element).showModal()
                }
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
              </button>
            ))}
            <NavLink
              to={links[5].link}
              className={clsx(
                "flex flex-row gap-4 items-center cursor-pointer transition-all delay-0 duration-300 p-4 rounded-xl",
                currentTab == links[5].link
                  ? "bg-neutral text-white"
                  : "hover:bg-base-200",
                isOpen ? "justify-start" : "justify-center"
              )}
            >
              {links[5].icon}
              <h1 className={clsx(isOpen ? "block" : "hidden")}>
                {links[5].title}
              </h1>
            </NavLink>
          </div>
        </ul>
        <button
          className="btn btn-soft btn-accent self-end m-4"
          onClick={() => {
            navigate("/");
          }}
        >
          <LogOut />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

const Desktop = ({
  currentTab,
  isOpen,
}: {
  currentTab: string;
  isOpen: boolean;
}) => {
  return (
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
      {links.slice(2, 5).map((link) => (
        <button
          onClick={() => {
            document.getElementById(link.element).showModal();
          }}
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
        </button>
      ))}
      <NavLink
        to={links[5].link}
        className={clsx(
          "flex flex-row gap-4 items-center cursor-pointer transition-all delay-0 duration-300 p-4 rounded-xl",
          currentTab == links[5].link
            ? "bg-neutral text-white"
            : "hover:bg-base-200",
          isOpen ? "justify-start" : "justify-center"
        )}
      >
        {links[5].icon}
        <h1 className={clsx(isOpen ? "block" : "hidden")}>{links[5].title}</h1>
      </NavLink>
    </div>
  );
};

const DesktopHeading = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center">
        <img
          src="/assets/images/icon.png"
          className="w-[52px] h-[52px] aspect-square"
        />
      </div>
    );
  }

  return (
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
  );
};

const Floating = ({
  isOpen,
  setIsOpen,
  navigate,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  navigate: NavigateFunction;
}) => {
  return (
    <>
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
              onClick={() => navigate("/learner/settings")}
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
                await _API_INSTANCE.post("/auth/logout");
                navigate("/");
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default function Sidebar({ tab }: { tab: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);
  const navigate = useNavigate();

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
      <DesktopHeading isOpen={isOpen} />
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
      <Mobile currentTab={currentTab} isOpen={isOpen} navigate={navigate} />
      <Desktop currentTab={currentTab} isOpen={isOpen} />
      <Floating isOpen={isOpen} navigate={navigate} setIsOpen={setIsOpen} />
    </div>
  );
}
