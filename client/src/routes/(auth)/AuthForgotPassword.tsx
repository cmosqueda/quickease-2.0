/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";
import TermsAndPrivacyPolicyModal from "@/components/TermsAndPrivacyPolicyModal";

import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { LoaderPinwheel } from "lucide-react";

export default function AuthForgotPasswordPage() {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [email, setEmail] = useState("");

  const validateEmail = (value: string) => {
    // basic email regex, not bulletproof but good enough for client-side
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleUpdate = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsUpdating(true);

    try {
      await _API_INSTANCE.post("mail/forgot-password", { email });

      toast.success("Check your email. Redirecting to login page...");
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Error requesting to change password.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="lg:grid lg:grid-cols-[1fr_1fr] flex flex-col items-center gap-8 min-h-screen">
      <div className="hidden lg:flex flex-col h-screen items-center justify-center bg-base-100 border-r border-base-200">
        <h1 className="font-bold text-[7rem]">QuickEase</h1>
      </div>
      <h1 className="font-bold text-3xl my-8 block lg:hidden">QuickEase</h1>
      <div className="relative flex flex-col justify-center gap-6 p-8 2xl:px-[12rem]">
        {!isUpdating ? (
          <>
            <div className="flex flex-col gap-4">
              <h1 className="font-bold text-5xl">
                Oh no, you forgot your password?
              </h1>
              <p className="text-lg text-gray-400">
                Continue your journey, request to reset your password!
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="floating-label">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-lg w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdate();
                    }
                  }}
                  disabled={isUpdating}
                />
              </label>
            </div>
            <button
              className="btn btn-neutral w-full btn-lg"
              disabled={isUpdating}
              onClick={handleUpdate}
            >
              {isUpdating ? "Requesting..." : "Request"}
            </button>
            <button
              className="transition-all duration-300 hover:text-accent fixed bottom-8 cursor-pointer self-center"
              aria-haspopup="dialog"
              aria-controls="terms-of-use-modal"
              onClick={() =>
                (
                  document.getElementById(
                    "terms-of-use-modal"
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              Terms of use & Privacy policy
            </button>
            <TermsAndPrivacyPolicyModal />
          </>
        ) : (
          <div className="flex flex-col flex-1 gap-4 items-center justify-center">
            <LoaderPinwheel size={96} className="animate-spin" />
            <div className="text-center flex flex-col gap-2">
              <h1 className="text-4xl font-black">Requesting...</h1>
              <p className="text-neutral/40">
                Please check your email. You'll be redirected to the login page
                in a few seconds...
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
