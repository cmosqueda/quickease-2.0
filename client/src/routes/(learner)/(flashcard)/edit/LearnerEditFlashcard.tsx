/* eslint-disable @typescript-eslint/no-explicit-any */
import FlippableCard from "@/components/(learner)/flashcard/FlippableCard";
import _API_INSTANCE from "@/utils/axios";

import { checkBadges } from "@/utils/badges";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { toast } from "sonner";
import type { Flashcard } from "@/types/types";

export default function LearnerEditFlashcardPage() {
  const navigate = useNavigate();
  const data = useLoaderData() as Flashcard;

  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description || "");
  const [cards, setCards] = useState(data.flashcards);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // track flip state per card
  const [flippedCards, setFlippedCards] = useState<boolean[]>(
    Array(data.flashcards.length).fill(false)
  );

  const handleAddCard = () => {
    if (!front && !back) {
      toast.error("Invalid input values.");
      return;
    }

    const newCard = { front, back };
    setCards([...cards, newCard]);
    setFlippedCards([...flippedCards, false]); // add flip state for new card
    setFront("");
    setBack("");
  };

  const handleSave = async () => {
    if (cards.length < 2) {
      toast.info("The flashcards must contain at least 2.");
      return;
    }

    try {
      setIsSaving(true);
      const { status } = await _API_INSTANCE.put(
        `/flashcard/update`,
        {
          flashcard_id: data.id,
          title,
          description,
          flashcards: cards,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (status === 200) {
        await checkBadges();
        toast.success("Flashcard updated.");
        navigate("/learner/library?tab=flashcards", { viewTransition: true });
      }
    } catch (err: any) {
      toast.error(`Error updating flashcard: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardChange = (
    index: number,
    side: "front" | "back",
    value: string
  ) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [side]: value };
    setCards(updatedCards);
  };

  const toggleFlip = (index: number) => {
    const updated = [...flippedCards];
    updated[index] = !updated[index];
    setFlippedCards(updated);
  };

  return (
    <div className="flex flex-col w-full lg:min-h-screen max-w-4xl mx-auto p-8 gap-6">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          onClick={() =>
            navigate("/learner/library?tab=flashcards", {
              viewTransition: true,
            })
          }
          className="cursor-pointer"
        />
        <button
          className="btn btn-neutral"
          disabled={isSaving}
          onClick={handleSave}
        >
          <Save />
          <h1>Save changes</h1>
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

      <div className="flex flex-col gap-4 bg-base-100 p-8 rounded-3xl border border-base-300 shadow-md">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Front (Question)</legend>
          <textarea
            className="textarea textarea-bordered resize-none w-full"
            rows={3}
            placeholder="Enter the front of the card."
            value={front}
            onChange={(e) => setFront(e.target.value)}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Back (Answer)</legend>
          <textarea
            className="textarea textarea-bordered resize-none w-full"
            rows={3}
            placeholder="Enter the back of the card."
            value={back}
            onChange={(e) => setBack(e.target.value)}
          />
        </fieldset>
        <button
          onClick={handleAddCard}
          className="btn btn-primary w-fit self-end"
        >
          Add Flashcard
        </button>
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
