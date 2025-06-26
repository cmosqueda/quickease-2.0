import _API_INSTANCE from "@/utils/axios";

import { AlertCircle, LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function GenerateFlashcardModal({ text }: { text: string }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    const modal = document.getElementById(
      "generate-flashcard-modal"
    ) as HTMLDialogElement;

    const checkModalOpen = () => {
      if (modal?.open && !hasGenerated) {
        setHasGenerated(true);
        handleGenerate(text);
      }
    };

    const interval = setInterval(checkModalOpen, 100);

    return () => clearInterval(interval);
  }, [text, hasGenerated]);

  const handleGenerate = async (text: string) => {
    try {
      const { data } = await _API_INSTANCE.post(
        "/ai/generate-flashcards-from-prompt",
        { prompt: text },
        { timeout: 10000 }
      );

      await localStorage.setItem(
        "QUICKEASE_GENERATED_CONTENT",
        JSON.stringify(data)
      );

      document.getElementById("generate-flashcard-modal").close();
      navigate("/learner/flashcards/ai");
    } catch (err) {
      toast.error("Error generating content.");
      setIndex(1); // show failed state
    }
  };

  const pages = [
    <>
      <div className="modal-box items-center justify-center flex flex-col gap-4 w-fit">
        <LoaderPinwheel className="animate-spin" size={64} />
        <h3 className="font-bold text-2xl text-center">Generating...</h3>
      </div>
    </>,
    <>
      <div className="modal-box items-center justify-center flex flex-col gap-4 w-fit">
        <AlertCircle size={64} />
        <h3 className="font-bold text-2xl text-center">Failed.</h3>
      </div>
    </>,
  ]; // 0 - Loading | 1 - Failed

  return (
    <dialog id="generate-flashcard-modal" className="modal">
      {pages[index]}
    </dialog>
  );
}
