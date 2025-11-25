/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomEditor from "@/components/Editor";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";

import {
  ArrowLeft,
  CalendarRange,
  ClipboardList,
  TriangleAlertIcon,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";

export default function LearnerViewNotePage() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [html, setHTML] = useState("");
  const [text, setText] = useState("");
  const [json, setJSON] = useState({});
  const [title, setTitle] = useState("");

  const editor = useEditor({
    editable: false,
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

  if (!editor) return;

  if (data.private) {
    return (
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto w-full items-center justify-center gap-4">
        <TriangleAlertIcon size={96} />
        <div>
          <h1 className="text-4xl font-bold text-center">
            The user made this note private.
          </h1>
          <p className="text-base-content/50">
            Sorry, we can't display this note. The user either made this note
            private or made changes on it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:gap-0 gap-4 lg:items-center border-b border-base-300 p-4 bg-base-100">
        <ArrowLeft
          onClick={() => navigate(-1 as any, { viewTransition: true })}
          className="cursor-pointer lg:ml-6"
        />
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_0.2fr] h-full">
        <div className="flex flex-col gap-2 p-4 lg:p-8">
          <input
            placeholder="Title..."
            value={title}
            className="font-bold text-3xl input input-ghost w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CustomEditor editor={editor} isToolbarVisible={false} />
        </div>
        <div className="flex flex-col gap-4 bg-base-100 border-l border-b border-base-300 p-4 h-full">
          {user?.is_verified && (
            <>
              <h1 className="font-bold text-xl">Study options</h1>
              <button
                className="rounded-3xl btn btn-soft gap-2 join-item border border-base-300 shadow"
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
                className="rounded-3xl btn btn-soft gap-2 join-item border border-base-300 shadow"
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
            </>
          )}
        </div>
      </div>
      <GenerateFlashcardModal text={data.notes_content} />
      <GenerateQuizModal text={data.notes_content} />
    </div>
  );
}
