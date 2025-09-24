/* eslint-disable @typescript-eslint/no-explicit-any */
import TermsAndPrivacyPolicyModal from "@/components/TermsAndPrivacyPolicyModal";
import _API_INSTANCE from "@/utils/axios";

import { LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function AuthChangePasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!email || !token) {
      toast.error("Invalid reset link.");
      navigate("/");
      return;
    }

    if (!password || !verifyPassword) {
      toast.error("Please fill out both password fields.");
      return;
    }

    if (password !== verifyPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsUpdating(true);

    try {
      await _API_INSTANCE.put("auth/update-password", {
        email,
        token,
        new_password: password,
      });

      toast.success("Password updated. Redirecting to login page...");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Error updating password.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!email || !token) {
      navigate("/");
    }
  }, [email, token, navigate]);

  return (
    <main className="lg:grid lg:grid-cols-[1fr_1fr] flex flex-col items-center gap-8 min-h-screen">
      <div className="hidden lg:flex flex-col h-screen items-center justify-center bg-base-100 border-r border-base-200">
        <h1 className="font-bold text-[7rem]">QuickEase</h1>
      </div>
      <h1 className="font-bold text-3xl my-8 block lg:hidden">QuickEase</h1>

      {!isUpdating ? (
        <div className="relative flex flex-col justify-center gap-6 p-8 2xl:px-[12rem]">
          <h1 className="font-bold text-5xl">Change your password</h1>
          <div className="flex flex-col gap-4 w-full">
            <label className="floating-label">
              <span>Email</span>
              <input
                disabled
                type="text"
                placeholder="Email"
                className="input input-lg w-full"
                value={email}
              />
            </label>
            <label className="floating-label">
              <span>New password</span>
              <input
                type="password"
                placeholder="Password"
                className="input input-lg w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              />
            </label>
            <label className="floating-label">
              <span>Re-enter password</span>
              <input
                type="password"
                placeholder="Re-enter password"
                className="input input-lg w-full"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              />
            </label>
          </div>
          <button
            className="btn btn-neutral w-full btn-lg"
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            Verify
          </button>
          <button
            className="transition-all duration-300 hover:text-accent lg:fixed lg:bottom-8 cursor-pointer self-center"
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
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-4 items-center justify-center">
          <LoaderPinwheel size={96} className="animate-spin" />
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-4xl font-black">Changing password...</h1>
            <p className="text-neutral/40">
              You'll be redirected to the login page after updating your
              password...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
