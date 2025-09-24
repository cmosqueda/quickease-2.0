/* eslint-disable @typescript-eslint/no-explicit-any */
import TermsAndPrivacyPolicyModal from "@/components/TermsAndPrivacyPolicyModal";
import _API_INSTANCE from "@/utils/axios";

import { LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function AuthVerifyEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await _API_INSTANCE.put("auth/verify-email", {
        email: params.get("email")?.toString(),
        token: params.get("token")?.toString(),
      });

      localStorage.removeItem("QUICKEASE_CURRENT_QUIZ");
      localStorage.removeItem("QUICKEASE_GENERATED_CONTENT");
      localStorage.removeItem("QUICKEASE_USER");

      await _API_INSTANCE.post("/auth/logout", {}, { withCredentials: true });
      toast.success("Email verified. You'll be navigated to login page.");
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    }
  };

  useEffect(() => {
    if (!params.get("token") && !params.get("email")) {
      navigate("/");
    }
  }, [params]);

  return (
    <main className="lg:grid lg:grid-cols-[1fr_1fr] flex flex-col items-center gap-8 min-h-screen">
      <div className="hidden lg:flex flex-col h-screen items-center justify-center bg-base-100 border-r border-base-200">
        <h1 className="font-bold text-[7rem]">QuickEase</h1>
      </div>
      <h1 className="font-bold text-3xl my-8 block lg:hidden">QuickEase</h1>
      {!isUpdating && (
        <div className="relative flex flex-col justify-center gap-6 p-8 2xl:px-[12rem]">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-5xl">Start your journey now!</h1>
            <p className="text-lg text-neutral/50">
              By verifying, you'll finally start the real journey towards a
              better study experience.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="floating-label">
              <span>Email</span>
              <input
                disabled={true}
                type="text"
                placeholder="Email"
                className="input input-lg w-full"
                value={params.get("email") as any}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    handleUpdate();
                  }
                }}
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
            className="transition-all delay-0 duration-300 hover:text-accent fixed bottom-8 cursor-pointer self-center"
            onClick={() => {
              const modal = document.getElementById(
                "terms-of-use-modal"
              ) as HTMLDialogElement;

              modal.showModal();
            }}
          >
            Terms of use & Privacy policy
          </button>
          <TermsAndPrivacyPolicyModal />
        </div>
      )}
      {isUpdating && (
        <div className="flex flex-col flex-1 gap-4 items-center justify-center">
          <LoaderPinwheel size={96} className="animate-spin" />
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-4xl font-black">Verifying...</h1>
            <p className="text-neutral/40">
              You'll be redirected to the login page after verifying...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
