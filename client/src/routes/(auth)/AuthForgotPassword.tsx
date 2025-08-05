import _API_INSTANCE from "@/utils/axios";

import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AuthForgotPasswordPage() {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [email, setEmail] = useState("");

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await _API_INSTANCE.post("mail/forgot-password", {
        email,
      });

      toast.success("Check your email. You'll be navigated to login page.");
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (err) {
      console.log(err);
      toast.error("Error requesting to change password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="flex flex-col max-w-xl justify-center mx-auto py-8 h-screen">
      <div className="flex flex-col gap-4">
        <ArrowLeft onClick={() => navigate("/")} className="cursor-pointer" />
        <h1 className="font-bold text-2xl">QuickEase</h1>
        <div className="p-4 rounded-lg bg-base-200 flex flex-col gap-4">
          <h1 className="text-2xl font-black">Request to change password</h1>
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </fieldset>
            </div>
          </div>
          <button
            className="btn btn-success"
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            {isUpdating ? "Requesting..." : "Request"}
          </button>
        </div>
      </div>
    </main>
  );
}
