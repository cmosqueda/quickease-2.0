import CustomEditor from "@/components/Editor";
import GenerateSummaryModal from "@/components/(ai)/GenerateSummaryModal_NOTE";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";
import _API_INSTANCE from "@/utils/axios";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import useAuth from "@/hooks/useAuth";

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

  useEffect(() => {
    setTitle(data.title);
  }, [data]);

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
  // States for editors //

  if (!editor) return;

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await _API_INSTANCE.put("/notes/update", {
        title: title,
        content: html,
        note_id: data.id,
        user_id: user?.id,
      });

      if (res.status == 200) {
        toast.success("Note updated.");
        navigate("/learner/library?tab=notes");
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
        <ArrowLeft
          onClick={() => navigate('/learner/library?tab=notes', { viewTransition: true })}
          className="cursor-pointer lg:ml-6"
        />
        <div className="flex flex-row gap-4 w-full lg:w-fit">
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="btn btn-soft btn-success flex flex-row gap-4 items-center flex-1 lg:flex-initial"
          >
            <Save />
            <p>Save changes</p>
          </button>
          <button
            onClick={() => navigate('/learner/library?tab=notes', { viewTransition: true })}
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
