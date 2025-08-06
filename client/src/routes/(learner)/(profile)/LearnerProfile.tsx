/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuth from "@/hooks/useAuth";

import { ChevronRight, Crown, GalleryVertical } from "lucide-react";
import { useLoaderData } from "react-router";

const User = ({ user }: { user: any }) => {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl">
        <div className="aspect-square items-center">
          <h1 className="font-bold text-4xl p-6 rounded-full bg-base-200 w-fit">
            {user?.first_name[0].toUpperCase()}
            {user?.last_name[0].toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-sm text-base-content/35">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-row gap-4 bg-base-100 p-8 rounded-3xl items-center">
          <Crown size={36} />
          <div className="flex flex-col">
            <p>Notes created</p>
            <h1 className="font-bold text-4xl">0</h1>
          </div>
        </div>
        <div className="flex flex-row gap-4 bg-base-100 p-8 rounded-3xl items-center">
          <GalleryVertical size={36} />
          <div className="flex flex-col">
            <p>Flashcards created</p>
            <h1 className="font-bold text-4xl">0</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold text-xl">Badges</h1>
          <button className="btn btn-md btn-soft items-center flex flex-row">
            <h1>View all</h1>
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-3">
          {user.badges &&
            user.badges.map((badge: any) => {
              const slug = badge.id
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .toLowerCase();
              const imageUrl = `/assets/images/badges/${slug}-gradient.png`;

              return (
                <div className="flex flex-row items-center justify-around gap-6 py-4 px-8 bg-base-100 rounded-xl border border-base-300 shadow">
                  <img
                    className="w-24 h-24 rounded-md object-cover"
                    src={imageUrl}
                    alt={badge.id}
                  />
                  <div>
                    <p className="font-bold text-2xl">{badge.name}</p>
                    <p className="text-sm text-base-content/50">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default function LearnerProfilePage() {
  const { user } = useAuth();
  const data = useLoaderData();

  if (!data) {
    return <User user={data} />;
  }

  if (data && data.id === user?.id) {
    return <User user={data} />;
  }
}
