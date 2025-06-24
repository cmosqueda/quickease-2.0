import TermsAndPrivacyPolicyModal from "../../components/TermsAndPrivacyPolicyModal";
import _API_INSTANCE from "@/utils/axios";
import useTheme from "@/hooks/useTheme";
import clsx from "clsx";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { darkThemes, lightThemes } from "@/types/themes";
import { Paintbrush } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

export default function AuthRegisterPage() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  // forms
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);

  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    isTermsAccepted: z.boolean(),
  });

  const handleRegister = async () => {
    setIsRegistering(true);
    const result = schema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      isTermsAccepted,
    });

    if (!result.success) {
      result.error.errors.map((m) => {
        toast.error(`Error: ${m.message.toString()}`);
      });
      setIsRegistering(false);
      return;
    }

    try {
      const response = await _API_INSTANCE.post(
        "/auth/register",
        {
          firstName,
          lastName,
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status == 200) {
        navigate("/learner", { viewTransition: true });
      }
    } catch (err) {
      toast.error(`Error: ${err}`);
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="lg:grid lg:grid-cols-2 flex flex-col gap-8 bg-base">
      <img
        className="w-full h-full lg:block hidden"
        style={{ animation: "floatAnimation 4s ease-in-out infinite" }}
        src="/assets/images/mascot.png"
      />
      <h1 className="font-bold text-3xl my-8 block lg:hidden text-center">
        QuickEase
      </h1>
      <div className="flex flex-col gap-4 justify-center p-8 2xl:px-[12rem]">
        <div className="">
          <h1 className="font-bold text-4xl">Create your account </h1>
          <p className="text-gray-400">Start your learning journey today.</p>
        </div>
        <div className="lg:grid lg:grid-cols-2 flex flex-col gap-2">
          <label className="floating-label">
            <span>First Name</span>
            <input
              type="text"
              placeholder="First Name"
              className="input input-md w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span>Last Name</span>
            <input
              type="text"
              placeholder="Last Name"
              className="input input-md w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <label className="floating-label">
          <span>Email</span>
          <input
            type="text"
            placeholder="Email"
            className="input input-md w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="floating-label">
          <span>Password</span>
          <input
            type="password"
            placeholder="Password"
            className="input input-md w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="floating-label">
          <span>Confirm Password</span>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-md w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <label className="label">
          <input
            type="checkbox"
            value={isTermsAccepted}
            onChange={() => setIsTermsAccepted((prev) => !prev)}
            className="checkbox"
          />
          I accept the{" "}
          <button
            className="text--500 cursor-pointer"
            onClick={() =>
              document.getElementById("terms-of-use-modal").showModal()
            }
          >
            terms of use and privacy policy
          </button>
        </label>
        <button
          className="btn btn-soft btn-success btn-lg"
          disabled={isRegistering}
          onClick={handleRegister}
        >
          Create account
        </button>
        <p>
          Already have an account?{" "}
          <NavLink className={"text-accent"} to="/auth/login" viewTransition>
            Sign in
          </NavLink>
        </p>
      </div>
      <TermsAndPrivacyPolicyModal />
      <details
        className={clsx(
          "dropdown dropdown-top dropdown-left absolute bottom-24 right-24",
          "hidden lg:grid",
          "rounded-full p-1.5 shrink-0 border border-base-300 bg-base-100 transition-all delay-0 duration-300 cursor-pointer hover:shadow"
        )}
      >
        <summary className="list-none">
          <Paintbrush size={36} />
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
