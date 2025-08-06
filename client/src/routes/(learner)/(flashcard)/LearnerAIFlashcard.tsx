/* eslint-disable @typescript-eslint/no-explicit-any */
import FlippableCard from "@/components/(learner)/FlippableCard";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";

import { ArrowLeft, ChevronLeft, ChevronRight, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export default function LearnerAIFlashcardPage() {
  const { user } = useAuth();
  const data = useLoaderData();
  const navigate = useNavigate();
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          setIsFlipped((prev) => !prev);
          break;
        case "ArrowLeft":
          setCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
          setIsFlipped(false);
          break;
        case "ArrowRight":
          setCardIndex((prev) =>
            prev < data.flashcards.length - 1 ? prev + 1 : prev
          );
          setIsFlipped(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data.flashcards.length]);

  const handleSave = async () => {
    if (data.flashcards.length < 2) {
      toast.info("The flashcards must contain atleast 2.");
      return;
    }

    try {
      const { status } = await _API_INSTANCE.post(
        "/flashcard/create",
        {
          title: `${data.title} Summary`,
          description: null,
          flashcards: data.flashcards,
          user_id: user?.id,
          isAI: true,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (status == 201) {
        toast.success("Flashcard created.");
        navigate("/learner/library?tab=flashcards", { viewTransition: true });
      }
    } catch (err: any) {
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
        front={data.flashcards[cardIndex].front}
        back={data.flashcards[cardIndex].back}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((prev) => !prev)}
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
