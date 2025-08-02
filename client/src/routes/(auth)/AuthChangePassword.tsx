import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function AuthChangePasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await _API_INSTANCE.put("auth/update-password", {
        email: params.get("email")?.toString(),
        token: params.get("token")?.toString(),
        new_password: verifyPassword,
      });

      toast.success("Password updated. You'll be navigated to login page.");
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (err) {
      console.log(err);
      toast.error("Error updating password.");
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
          <h1 className="text-2xl font-black">Change password</h1>
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
          <div>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input w-full"
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Confirm Password</legend>
              <input
                type="password"
                className="input w-full"
                placeholder="***********"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <button
            className="btn btn-success"
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            {isUpdating ? "Updating" : "Update"}
          </button>
        </div>
      </div>
    </main>
  );
}
