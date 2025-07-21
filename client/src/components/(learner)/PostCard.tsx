import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import clsx from "clsx";
import dayjs from "dayjs";

import { useVote } from "@/hooks/useVote";
import { EditorProvider } from "@tiptap/react";
import {
  Notebook,
  GalleryVertical,
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router";

const PostCard = ({ data }: { data: any }) => {
  const { mutate: vote } = useVote(["post"]);

  const handlePostVote = (vote_type: number) => {
    vote?.({
      post_id: data?.id,
      vote_type,
    });
  };

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
        <div>
          <p>
            {data?.user?.first_name} {data?.user?.last_name}
          </p>
          <p className="text-base-content/40">
            {dayjs(data?.created_at).format("MMMM DD, YYYY").toString()}
          </p>
        </div>
      </div>
      <h1 className="text-4xl font-bold">{data?.title}</h1>
      {data.tags.length > 0 && (
        <div className="flex flex-row gap-2">
          {data.tags.map((tag) => (
            <div key={tag.tag.tag_name} className="badge badge-neutral">
              {tag.tag.tag_name}
            </div>
          ))}
        </div>
      )}
      <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
        <EditorProvider
          content={data?.post_body || ""}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        />
      </div>
      {data.attachments.length > 0 && (
        <>
          <h1 className="font-bold text-xl">Attachments</h1>
          <div className="flex flex-row gap-4 items-center">
            {data.attachments.map(
              (attachment: {
                resource_type: string;
                note_id: string;
                note: {
                  title: string;
                };
                quiz_id: string;
                quiz: {
                  title: string;
                };
                flashcard_id: string;
                flashcard: {
                  title: string;
                };
              }) => {
                switch (attachment.resource_type) {
                  case "NOTE":
                    return (
                      <NavLink
                        to={`/learner/note/view/${attachment.note_id}`}
                        className="rounded-xl p-4 bg-base-100 cursor-pointer flex flex-row gap-4 items-center hover:bg-base-300"
                      >
                        <Notebook />
                        <h1 className="text-2xl font-bold">
                          {attachment.note.title}
                        </h1>
                      </NavLink>
                    );
                  case "QUIZ":
                    return (
                      <NavLink
                        to={`/learner/quizzes/${attachment.quiz_id}`}
                        className="rounded-xl p-4 bg-base-100 cursor-pointer flex flex-row gap-4 items-center hover:bg-base-300"
                      >
                        <GalleryVertical />
                        <h1 className="text-2xl font-bold">
                          {attachment.quiz.title}
                        </h1>
                      </NavLink>
                    );
                  case "FLASHCARD":
                    return (
                      <NavLink
                        to={`/learner/flashcards/view/${attachment.flashcard_id}`}
                        className="rounded-xl p-4 bg-base-100 cursor-pointer flex flex-row gap-4 items-center hover:bg-base-300"
                      >
                        <GalleryVertical />
                        <h1 className="text-2xl font-bold">
                          {attachment.flashcard.title}
                        </h1>
                      </NavLink>
                    );
                    break;
                }
              }
            )}
          </div>
        </>
      )}

      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp
            className={clsx(
              "cursor-pointer hover:text-green-500",
              data?.user_vote === 1 && "text-green-600"
            )}
            onClick={() => handlePostVote(1)}
          />
          <p className="text-sm">{data?.vote_sum ?? 0}</p>
          <ChevronDown
            className={clsx(
              "cursor-pointer hover:text-red-500",
              data?.user_vote === -1 && "text-red-600"
            )}
            onClick={() => handlePostVote(-1)}
          />
        </div>
        <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300">
          <MessageCircle />
          <p>{data?.comments?.length ?? 0}</p>
        </div>
      </div>
    </>
  );
};

export default PostCard;
