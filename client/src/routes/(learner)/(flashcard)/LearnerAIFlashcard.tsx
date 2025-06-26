import FlippableCard from "@/components/(learner)/FlippableCard";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft, ChevronLeft, ChevronRight, Edit, Save } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export default function LearnerAIFlashcardPage() {
  const { user } = useAuth();
  const data = useLoaderData();
  const navigate = useNavigate();
  const [cardIndex, setCardIndex] = useState(0);

  const handleSave = async () => {
    if (data.length < 2) {
      toast.info("The flashcards must contain atleast 2.");
      return;
    }

    try {
      const { status } = await _API_INSTANCE.post("/flashcard/create", {
        title: `${data.title} Summary`,
        description: null,
        flashcards: data.content,
        user_id: user?.id,
        isAI: true,
      });

      if (status == 201) {
        toast.success("Flashcard created.");
        navigate("/learner/library?tab=flashcards", { viewTransition: true });
      }
    } catch (err) {
      toast.error(`Error creating flashcard: ${err.message}`);
      return;
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
          <button className="btn btn-ghost btn-success" onClick={handleSave}>
            <Save />
            <p>Save generated flashcards</p>
          </button>
        </div>
      </div>
      <FlippableCard
        front={data.content[cardIndex].front}
        back={data.content[cardIndex].back}
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
          {cardIndex + 1}/{data.content.length}
        </p>
        <ChevronRight
          className="cursor-pointer p-1.5 delay-0 duration-300 transition-all hover:bg-base-100 rounded-full hover:shadow"
          size={36}
          onClick={() => {
            setCardIndex((prev) => {
              if (prev + 1 < data.content.length) {
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
