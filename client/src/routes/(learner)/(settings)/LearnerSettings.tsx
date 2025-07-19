import clsx from "clsx";
import ThemeBox from "@/components/ThemeBox";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";

import { useEffect, useState } from "react";
import { Eye, Lock, Mail, UserCircle } from "lucide-react";
import { toast } from "sonner";

const AppearanceSettings = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl">Themes</h1>
      <div className="my-2 flex flex-col gap-2">
        <ThemeBox floating={false} />
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const { user, setUser } = useAuth();

  const [visibility, setVisibility] = useState(false);

  const handleProfileVisibility = async () => {
    const newVisibility = !visibility;
    setVisibility(newVisibility);

    try {
      const { data } = await _API_INSTANCE.put("/users/toggle-visibility", {
        visibility: newVisibility,
      });

      setUser(data.user);
      toast.success("Profile privacy updated!");
      return;
    } catch (err) {
      setVisibility((prev) => !prev);
      console.error(err);
      toast.error("Error updating profile privacy.");
    }
  };

  useEffect(() => {
    if (user) setVisibility(user.is_public);
  }, [user]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl">General</h1>
      <div className="divider my-1" />
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all">
        <Mail />
        <p>Change email address</p>
      </div>
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all">
        <UserCircle />
        <p>Change name</p>
      </div>
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all">
        <Lock />
        <p>Request to change password</p>
      </div>
      <h1 className="text-xl mt-4">Privacy</h1>
      <div className="divider my-1" />
      <div className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Eye />
          <div>
            <h1>Public profile</h1>
            <p className="text-sm text-base-content/30">
              Allow others to see your profile.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          className="toggle"
          checked={visibility}
          onChange={handleProfileVisibility}
        />
      </div>
    </div>
  );
};

export default function LearnerSettingsPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [<AppearanceSettings />, <AccountSettings />];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div>
        <h1 className="font-bold text-3xl lg:text-4xl">Settings</h1>
        <p className="text-base-content/50">
          Manage your account preferences & settings
        </p>
      </div>
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx("tab", tabIndex == 0 ? "tab-active" : null)}
          onClick={() => setTabIndex(0)}
        >
          Appearance
        </a>
        <a
          role="tab"
          className={clsx("tab", tabIndex == 1 ? "tab-active" : null)}
          onClick={() => setTabIndex(1)}
        >
          Account
        </a>
      </div>
      {tabs[tabIndex]}
    </div>
  );
}
