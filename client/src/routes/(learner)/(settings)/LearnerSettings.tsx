import clsx from "clsx";
import ThemeBox from "@/components/ThemeBox";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { useEffect, useState } from "react";
import { Eye, Info, Lock, Mail, UserCircle, X } from "lucide-react";
import { toast } from "sonner";

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

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
      <button
        onClick={() =>
          document.getElementById("change-email-modal").showModal()
        }
        className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all"
      >
        <Mail />
        <p>Change email address</p>
      </button>
      <button
        onClick={() => document.getElementById("change-name-modal").showModal()}
        className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all"
      >
        <UserCircle />
        <p>Change name</p>
      </button>
      <button className="flex flex-row gap-4 p-8 rounded-3xl bg-base-100 hover:bg-base-300 cursor-pointer delay-0 duration-300 transition-all">
        <Lock />
        <p>Request to change password</p>
      </button>
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

const ChangeNameModal = () => {
  const [firstName, setFirstName] = useState(
    useAuth.getState().user?.first_name
  );
  const [lastName, setLastName] = useState(useAuth.getState().user?.last_name);
  const [isSaving, setIsSaving] = useState(false);
  const [canChangeName, setCanChangeName] = useState(true);

  const handleUpdate = async () => {
    setIsSaving(true);
    const temp = useAuth.getState().user;

    try {
      const { data } = await _API_INSTANCE.put("/users/edit-name", {
        firstName,
        lastName,
      });

      useAuth.setState({
        user: {
          ...temp,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
        },
      });

      localStorage.setItem(
        "QUICKEASE_CHANGE_NAME_EXPIRATION",
        new Date().toISOString()
      );
      toast.success("Name updated!");
    } catch (err) {
      toast.error("Error updating name.");
    } finally {
      document.getElementById("change-name-modal").close();
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const lastChange = localStorage.getItem("QUICKEASE_CHANGE_NAME_EXPIRATION");

    if (lastChange) {
      const lastChangeDate = dayjs(lastChange);
      const nextEligibleDate = lastChangeDate.add(7, "days");
      const now = dayjs();

      if (now.isBefore(nextEligibleDate)) {
        setCanChangeName(false);
      }
    }
  }, []);

  return (
    <dialog id="change-name-modal" className="modal">
      <div className="modal-box flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <X
            className="my-2 cursor-pointer"
            onClick={() => document.getElementById("change-name-modal").close()}
          />
          <h3 className="font-bold text-lg">Change name</h3>
        </div>
        <p className="rounded-3xl text-xs text-base-content/50">
          Note: You can only change your name every week!
        </p>
        <div className="grid grid-cols-2 gap-4 my-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">First Name</legend>
            <input
              type="text"
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Type here"
              disabled={!canChangeName}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Last Name</legend>
            <input
              type="text"
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Type here"
              disabled={!canChangeName}
            />
          </fieldset>
        </div>
        {canChangeName && (
          <button className="btn" onClick={handleUpdate} disabled={isSaving}>
            Update
          </button>
        )}
        {!canChangeName && (
          <>
            <button
              className="btn"
              onClick={() =>
                document.getElementById("change-name-modal").close()
              }
              disabled={isSaving}
            >
              Close
            </button>
            <p className="text-sm p-4 flex flex-row items-center gap-2 bg-warning mt-2 rounded-3xl text-warning-content">
              <Info />
              You can't change your name.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
};

const ChangeEmailModal = () => {
  const [email, setEmail] = useState(useAuth.getState().user?.email);
  const [isSaving, setIsSaving] = useState(false);
  const [canChangeEmail, setCanChangeEmail] = useState(true);

  const handleUpdate = async () => {
    setIsSaving(true);
    const temp = useAuth.getState().user;

    try {
      const { data } = await _API_INSTANCE.put("/users/edit-email", {
        email,
      });

      useAuth.setState({
        user: {
          ...temp,
          email: data.user.email,
        },
      });

      localStorage.setItem(
        "QUICKEASE_CHANGE_EMAIL_EXPIRATION",
        new Date().toISOString()
      );
      toast.success("Email updated!");
    } catch (err) {
      toast.error("Error updating email.");
    } finally {
      document.getElementById("change-email-modal").close();
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const lastChange = localStorage.getItem(
      "QUICKEASE_CHANGE_EMAIL_EXPIRATION"
    );

    if (lastChange) {
      setCanChangeEmail(false);
    }
  }, []);

  return (
    <dialog id="change-email-modal" className="modal">
      <div className="modal-box flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <X
            className="my-2 cursor-pointer"
            onClick={() =>
              document.getElementById("change-email-modal").close()
            }
          />
          <h3 className="font-bold text-lg">Change email</h3>
        </div>
        <p className="rounded-3xl text-xs text-base-content/50">
          Note: You can only change your email once!
        </p>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="text"
            className="input w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type here"
            disabled={!canChangeEmail}
          />
        </fieldset>

        {canChangeEmail && (
          <button className="btn" onClick={handleUpdate} disabled={isSaving}>
            Update
          </button>
        )}
        {!canChangeEmail && (
          <>
            <button
              className="btn"
              onClick={() =>
                document.getElementById("change-name-modal").close()
              }
              disabled={isSaving}
            >
              Close
            </button>
            <p className="text-sm p-4 flex flex-row items-center gap-2 bg-warning mt-2 rounded-3xl text-warning-content">
              <Info />
              You can't change your email.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
};

export default function LearnerSettingsPage() {
  const [tabIndex, setTabIndex] = useState(1);
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
      <ChangeNameModal />
      <ChangeEmailModal />
    </div>
  );
}
