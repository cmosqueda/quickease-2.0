import clsx from "clsx";
import useTheme from "@/hooks/useTheme";

import { useState } from "react";
import { Eye, Lock, Mail, UserCircle } from "lucide-react";

const AppearanceSettings = () => {
  const { setTheme } = useTheme();

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
      <h1 className="text-xl">Themes</h1>
      <div className="my-2 flex flex-col gap-2">
        <h1>Dark themes</h1>
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
      <div className="my-2 flex flex-col gap-2">
        <h1>Light themes</h1>
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
    </div>
  );
};

const AccountSettings = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl">General</h1>
      <div className="divider my-1" />
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all">
        <Mail />
        <p>Change email address</p>
      </div>
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all">
        <UserCircle />
        <p>Change name</p>
      </div>
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all">
        <Lock />
        <p>Request to change password</p>
      </div>
      <h1 className="text-xl mt-4">Privacy</h1>
      <div className="divider my-1" />
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all items-center justify-between">
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
