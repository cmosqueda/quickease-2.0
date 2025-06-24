import CustomEditor from "@/components/Editor";
import GenerateSummaryModal from "@/components/(ai)/GenerateSummaryModal_NOTE";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";

import {
  ArrowLeft,
  BookDown,
  CalendarRange,
  ClipboardList,
  Save,
  X,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LearnerAICreateNotePage() {
  const data = useLoaderData(); // for generated content
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // States for editors //
  const [html, setHTML] = useState(data.content);
  const [text, setText] = useState("");
  const [json, setJSON] = useState({});
  const [title, setTitle] = useState("");

  const editor = useEditor({
    editable: true,
    autofocus: false,
    extensions: _TIPTAP_EXTENSIONS,
    content: data.content,
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
      setText(editor.getText());
      setJSON(editor.getJSON());
    },
  });
  // States for editors //

  useEffect(() => {
    return () => editor?.destroy();
  }, []);

  if (!editor) return;

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await _API_INSTANCE.post("/notes/create", {
        title: title,
        content: html,
        user_id: user?.id,
      });

      if (res.status == 200) {
        toast.success("Note created.");
        navigate(-1);
      }
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:gap-0 gap-4 lg:items-center border-b border-base-300 p-4 bg-base-100">
        <div className="flex flex-row items-center gap-4">
          <ArrowLeft
            onClick={() => navigate(-1, { viewTransition: true })}
            className="cursor-pointer lg:ml-6"
          />
          <h1 className="text-2xl font-bold">Create note</h1>
        </div>
        <div className="flex flex-row gap-4 w-full lg:w-fit">
          <button
            className="btn btn-soft btn-success flex flex-row gap-4 items-center flex-1 lg:flex-initial"
            disabled={isSaving}
            onClick={handleSave}
          >
            <Save />
            <p>Save changes</p>
          </button>
          <button
            onClick={() => navigate(-1, { viewTransition: true })}
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
            onClick={() =>
              document.getElementById("generate-summary-modal").showModal()
            }
          >
            <BookDown />
            <h1>Generate summary</h1>
          </button>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={() =>
              document.getElementById("generate-flashcard-modal").showModal()
            }
          >
            <CalendarRange />
            <h1>Generate flashcards</h1>
          </button>
          <button
            className="rounded-3xl btn btn-soft gap-2 join-item"
            onClick={() =>
              document.getElementById("generate-quiz-modal").showModal()
            }
          >
            <ClipboardList />
            <h1>Generate quiz</h1>
          </button>
        </div>
      </div>
      <GenerateSummaryModal html={html} text={text} json={json} />
      <GenerateFlashcardModal html={html} text={text} json={json} />
      <GenerateQuizModal html={html} text={text} json={json} />
    </div>
  );
}
