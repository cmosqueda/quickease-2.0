import clsx from "clsx";
import NoteCard from "../(learner)/NoteCard";
import _API_INSTANCE from "@/utils/axios";

import {
  ArrowRight,
  Notebook,
  Paperclip,
  SendHorizonal,
  Text,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import { toast } from "sonner";

const GenerateFlashcardFromNotes = ({
  notes,
  navigate,
}: {
  notes: {
    id: string;
    title: string;
    date: string;
    link: string;
    created_at: string;
  }[];
  navigate: NavigateFunction;
}) => {
  const handleGenerate = async (id: string) => {
    try {
      const { data } = await _API_INSTANCE.post(
        "/ai/generate-flashcards-from-note",
        {
          note_id: id,
        },
        { timeout: 10000 }
      );

      await localStorage.setItem(
        "QUICKEASE_GENERATED_CONTENT",
        JSON.stringify(data)
      );

      document.getElementById("generate-flashcard-modal-global").close();
      return navigate("/learner/flashcards/ai");
    } catch (err) {
      toast.error("Error generating content.");
      throw err;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 flex-wrap">
      {notes.map((c) => (
        <NoteCard
          title={c.title}
          date={c.created_at}
          onClick={() => handleGenerate(c.id)}
          style="bg-base-200 w-full"
        />
      ))}
    </div>
  );
};

export default function GenerateFlashcardModal({
  notes,
}: {
  notes: {
    id: string;
    title: string;
    date: string;
    link: string;
    created_at: string;
  }[];
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const tabs = [
    <GenerateFlashcardFromNotes notes={notes} navigate={navigate} />,
    <>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <input className="input rounded-3xl w-full" />
          <SendHorizonal
            className="p-2 rounded-full bg-base-100 border border-base-content/30 shrink-0 cursor-pointer"
            size={40}
          />
        </div>
        <p className="hover:text-blue-500 text-xs my-2 cursor-pointer text-base-content/30 transition-all delay-0 duration-300">
          Please follow rules & regulations before generating.
        </p>
      </div>
    </>,
    <>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-base-content/10 border-dashed rounded-lg cursor-pointer bg-base-100 hover:bg-base-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-base-content dark:text-base-content"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-base-content">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-base-content/40">
              DOCX, DOC, PDF, ODF (max 5MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </label>
      </div>
      <button className="btn btn-soft btn-success w-fit self-end">
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>,
  ];

  return (
    <dialog id="generate-flashcard-modal-global" className="modal">
      <div className="modal-box max-w-5xl lg:max-h-[65vh] lg:rounded-3xl rounded-none w-full flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between">
          <div className="flex flex-row gap-4 items-center">
            <X
              onClick={() => {
                document
                  .getElementById("generate-flashcard-modal-global")
                  .close();
              }}
              className="cursor-pointer"
            />
            <h1 className="font-bold text-3xl lg:text-4xl">
              Generate flashcards
            </h1>
          </div>
          <div role="tablist" className="tabs tabs-box gap-4">
            <a
              role="tab"
              className={clsx(
                "flex flex-row gap-4 tab grow lg:grow-0",
                index == 0 ? "tab-active" : null
              )}
              onClick={() => setIndex(0)}
            >
              <Notebook />
              <h1>Select from notes</h1>
            </a>
            <a
              role="tab"
              className={clsx(
                "flex flex-row gap-4 tab grow lg:grow-0",
                index == 1 ? "tab-active" : null
              )}
              onClick={() => setIndex(1)}
            >
              <Text />
              <h1>Input text</h1>
            </a>
            <a
              role="tab"
              className={clsx(
                "flex flex-row gap-4 tab grow lg:grow-0",
                index == 2 ? "tab-active" : null
              )}
              onClick={() => setIndex(2)}
            >
              <Paperclip />
              <h1>Upload document</h1>
            </a>
          </div>
        </div>
        {tabs[index]}
      </div>
    </dialog>
  );
}
