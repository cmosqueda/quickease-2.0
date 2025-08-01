import FlippableCard from "@/components/(learner)/FlippableCard";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft, EllipsisVertical, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { toast } from "sonner";

export default function LearnerEditAIFlashcardPage() {
  const { user } = useAuth();
  const data = useLoaderData() as {
    title: string;
    flashcards: { front: string; back: string }[];
  };

  const navigate = useNavigate();
  const [title, setTitle] = useState(data.title || "");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState(data.flashcards);

  const handleCardChange = (
    index: number,
    side: "front" | "back",
    value: string
  ) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [side]: value };
    setCards(updated);
  };

  const handleSave = async () => {
    if (cards.length < 2) {
      toast.info("The flashcards must contain at least 2.");
      return;
    }

    try {
      const { status } = await _API_INSTANCE.post(
        "/flashcard/create",
        {
          title: `${title} Flashcards`,
          description: description,
          flashcards: cards,
          user_id: user?.id,
          isAI: true,
        },
        { timeout: 8 * 60 * 1000 }
      );

      if (status === 201) {
        toast.success("Flashcard saved to library.");
        navigate("/learner/library?tab=flashcards", { viewTransition: true });
      }
    } catch (err) {
      toast.error(`Error saving flashcard: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-8 gap-6">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          onClick={() =>
            navigate("/learner/library?tab=flashcards", {
              viewTransition: true,
            })
          }
          className="cursor-pointer"
        />
        <div className="flex flex-row gap-4 items-center">
          <button className="cursor-pointer" onClick={handleSave}>
            <Save />
          </button>
          <details className="dropdown dropdown-end cursor-pointer">
            <summary className="list-none">
              <EllipsisVertical />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm my-4">
              <li>
                <a>Discard</a>
              </li>
            </ul>
          </details>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="input input-ghost text-2xl w-full"
          placeholder="Title..."
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-ghost text-lg resize-none w-full"
          placeholder="Short description..."
        />
      </div>

      <div className="flex flex-col gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Front (Question)</legend>
              <textarea
                className="textarea textarea-bordered resize-none w-full"
                rows={3}
                value={card.front}
                onChange={(e) =>
                  handleCardChange(index, "front", e.target.value)
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Back (Answer)</legend>
              <textarea
                className="textarea textarea-bordered resize-none w-full"
                rows={3}
                value={card.back}
                onChange={(e) =>
                  handleCardChange(index, "back", e.target.value)
                }
              />
            </fieldset>

            <FlippableCard
              front={card.front}
              back={card.back}
              hasMargin={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
