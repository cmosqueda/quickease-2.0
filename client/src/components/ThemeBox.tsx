import useTheme from "@/hooks/useTheme";
import clsx from "clsx";

import { Paintbrush } from "lucide-react";
import { darkThemes, lightThemes } from "@/types/themes";

export default function ThemeBox({ floating = true }: { floating?: boolean }) {
  const { setTheme } = useTheme();

  if (floating) {
    return (
      <div className="tooltip absolute -right-4 top-21" data-tip="Themes">
        <details
          className={clsx(
            "dropdown dropdown-right",
            "hidden lg:grid",
            "p-1.5 rounded-full shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow"
          )}
        >
          <summary className="list-none">
            <Paintbrush size={24} />
          </summary>
          <ul className="border border-base-300 flex flex-col p-4 gap-8 dropdown-content bg-base-100 rounded-box z-1 w-[52rem] shadow-sm">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-xl">Dark themes</h1>
              <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {darkThemes.map((theme) => (
                  <div
                    key={theme}
                    className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent"
                    data-act-classname="outline-base-content!"
                    data-set-theme={theme}
                    onClick={() => setTheme(theme)}
                  >
                    <div
                      className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                      data-theme={theme}
                    >
                      <div className="grid grid-cols-5 grid-rows-3">
                        <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                        <div className="bg-base-300 col-start-1 row-start-3"></div>
                        <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                          <div className="font-bold">{theme}</div>
                          <div className="flex flex-wrap gap-1">
                            <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                              <div className="text-primary-content text-sm font-bold">
                                A
                              </div>
                            </div>
                            <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                              <div className="text-secondary-content text-sm font-bold">
                                A
                              </div>
                            </div>
                            <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                              <div className="text-accent-content text-sm font-bold">
                                A
                              </div>
                            </div>
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
                    key={theme}
                    className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent"
                    data-act-classname="outline-base-content!"
                    data-set-theme={theme}
                    onClick={() => setTheme(theme)}
                  >
                    <div
                      className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                      data-theme={theme}
                    >
                      <div className="grid grid-cols-5 grid-rows-3">
                        <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                        <div className="bg-base-300 col-start-1 row-start-3"></div>
                        <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                          <div className="font-bold">{theme}</div>
                          <div className="flex flex-wrap gap-1">
                            <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                              <div className="text-primary-content text-sm font-bold">
                                A
                              </div>
                            </div>
                            <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                              <div className="text-secondary-content text-sm font-bold">
                                A
                              </div>
                            </div>
                            <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                              <div className="text-accent-content text-sm font-bold">
                                A
                              </div>
                            </div>
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

  return (
    <div className="my-2 flex flex-col gap-2">
      <h1>Light themes</h1>
      <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {lightThemes.map((theme) => (
          <div
            className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent"
            data-act-classname="outline-base-content!"
            data-set-theme={theme}
            onClick={() => setTheme(theme)}
          >
            <div
              className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
              data-theme={theme}
            >
              <div className="grid grid-cols-5 grid-rows-3">
                <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                <div className="bg-base-300 col-start-1 row-start-3"></div>
                <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                  <div className="font-bold">{theme}</div>
                  <div className="flex flex-wrap gap-1">
                    <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-primary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-secondary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-accent-content text-sm font-bold">
                        A
                      </div>
                    </div>
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
      <h1>Dark themes</h1>
      <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {darkThemes.map((theme) => (
          <div
            className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent"
            data-act-classname="outline-base-content!"
            data-set-theme={theme}
            onClick={() => setTheme(theme)}
          >
            <div
              className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
              data-theme={theme}
            >
              <div className="grid grid-cols-5 grid-rows-3">
                <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                <div className="bg-base-300 col-start-1 row-start-3"></div>
                <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                  <div className="font-bold">{theme}</div>
                  <div className="flex flex-wrap gap-1">
                    <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-primary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-secondary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-accent-content text-sm font-bold">
                        A
                      </div>
                    </div>
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
}
