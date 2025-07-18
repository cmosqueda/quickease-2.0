import clsx from "clsx";
import NoteCard from "../(learner)/NoteCard";
import _API_INSTANCE from "@/utils/axios";

import {
  ArrowRight,
  LoaderPinwheel,
  Notebook,
  Paperclip,
  SendHorizonal,
  Text,
  X,
} from "lucide-react";
import { useState } from "react";
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
  const [isDisabled, setIsDisabled] = useState(false);
  const handleGenerate = async (id: string) => {
    setIsDisabled(true);

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
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 flex-wrap">
      {notes.map((c) => (
        <NoteCard
          key={c.id}
          title={c.title}
          date={c.created_at}
          onClick={() => handleGenerate(c.id)}
          style="bg-base-200 w-full items-start"
          disabled={isDisabled}
        />
      ))}
    </div>
  );
};

const GenerateFlashcardFromPrompt = ({
  navigate,
}: {
  navigate: NavigateFunction;
}) => {
  const [text, setText] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleGenerate = async () => {
    if (!text) {
      toast.error("Invalid input.");
      return;
    }

    setIsDisabled(true);

    try {
      const { data } = await _API_INSTANCE.post(
        "/ai/generate-flashcards-from-prompt",
        {
          prompt: text,
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
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <input
          className="input rounded-3xl w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={isDisabled}>
          {isDisabled ? (
            <LoaderPinwheel
              className="p-2 rounded-full bg-base-100 border border-base-content/30 shrink-0 cursor-not-allowed disabled:bg-base-300 animate-spin"
              size={40}
            />
          ) : (
            <SendHorizonal
              className="p-2 rounded-full bg-base-100 border border-base-content/30 shrink-0 cursor-pointer disabled:bg-base-300"
              size={40}
            />
          )}
        </button>
      </div>
      <p className="hover:text-blue-500 text-xs my-2 cursor-pointer text-base-content/30 transition-all delay-0 duration-300 w-fit">
        Please follow rules & regulations before generating.
      </p>
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
  ];

  return (
    <dialog id="generate-flashcard-modal-global" className="modal">
      <div className="modal-box max-w-5xl lg:max-h-[65vh] lg:rounded-3xl rounded-none w-full h-full lg:h-fit flex flex-col gap-4">
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
