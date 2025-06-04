import clsx from "clsx";
import useTheme from "@/hooks/useTheme";

import { useState } from "react";
import { Eye, Lock, Mail, UserCircle } from "lucide-react";

const AppearanceSettings = () => {
  const { setTheme, theme } = useTheme();

  const [isDark, setIsDark] = useState(false);
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl">Themes</h1>
        <label className="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
            className="toggle"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
      </div>
      <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {isDark &&
          darkThemes.map((theme) => (
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
        {!isDark &&
          lightThemes.map((theme) => (
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
  );
};

const AccountSettings = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl">General</h1>
      <div className="divider my-1" />
      <div className="flex flex-row gap-4 p-8 rounded-3xl hover:bg-neutral bg-neutral/40 cursor-pointer delay-0 duration-300 transition-all">
        <Mail />
        <p>Change email address</p>
      </div>
      <div className="flex flex-row gap-4 p-8 rounded-3xl hover:bg-neutral bg-neutral/40 cursor-pointer delay-0 duration-300 transition-all">
        <UserCircle />
        <p>Change name</p>
      </div>
      <div className="flex flex-row gap-4 p-8 rounded-3xl hover:bg-neutral bg-neutral/40 cursor-pointer delay-0 duration-300 transition-all">
        <Lock />
        <p>Request to change password</p>
      </div>
      <h1 className="text-xl mt-4">Privacy</h1>
      <div className="divider my-1" />
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-neutral/40 cursor-pointer delay-0 duration-300 transition-all items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Eye />
          <div>
            <h1>Public profile</h1>
            <p className="text-sm text-base-content/30">
              Allow others to see your profile.
            </p>
          </div>
        </div>
        <input type="checkbox" defaultChecked className="toggle" />
      </div>
    </div>
  );
};

export default function LearnerSettingsPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [<AppearanceSettings />, <AccountSettings />];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div>
        <h1 className="font-bold text-3xl lg:text-4xl">Settings</h1>
        <p className="text-base-content/50">
          Manage your account preferences & settings
        </p>
      </div>
      <div className="divider my-0 lg:block hidden" />
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx("tab", tabIndex == 0 ? "tab-active" : null)}
          onClick={() => setTabIndex(0)}
        >
          Appearance
        </a>
        <a
          role="tab"
          className={clsx("tab", tabIndex == 1 ? "tab-active" : null)}
          onClick={() => setTabIndex(1)}
        >
          Account
        </a>
      </div>
      {tabs[tabIndex]}
    </div>
  );
}
