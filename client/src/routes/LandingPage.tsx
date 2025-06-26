import useTheme from "@/hooks/useTheme";
import clsx from "clsx";

import { darkThemes, lightThemes } from "@/types/themes";
import {
  BookCheck,
  Menu,
  NotebookPen,
  Paintbrush,
  SquareStack,
  Users,
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
    {
      icon: <Users size={36} className="p-1 shrink-0 rounded-lg bg-base-100" />,
      title: "Have a question?",
      description: "Ask the community/users!",
    },
  ];

  return (
    <>
      <header className="flex flex-row xl:max-w-7xl justify-between py-4 xl:px-0 px-4 xl:mx-auto bg-base-100 items-center">
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
          </ul>
        </details>
      </header>
      <div className="flex flex-col lg:grid lg:grid-cols-2 py-[8rem] xl:min-h-[85vh] xl:max-w-7xl mx-auto items-center">
        <div className="flex flex-col gap-2">
          <p className="tracking-widest">SUPERCHARGE YOUR LEARNING.</p>
          <h1 className="text-7xl font-black">
            Learning has never been more easier with{" "}
            <span className="text-accent">QuickEase.</span>
          </h1>
          <p className="text-xl my-4 text-base-content/75">
            QuickEase is a study assistant that helps you on your study,
            generate flashcards/quizzes.
          </p>
          <div className="flex flex-row gap-4 items-center">
            <NavLink
              className="btn btn-xl btn-accent"
              to="/auth/register"
              viewTransition
            >
              <p>Join now</p>
            </NavLink>
            <NavLink
              className="btn btn-xl btn-neutral btn-ghost"
              to="/auth/login"
              viewTransition
            >
              <p>Sign in</p>
            </NavLink>
          </div>
        </div>
          <img
            className="w-full lg:block hidden"
            style={{ animation: "floatAnimation 4s ease-in-out infinite" }}
            src="/assets/images/mascot.png"
          />
      </div>
      <div className="flex flex-col gap-4 xl:max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center">Features</h1>
        <div className="grid grid-cols-3 gap-4">
          {cardContents.map((card) => (
            <div className="bg-base-100 p-4 rounded-xl flex flex-col gap-2">
              <div className="flex flex-col">
                {card.icon}
                <h1 className="font-bold text-2xl">{card.title}</h1>
              </div>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 xl:max-w-7xl mx-auto my-12">
        <h1 className="text-5xl font-bold text-center">Downloads</h1>
        <p className="text-center text-xl">
          Choose the correct download for your platform. For details, see the{" "}
          <NavLink to="" className="text-accent">
            installation guide
          </NavLink>
          .
        </p>
        <div className="divider" />
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-bold text-4xl">Mobile</h1>
            <p className="text-xl text-base-content/50">
              QuickEase Mobile is the official Android app.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h1>Scan the QR code below.</h1>
          </div>
        </div>
      </div>
    </>
  );
}
