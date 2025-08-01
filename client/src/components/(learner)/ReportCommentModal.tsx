/* eslint-disable @typescript-eslint/no-explicit-any */
import useReport from "@/hooks/useReport";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";

import { EditorProvider } from "@tiptap/react";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportCommentModal() {
  const { comment } = useReport();
  const [description, setDescription] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await _API_INSTANCE.put(
        "/forum/comment/report",
        {
          description: description,
          comment_id: comment?.id,
        },
        { timeout: 8 * 60 * 1000 }
      );

      document.getElementById("report-comment-modal").close();
      toast.success("Comment reported.");
    } catch (err) {
      toast.error("Error reporting comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (comment) {
    return (
      <dialog id="report-comment-modal" className="modal">
        <div className="modal-box flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <X
              className="cursor-pointer"
              onClick={() =>
                document.getElementById("report-post-modal").close()
              }
            />
            <h1 className="font-bold text-2xl">
              Why are you reporting this comment?
            </h1>
          </div>
          <div className="">
            <p className="text-sm text-base-content/50">Comment</p>
            {comment?.comment_body && (
              <EditorProvider
                content={comment.comment_body}
                extensions={_TIPTAP_EXTENSIONS}
                editable={false}
                editorContainerProps={{
                  className:
                    "p-4 bg-base-200 rounded-xl overflow-ellipsis max-h-[24rem]",
                }}
              />
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
