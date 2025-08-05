/* eslint-disable @typescript-eslint/no-explicit-any */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import dayjs from "dayjs";

import { EditorProvider } from "@tiptap/react";
import { ArrowLeft, Delete, MessageCircle, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminManagePostPage() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async () => {
    setIsDeleting(true);

    try {
      await _API_INSTANCE.delete(`admin/forum/post/delete/${data.post.id}`, {
        data: {
          user_id: data.post.user.id,
        },
      });

      toast.success("Post deleted.");
      navigate(-1 as any, { viewTransition: true });
    } catch (err) {
      toast.error("Error deleting post, try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);

    try {
      await _API_INSTANCE.delete(`/users/${data.post.user.id}/delete`);

      toast.success("Post deleted.");
      navigate(-1 as any, { viewTransition: true });
    } catch (err) {
      toast.error("Error deleting post, try again.");
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

      <div className="flex flex-row items-center gap-3">
        <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
        <div>
          <p>
            {data.post.user.first_name} {data.post.user.last_name}
          </p>
          <p className="text-base-content/40">
            {dayjs(data.post.created_at).format("MMMM DD, YYYY").toString()}
          </p>
        </div>
      </div>
      <h1 className="text-4xl font-bold">{data.post.title}</h1>
      {data.post.post_body && (
        <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
          <EditorProvider
            content={data.post?.post_body || ""}
            extensions={_TIPTAP_EXTENSIONS}
            editable={false}
          />
        </div>
      )}

      <div className="collapse collapse-arrow bg-base-100 rounded-box">
        <input type="checkbox" />
        <div className="collapse-title font-medium">
          {data.reports.length > 1 ? "Reports" : "Report"} (
          {data.reports.length})
        </div>
        <div className="collapse-content flex flex-col gap-4">
          {data.reports.map((report: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-base-100 border border-base-300"
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

      <div className="collapse border-none rounded-3xl collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Other options</div>
        <div className="flex flex-col gap-2 collapse-content text-sm">
          <div className="grid grid-cols-2 gap-4">
            <button
              className="btn"
              disabled={isDeleting}
              onClick={handleDeletePost}
            >
              <Delete size={16} />
              <h1>Delete post</h1>
            </button>
            <button
              className="btn"
              disabled={isDeleting}
              onClick={handleDeleteUser}
            >
              <Trash size={16} />
              <h1>Delete user's account</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
