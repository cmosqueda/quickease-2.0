import FlippableCard from "@/components/(learner)/FlippableCard";
import _API_INSTANCE from "@/utils/axios";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit,
  EllipsisVertical,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export default function LearnerFlashcardPage() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [cardIndex, setCardIndex] = useState(0);

  const handleDelete = async () => {
    try {
      const { status } = await _API_INSTANCE.delete("/flashcard/delete", {
        data: {
          flashcard_id: data.id,
        },
      });

      if (status == 200) {
        toast.success("Flashcard deleted.");
        return navigate("/learner/library?tab=flashcards", {
          viewTransition: true,
        });
      }
    } catch (err) {
      toast.error("Error deleting flashcard.");
    }
  };

  return (
    <div className="flex flex-col w-full lg:min-h-screen max-w-7xl mx-auto p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          onClick={() =>
            navigate("/learner/library?tab=flashcards", {
              viewTransition: true,
            })
          }
          className="cursor-pointer"
        />
        <div className="flex flex-row gap-6 items-center">
          <Edit className="cursor-pointer" onClick={() => navigate("edit")} />
          <details className="dropdown dropdown-end cursor-pointer">
            <summary className="list-none">
              <EllipsisVertical />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm my-4">
              <li>
                <button onClick={handleDelete}>Delete</button>
              </li>
            </ul>
          </details>
        </div>
      </div>
      <div>
        {data.is_ai_generated && (
          <div className="flex flex-row items-center gap-2">
            <Info size={16} className="text-sm text-base-content/50" />
            <h1 className="text-sm text-base-content/50">AI-generated</h1>
          </div>
        )}
        <h1 className="text-4xl font-bold">{data.title}</h1>
        {data.description && <p>{data.description}</p>}
      </div>
      <FlippableCard
        front={data.flashcards[cardIndex].front}
        back={data.flashcards[cardIndex].back}
      />
      <div className="flex flex-row items-center justify-center gap-12">
        <ChevronLeft
          className="cursor-pointer p-1.5 delay-0 duration-300 transition-all hover:bg-base-100 rounded-full hover:shadow"
          size={36}
          onClick={() => {
            if (cardIndex != 0) {
              setCardIndex((prev) => prev - 1);
            }
          }}
        />
        <p>
          {cardIndex + 1}/{data.flashcards.length}
        </p>
        <ChevronRight
          className="cursor-pointer p-1.5 delay-0 duration-300 transition-all hover:bg-base-100 rounded-full hover:shadow"
          size={36}
          onClick={() => {
            setCardIndex((prev) => {
              if (prev + 1 < data.flashcards.length) {
                return prev + 1;
              }
              return prev;
            });
          }}
        />
      </div>
    </div>
  );
}
