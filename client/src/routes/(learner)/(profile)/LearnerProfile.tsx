import useAuth from "@/hooks/useAuth";

import { ChevronRight, Crown, GalleryVertical } from "lucide-react";

export default function LearnerProfilePage() {
  const { user } = useAuth();

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
        <div className="p-8 rounded-3xl bg-base-100"></div>
      </div>
    </div>
  );
}
