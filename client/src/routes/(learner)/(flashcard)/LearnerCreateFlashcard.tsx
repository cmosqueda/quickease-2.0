import FlippableCard from "@/components/(learner)/FlippableCard";

import { ArrowLeft, EllipsisVertical, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function LearnerCreateFlashcardPage() {
  const navigate = useNavigate();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);

  const handleSave = () => {
    if (!front && !back) {
      toast.error("Invalid input values.");
      return;
    }

    const newCard = { front, back };
    cards.push(newCard);

    setFront("");
    setBack("");
  };

  return (
    <div className="flex flex-col w-full lg:min-h-screen max-w-4xl mx-auto p-8 gap-6">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          onClick={() => navigate("/learner/library")}
          className="cursor-pointer"
        />
        <div className="flex flex-row gap-4 items-center">
          <Save className="cursor-pointer" />
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
        <button onClick={handleSave} className="btn btn-primary w-fit self-end">
          Add Flashcard
        </button>
      </div>
      {cards.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Previews</h1>
            {cards.map((card, index) => (
              <FlippableCard
                back={card.back}
                front={card.front}
                hasMargin={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
