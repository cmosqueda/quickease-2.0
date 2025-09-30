/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import ThemeBox from "../ThemeBox";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { NavLink, useNavigate, type NavigateFunction } from "react-router";
import { toast } from "sonner";

import {
  ChevronLeft,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  UserPen,
  Users,
} from "lucide-react";

type NavLinkItem = {
  title: string;
  icon: React.ReactNode;
  link: string;
};

type ModalLinkItem = {
  title: string;
  icon: React.ReactNode;
  element: string;
};

const _LINKS: Array<NavLinkItem | ModalLinkItem> = [
  { title: "Manage users", icon: <Users />, link: "/admin" },
  {
    title: "Reported posts",
    icon: <UserPen />,
    link: "/admin/reports/posts",
  },
  {
    title: "Reported comments",
    icon: <MessageCircle />,
    link: "/admin/reports/comments",
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
  const { user } = useAuth();

  return (
    <div className="drawer lg:hidden">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label
          htmlFor="mobile-drawer"
          className="drawer-overlay"
          aria-label="close sidebar"
        />
        <ul className="w-[20rem] p-4 flex flex-col gap-8 bg-base-100 h-screen">
          <div className="flex items-center gap-4">
            <img src="/assets/images/icon.png" alt="Logo" className="w-9 h-9" />
            <h1 className="font-bold text-3xl">QuickEase</h1>
          </div>

          {_LINKS.map((link: any) => (
            <NavLink
              key={link.title}
              to={link.link}
              className={clsx(
                "flex gap-4 items-center transition p-4 rounded-xl cursor-pointer",
                currentTab === link.link
                  ? "bg-neutral text-white"
                  : "hover:bg-base-200",
                isOpen ? "justify-start" : "justify-center"
              )}
            >
              {link.icon}
              {isOpen && <span>{link.title}</span>}
            </NavLink>
          ))}

          <div className="flex flex-row gap-4">
            <button
              className="btn btn-soft btn-accent mt-auto flex-1 items-center"
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
            >
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </ul>
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
      {_LINKS.map((link: any) => (
        <NavLink
          key={link.title}
          to={link.link}
          className={clsx(
            "flex gap-4 items-center transition p-4 rounded-xl cursor-pointer",
            currentTab === link.link
              ? "bg-neutral text-white"
              : "hover:bg-base-200",
            isOpen ? "justify-start" : "justify-center"
          )}
        >
          {link.icon}
          {isOpen && <span>{link.title}</span>}
        </NavLink>
      ))}
    </div>
  );
};

const DesktopHeading = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="hidden lg:flex items-center gap-4 justify-center mb-4">
      <img
        src="/assets/images/icon.png"
        alt="Logo"
        className="w-[52px] h-[52px]"
      />
      {isOpen && <h1 className="font-bold text-3xl transition">QuickEase</h1>}
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
  const isClient = typeof window !== "undefined";

  return (
    <>
      <ChevronLeft
        size={36}
        className={clsx(
          "hidden lg:block",
          "p-2 absolute -right-4 top-8 rounded-full border bg-base-100 border-base-300 cursor-pointer hover:shadow transition",
          isOpen && "rotate-180"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isClient && window.innerWidth > 480 && (
        <>
          <ThemeBox />
          <div className="tooltip absolute -right-4 top-36" data-tip="Log-out">
            <LogOut
              size={36}
              className="hidden lg:block p-2 border bg-base-100 border-base-300 rounded-full cursor-pointer hover:shadow"
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
        "w-full p-3 relative bg-base-100 border-r border-base-300 transition-all duration-300 lg:px-4 lg:py-8",
        isOpen ? "lg:w-[18rem]" : "lg:w-[8rem]"
      )}
    >
      <DesktopHeading isOpen={isOpen} />
      {/* Mobile Header */}
      <div className="flex lg:hidden justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/assets/images/icon.png" alt="Logo" className="w-9 h-9" />
          <h1 className="font-bold text-xl">QuickEase</h1>
        </div>
        <label htmlFor="mobile-drawer" className="cursor-pointer">
          <Menu />
        </label>
      </div>

      <Mobile currentTab={currentTab} isOpen={isOpen} navigate={navigate} />
      <Desktop currentTab={currentTab} isOpen={isOpen} />
      <Floating isOpen={isOpen} setIsOpen={setIsOpen} navigate={navigate} />
    </div>
  );
}
