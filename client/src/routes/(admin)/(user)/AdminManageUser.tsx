/* eslint-disable @typescript-eslint/no-explicit-any */

import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft, Key, MailCheck, Trash } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminManageUserPage() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [firstName, setFirstName] = useState(data.first_name);
  const [lastName, setLastName] = useState(data.last_name);
  const [email, setEmail] = useState(data.email);
  const [isPublic, setIsPublic] = useState(data.is_public);

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await _API_INSTANCE.put(`/admin/auth/users/${data.id}/name`, {
        first_name: firstName,
        last_name: lastName,
      });

      await _API_INSTANCE.put(`/admin/auth/users/${data.id}/email`, {
        email,
      });

      await _API_INSTANCE.put(`/admin/auth/users/${data.id}/visibility`, {
        is_public: isPublic,
      });

      data.first_name = firstName;
      data.last_name = lastName;
      data.email = email;

      toast.success("Updated.");
      setIsEditingUserInfo(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Error updating user's information.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendPasswordResetEmail = async () => {
    try {
      await _API_INSTANCE.post(
        `/admin/mail/user/${data.id}/request-change-password`
      );
      toast.success("Password change email sent.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send password change email.");
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await _API_INSTANCE.post(
        `/admin/mail/user/${data.id}/request-verify-email`
      );
      toast.success("Verification email sent.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send verification email.");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <ArrowLeft
        onClick={() => navigate(-1 as any, { viewTransition: true })}
        className="cursor-pointer"
      />
      <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl">
        <div className="aspect-square items-center">
          <h1 className="font-bold text-4xl p-6 rounded-full bg-base-200 w-fit">
            {data.first_name[0].toUpperCase()}
            {data.last_name[0].toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            {data.first_name} {data.last_name}
          </h1>
          <p className="text-sm text-base-content/35">{data.email}</p>
        </div>
      </div>
      <div className="collapse border-none rounded-3xl collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title font-semibold">Account information</div>
        <div className="flex flex-col gap-2 collapse-content text-sm">
          <div className="grid grid-cols-2 gap-4">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">ID</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="ID"
                disabled
                value={data.id}
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Is Verified</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Is Verified"
                disabled
                value={data.is_verified ? "Yes" : "No"}
              />
            </fieldset>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">First Name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="First Name"
                disabled={!isEditingUserInfo}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Last Name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Last Name"
                disabled={!isEditingUserInfo}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Email"
                disabled={!isEditingUserInfo}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </fieldset>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Profile Visibility</legend>
              <select
                className="select w-full"
                disabled={!isEditingUserInfo}
                value={isPublic ? "public" : "private"}
                onChange={(e) => setIsPublic(e.target.value === "public")}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Created At</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Created At"
                disabled
                value={data.created_at}
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Updated At</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Updated At"
                disabled
                value={data.updated_at}
              />
            </fieldset>
          </div>

          {!isEditingUserInfo && (
            <button
              className="btn btn-neutral"
              onClick={() => setIsEditingUserInfo(true)}
            >
              <h1>Edit</h1>
            </button>
          )}

          {isEditingUserInfo && (
            <div className="flex flex-row gap-2 self-end">
              <button
                className="btn"
                onClick={() => {
                  setFirstName(data.first_name);
                  setLastName(data.last_name);
                  setEmail(data.email);
                  setIsPublic(data.is_public);
                  setIsEditingUserInfo(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="collapse border-none rounded-3xl collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Other options</div>
        <div className="flex flex-col gap-2 collapse-content text-sm">
          <div className="grid grid-cols-3 gap-4">
            <button className="btn" onClick={handleSendPasswordResetEmail}>
              <Key size={16} />
              <h1>Send an email to change password</h1>
            </button>
            <button
              className="btn"
              onClick={handleSendVerificationEmail}
              disabled={data.is_verified}
            >
              <MailCheck size={16} />
              <h1>Send an email to verify user</h1>
            </button>
            <button className="btn">
              <Trash size={16} />
              <h1>Delete account</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
