import type { Editor } from "@tiptap/react";
import { X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import CustomEditor from "../Editor";
import { toast } from "sonner";
import _API_INSTANCE from "@/utils/axios";
import { useNavigate } from "react-router";

export default function PostModal({
  html,
  title,
  setTitle,
  editor,
}: {
  html: string;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  editor?: Editor;
}) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { status } = await _API_INSTANCE.post("/forum/post/create", {
        body: html,
        title: title,
      });

      if (status == 200) {
        toast.success("Posted.");
        navigate("/learner", {
          replace: true,
        });
        document.getElementById("create-post-modal").close();
      }
    } catch (err) {
      toast.error(err.message);
      return;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <dialog id="create-post-modal" className="modal">
      <div className="modal-box bg-base-300 flex flex-col gap-4 max-w-xl max-h-[90vh]">
        <div className="flex flex-row gap-4 items-center">
          <X
            className="cursor-pointer"
            onClick={() => document.getElementById("create-post-modal").close()}
          />
          <h1 className="font-bold text-xl">Create post</h1>
        </div>
        <fieldset className="fieldset">
          <input
            type="text"
            className="input w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <p className="label">Required</p>
        </fieldset>
        <CustomEditor editor={editor} style="overflow-y-auto" />
        <button
          className="btn btn-success"
          disabled={isSaving}
          onClick={handleSave}
        >
          <p>Post</p>
        </button>
      </div>
    </dialog>
  );
}
