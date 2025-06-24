import CustomEditor from "../Editor";
import _API_INSTANCE from "@/utils/axios";

import { Editor } from "@tiptap/react";
import { X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type PostModalProps = {
  html: string;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  editor?: Editor;
};

export default function PostModal({
  html,
  title,
  setTitle,
  editor,
}: PostModalProps) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const closeModal = () => {
    const modal = document.getElementById(
      "create-post-modal"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Title is required.");
      return;
    }

    if (!html.trim()) {
      toast.warning("Post content is empty.");
      return;
    }

    setIsSaving(true);

    try {
      const { status } = await _API_INSTANCE.post("/forum/post/create", {
        body: html,
        title,
      });

      if (status === 200) {
        toast.success("Post created successfully.");
        closeModal();
        navigate(-1, { viewTransition: true });
      } else {
        toast.error("Failed to create post. Try again.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <dialog id="create-post-modal" className="modal">
      <div className="modal-box bg-base-300 flex flex-col gap-4 max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={closeModal}
            className="p-1 rounded hover:bg-base-100"
            aria-label="Close modal"
          >
            <X className="cursor-pointer" />
          </button>
          <h1 className="font-bold text-xl">Create post</h1>
        </div>

        {/* Title Field */}
        <fieldset className="fieldset">
          <input
            type="text"
            className="input w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSaving}
          />
          <p className="label text-sm text-gray-500">Required</p>
        </fieldset>

        {/* Rich Text Editor */}
        <CustomEditor editor={editor} style="overflow-y-auto" />

        {/* Submit Button */}
        <button
          className="btn btn-success mt-2"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            <span className="loading loading-spinner" />
          ) : (
            <p>Post</p>
          )}
        </button>
      </div>
    </dialog>
  );
}
