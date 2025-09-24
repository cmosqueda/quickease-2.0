/* eslint-disable @typescript-eslint/no-explicit-any */
import FlippableCard from "@/components/(learner)/flashcard/FlippableCard";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft, Save } from "lucide-react";
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

  // track flip state per card
  const [flippedCards, setFlippedCards] = useState<boolean[]>(
    Array(data.flashcards.length).fill(false)
  );

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
    } catch (err: any) {
      toast.error(`Error saving flashcard: ${err.message}`);
    }
  };

  const toggleFlip = (index: number) => {
    const updated = [...flippedCards];
    updated[index] = !updated[index];
    setFlippedCards(updated);
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
        <button className="btn btn-neutral" onClick={handleSave}>
          <Save />
          <p>Save</p>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="input text-2xl w-full"
          placeholder="Title..."
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea text-lg resize-none w-full"
          placeholder="Short description..."
        />
      </div>

      <div className="flex flex-col gap-4">
        {cards.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Flashcards</h1>
            {cards.map((card: any, index: number) => (
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
                  isFlipped={flippedCards[index]}
                  onFlip={() => toggleFlip(index)}
                  hasMargin={false}
                  style="self-center"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
