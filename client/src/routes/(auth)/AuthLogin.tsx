import TermsAndPrivacyPolicyModal from "../../components/TermsAndPrivacyPolicyModal";
import _API_INSTANCE from "@/utils/axios";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";

export default function AuthLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      const { data, status } = await _API_INSTANCE.post(
        "auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (status == 200 && data.is_admin == false) {
        navigate("/learner", { viewTransition: true });
      }

      if (status == 200 && data.is_admin == true) {
        navigate("/admin", { viewTransition: true });
      }
    } catch (err) {
      toast.error(err.response.data.message);
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

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
        <button
          className="btn btn-soft btn-success w-full btn-lg"
          disabled={isRegistering}
          onClick={handleLogin}
        >
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
    </main>
  );
}
