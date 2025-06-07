import TermsAndPrivacyPolicyModal from "../../components/TermsAndPrivacyPolicyModal";
import useTheme from "@/hooks/useTheme";
import clsx from "clsx";

import { useState } from "react";
import { NavLink } from "react-router";
import { Paintbrush } from "lucide-react";
import { darkThemes, lightThemes } from "@/types/themes";

export default function AuthLoginPage() {
  const { setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="lg:grid lg:grid-cols-[1fr_1fr] flex flex-col items-center gap-8 min-h-screen">
      <div className="hidden lg:flex flex-col h-screen items-center justify-center bg-base-100 border-r border-base-200">
        <h1 className="font-bold text-[7rem]">QuickEase</h1>
      </div>
      <h1 className="font-bold text-3xl my-8 block lg:hidden">QuickEase</h1>
      <div className="relative flex flex-col justify-center gap-6 p-8 2xl:px-[12rem]">
        <div>
          <h1 className="font-bold text-5xl">Welcome back</h1>
          <p className="text-lg text-gray-400">
            Continue your learning journey.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <label className="floating-label">
            <span>Email</span>
            <input
              type="text"
              placeholder="Email"
              className="input input-lg w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span>Password</span>
            <input
              type="password"
              placeholder="********"
              className="input input-lg w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <NavLink
          to="forgot-password"
          className="text-right text-sm text-gray-400"
          viewTransition
        >
          Forgot password?
        </NavLink>
        <button className="btn btn-soft btn-success w-full btn-lg">
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <NavLink
            to="/auth/register"
            viewTransition
            className="text-accent mx-1"
          >
            Register now
          </NavLink>
        </p>
        <button
          className="transition-all delay-0 duration-300 hover:text-accent fixed bottom-8 cursor-pointer"
          onClick={() =>
            document.getElementById("terms-of-use-modal").showModal()
          }
        >
          Terms of use & Privacy policy
        </button>
        <TermsAndPrivacyPolicyModal />
      </div>
      <details
        className={clsx(
          "dropdown dropdown-top dropdown-left absolute bottom-24 right-24",
          "hidden lg:grid",
          "rounded-full p-1.5 shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow"
        )}
      >
        <summary className="list-none">
          <Paintbrush size={36}/>
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
    </main>
  );
}
