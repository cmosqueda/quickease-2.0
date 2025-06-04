import useTheme from "@/hooks/useTheme";
import clsx from "clsx";
import {
  BookCheck,
  Menu,
  NotebookPen,
  Paintbrush,
  SquareStack,
} from "lucide-react";
import { NavLink } from "react-router";

export default function LandingPage() {
  const { setTheme, theme } = useTheme();

  const cardContents = [
    {
      icon: (
        <NotebookPen
          size={36}
          className="p-1 shrink-0 rounded-lg bg-base-100"
        />
      ),
      title: "Summarize with AI",
      description: "Quickly turn long contents into key points.",
    },
    {
      icon: (
        <SquareStack
          size={36}
          className="p-1 shrink-0 rounded-lg bg-base-100"
        />
      ),
      title: "Review with AI flashcards",
      description: "Reinforce key concepts for better learning.",
    },
    {
      icon: (
        <BookCheck size={36} className="p-1 shrink-0 rounded-lg bg-base-100" />
      ),
      title: "Test with AI quizzes",
      description: "Challenge your knowledge with tailored questions.",
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

  return (
    <>
      <header className="flex flex-row xl:max-w-7xl justify-between py-4 xl:px-0 px-4 xl:mx-auto bg-base-100 items-center ">
        <h1 className="font-bold text-2xl">QuickEase</h1>
        <div className="hidden flex-row gap-4 items-center lg:flex">
          <NavLink to="/auth/login" viewTransition>
            <h1>Sign In</h1>
          </NavLink>
          <NavLink to="/auth/register" viewTransition>
            <button className="btn btn-soft">Join now</button>
          </NavLink>
          <details
            className={clsx(
              "dropdown dropdown-end",
              "hidden lg:grid",
              "rounded-full p-1.5 shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow"
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
        <details className="dropdown lg:hidden dropdown-end">
          <summary className="btn m-1">
            <Menu />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NavLink to="/auth/login" viewTransition>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/register" viewTransition>
                Register
              </NavLink>
            </li>
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
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
                className="swap-off h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
              <svg
                className="swap-on h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </ul>
        </details>
      </header>
      <main className="min-h-screen bg-base-200 flex flex-col py-4 gap-8 border-t border-base-300 border-b">
        <div className="max-w-7xl mx-auto lg:px-0 px-2">
          <video controls={false} autoPlay muted className="w-full rounded-3xl">
            <source src="assets/videos/landing.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="flex flex-col max-w-7xl mx-auto gap-2 lg:px-0 px-2">
          <h1 className="font-black text-xl lg:text-4xl text-center">
            Supercharge your learning!
          </h1>
          <p className="text-gray-400 text-center">
            Experience the power of AI-driven learning tools designed to enhance
            your study journey.
          </p>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:px-0 px-2">
          {cardContents.map((content) => (
            <div className="flex flex-col gap-2 p-8 bg-base-100 rounded-3xl shadow">
              <div className="flex flex-row gap-2 justify-between">
                {content.icon}
              </div>
              <h1 className="font-bold text-lg">{content.title}</h1>
              <p className="text-gray-400">{content.description}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="flex flex-col max-w-7xl mx-auto p-8 bg-base-100">
        <p>© 2025 QuickEase. All rights reserved.</p>
      </footer>
    </>
  );
}
