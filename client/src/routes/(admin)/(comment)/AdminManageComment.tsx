/* eslint-disable @typescript-eslint/no-explicit-any */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";

import { EditorProvider } from "@tiptap/react";
import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertTriangle,
  ArrowLeft,
  Delete,
  MessageCircle,
  Trash,
} from "lucide-react";

import UserAvatar from "@/components/(learner)/UserAvatar";

export default function AdminManageCommentPage() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteComment = async () => {
    setIsDeleting(true);

    try {
      await _API_INSTANCE.delete(
        `admin/forum/comment/delete/${data.comment.id}`,
        {
          data: {
            user_id: data.comment.user.id,
          },
        }
      );

      toast.success("Post deleted.");
      navigate(-1 as any, { viewTransition: true });
    } catch (err) {
      console.log(err);
      toast.error("Error deleting post, try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await _API_INSTANCE.delete(
        `admin/auth/users/${data.post.user.id}/delete`
      );

      toast.success("Account deleted.");
      navigate(-1 as any, { viewTransition: true });
    } catch {
      toast.error("Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <ArrowLeft
        onClick={() => navigate("/admin/", { viewTransition: true })}
        className="cursor-pointer"
      />

      <UserAvatar isAdmin={true} data={data.comment} />
      {data.comment.comment_body && (
        <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
          <EditorProvider
            content={data.comment.comment_body || ""}
            extensions={_TIPTAP_EXTENSIONS}
            editable={false}
          />
        </div>
      )}

      <div className="collapse collapse-arrow bg-base-100 rounded-box shadow border border-base-300">
        <input type="checkbox" />
        <div className="collapse-title font-medium">
          {data.reports.length > 1 ? "Reports" : "Report"} (
          {data.reports.length})
        </div>
        <div className="collapse-content flex flex-col gap-4">
          {data.reports.map((report: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-base-100 border border-base-300 shadow"
            >
              <div className="flex flex-row gap-2 items-center mb-2">
                <MessageCircle size={16} />
                <p className="font-semibold">
                  {report.reported_by?.first_name}{" "}
                  {report.reported_by?.last_name}
                </p>
              </div>
              <p>{report.description ?? "No reason provided."}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="collapse border-none rounded-3xl collapse-arrow bg-base-100 border-base-300 border shadow">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Other options</div>
        <div className="flex flex-col gap-2 collapse-content text-sm">
          <div className="grid grid-cols-2 gap-4">
            <button
              className="btn"
              disabled={isDeleting}
              onClick={handleDeleteComment}
            >
              <Delete size={16} />
              <h1>Delete comment</h1>
            </button>
            <button
              className="btn"
              disabled={isDeleting}
              onClick={() => {
                const modal = document.getElementById(
                  "delete-account-modal"
                ) as HTMLDialogElement;

                modal.show();
              }}
            >
              <Trash size={16} />
              <h1>Delete user's account</h1>
            </button>
          </div>
        </div>
      </div>
      <dialog id="delete-account-modal" className="modal">
        <div className="modal-box flex flex-row gap-8 items-center justify-center">
          <AlertTriangle size={128} className="self-center" />
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="font-bold text-3xl">Delete account?</h1>
              <p className="text-base-content/60">
                This is a destructive action, are you sure you wanna delete this
                user's account?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 justify-end">
              <button className="btn" onClick={handleDeleteAccount}>
                Yes
              </button>
              <button
                className="btn btn-neutral"
                onClick={() => {
                  const modal = document.getElementById(
                    "delete-account-modal"
                  ) as HTMLDialogElement;

                  modal.close();
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
