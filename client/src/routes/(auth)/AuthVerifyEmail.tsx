import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft } from "lucide-react";
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
      toast.error("Error verifying email.");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!params.get("token") && !params.get("email")) {
      navigate("/");
    }
  }, [params]);

  return (
    <main className="flex flex-col max-w-xl justify-center mx-auto py-8 h-screen">
      <div className="flex flex-col gap-4">
        <ArrowLeft onClick={() => navigate("/")} className="cursor-pointer" />
        <h1 className="font-bold text-2xl">QuickEase</h1>
        <div className="p-4 rounded-lg bg-base-200 flex flex-col gap-4">
          <h1 className="text-2xl font-black">Verify email</h1>
          <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              Account information
            </div>
            <div className="collapse-content text-sm">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Email</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Email"
                  disabled
                  value={params.get("email")?.toString()}
                />
              </fieldset>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Token</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Token"
                  disabled
                  value={params.get("token")?.toString()}
                />
              </fieldset>
            </div>
          </div>
          <button
            className="btn btn-success"
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            {isUpdating ? "Verifying" : "Verify"}
          </button>
        </div>
      </div>
    </main>
  );
}
