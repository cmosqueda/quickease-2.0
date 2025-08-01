/* eslint-disable @typescript-eslint/no-explicit-any */
import useReport from "@/hooks/useReport";
import _API_INSTANCE from "@/utils/axios";

import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportPostModal() {
  const { post } = useReport();
  const [description, setDescription] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await _API_INSTANCE.put("/forum/post/report", {
        description: description,
        post_id: post?.id,
      });

      document.getElementById("report-post-modal").close();
      toast.success("Post reported.");
    } catch (err) {
      toast.error("Error reporting post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (post) {
    return (
      <dialog id="report-post-modal" className="modal">
        <div className="modal-box flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <X
              className="cursor-pointer"
              onClick={() =>
                document.getElementById("report-post-modal").close()
              }
            />
            <h1 className="font-bold text-2xl">
              Why are you reporting this post?
            </h1>
          </div>
          <div className="">
            <p className="text-sm text-base-content/50">Post</p>
            {post?.title && (
              <h1 className="p-4 bg-base-200 rounded-xl font-bold text-xl">
                {post.title}
              </h1>
            )}
          </div>
          <div className="">
            <p className="text-sm text-base-content/50">Description</p>
            <textarea
              className="textarea resize-none w-full"
              placeholder="Enter your reasons..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </dialog>
    );
  }
}
