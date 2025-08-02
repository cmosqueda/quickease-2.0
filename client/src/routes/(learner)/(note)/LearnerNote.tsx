/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomEditor from "@/components/Editor";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";
import _API_INSTANCE from "@/utils/axios";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";

import {
  ArrowLeft,
  CalendarRange,
  ClipboardList,
  Delete,
  Save,
  X,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LearnerNotePage() {
  const { user } = useAuth();
  const data = useLoaderData();
  const navigate = useNavigate();

  // States for editors //
  const [html, setHTML] = useState("");
  const [text, setText] = useState("");
  const [json, setJSON] = useState({});
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(data.is_public);

  const editor = useEditor({
    editable: true,
    autofocus: false,
    extensions: _TIPTAP_EXTENSIONS,
    content: data.notes_content,
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
      setText(editor.getText());
      setJSON(editor.getJSON());
    },
  });

  useEffect(() => {
    setTitle(data.title);
    setHTML(data.notes_content);
  }, [data]);

  useEffect(() => {
    if (editor && editor.isEditable && editor.getText().trim()) {
      setText(editor.getText());
      setJSON(editor.getJSON());
    }
  }, [editor]);
  // States for editors //

  const handleSave = async () => {
    if (title === data.title && html === data.notes_content) {
      toast.info("No changes to save.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await _API_INSTANCE.put(
        "/notes/update",
        {
          title: title,
          content: html,
          note_id: data.id,
          user_id: user?.id,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (res.status == 200) {
        toast.success("Note updated.");
        navigate("/learner/library?tab=notes");
      }
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { status } = await _API_INSTANCE.delete("/notes/delete", {
        data: { note_id: data.id },
      });

      if (status == 200) {
        toast.success("Note deleted.");
        return navigate(-1 as any);
      }
    } catch (err) {
      toast.error("Error deleting note.");
      throw err;
    }
  };
  const handleVisibility = async (visibility: boolean) => {
    try {
      await _API_INSTANCE.patch(
        "/notes/toggle-visibility",
        {
          visibility: visibility,
          note_id: data.id,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );
      toast.success("Note visibility updated.");
    } catch {
      toast.error("Error updating note visibility.");
    }
  };

  if (!editor) return;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:gap-0 gap-4 lg:items-center border-b border-base-300 p-4 bg-base-100">
        <ArrowLeft
          onClick={() =>
            navigate("/learner/library?tab=notes", { viewTransition: true })
          }
          className="cursor-pointer lg:ml-6"
        />
        <div
          className={clsx(
            "flex flex-row gap-4 w-full lg:w-fit",
            title === data.title && html === data.notes_content
              ? "opacity-0"
              : "opacity-100"
          )}
        >
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="btn btn-soft btn-success flex flex-row gap-4 items-center flex-1 lg:flex-initial"
          >
            <Save />
            <p>Save changes</p>
          </button>
          <button
            onClick={() =>
              navigate("/learner/library?tab=notes", { viewTransition: true })
            }
            className="btn btn-ghost btn-neutral flex flex-row gap-4 items-center flex-1 lg:flex-initial"
          >
            <X />
            <p>Cancel</p>
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_0.2fr] h-full">
        <div className="flex flex-col gap-2 p-4 lg:p-8">
          <input
            placeholder="Title..."
            value={title}
            className="font-bold text-3xl input input-ghost w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CustomEditor editor={editor} />
        </div>
        <div className="flex flex-col gap-4 bg-base-100 border-l border-b border-base-300 p-4 h-full">
          <h1 className="font-bold text-xl">Study options</h1>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={() => {
              const modal = document.getElementById(
                "generate-flashcard-modal"
              ) as HTMLDialogElement;
              modal.showModal();
            }}
          >
            <CalendarRange />
            <h1>Generate flashcards</h1>
          </button>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={() => {
              const modal = document.getElementById(
                "generate-quiz-modal"
              ) as HTMLDialogElement;
              modal.showModal();
            }}
          >
            <ClipboardList />
            <h1>Generate quiz</h1>
          </button>
          <h1 className="font-bold text-xl">Other options</h1>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={handleDelete}
          >
            <Delete />
            <h1>Delete</h1>
          </button>
          <div className="flex flex-row items-center justify-between rounded-3xl p-4 bg-base-200 gap-2 join-item">
            <h1>Set to {isPublic ? "private" : "public"}</h1>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={async () => {
                const nextVisibility = !isPublic;
                setIsPublic(nextVisibility);

                try {
                  await handleVisibility(nextVisibility);
                } catch {
                  setIsPublic(isPublic);
                  toast.error("Error updating note visibility.");
                }
              }}
              className="toggle"
            />
          </div>
        </div>
      </div>
      <GenerateFlashcardModal text={text} />
      <GenerateQuizModal text={text} />
    </div>
  );
}
