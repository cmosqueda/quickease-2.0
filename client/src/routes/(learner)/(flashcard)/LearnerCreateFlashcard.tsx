import FlippableCard from "@/components/(learner)/FlippableCard";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft, EllipsisVertical, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function LearnerCreateFlashcardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // cards
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  // cards

  const [isSaving, setIsSaving] = useState(false);

  const handleAddCard = () => {
    if (!front && !back) {
      toast.error("Invalid input values.");
      return;
    }

    const newCard = { front, back };
    cards.push(newCard);

    setFront("");
    setBack("");
  };

  const handleSave = async () => {
    if (cards.length < 2) {
      toast.info("The flashcards must contain atleast 2.");
      return;
    }

    try {
      const { status } = await _API_INSTANCE.post("flashcard/create", {
        title: title,
        description: description,
        flashcards: cards,
        user_id: user?.id,
      });

      if (status == 201) {
        toast.success("Flashcard created.");
        navigate('/learner/library?tab=flashcards', { viewTransition: true });
      }
    } catch (err) {
      toast.error(`Error creating flashcard: ${err.message}`);
      return;
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

  return (
    <div className="flex flex-col w-full lg:min-h-screen max-w-4xl mx-auto p-8 gap-6">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          onClick={() => navigate("/learner/library?tab=flashcards", { viewTransition: true })}
          className="cursor-pointer"
        />
        <div className="flex flex-row gap-4 items-center">
          <button
            className="cursor-pointer"
            disabled={isSaving}
            onClick={handleSave}
          >
            <Save />
          </button>
          <details className="dropdown dropdown-end cursor-pointer">
            <summary className="list-none">
              <EllipsisVertical />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm my-4">
              <li>
                <a>Save as draft</a>
              </li>
              <li>
                <a>Discard Changes</a>
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
      {cards.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Flashcards</h1>
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
      )}
    </div>
  );
}
