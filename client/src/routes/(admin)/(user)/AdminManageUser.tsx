import {
  ArrowLeft,
  ChevronRight,
  Crown,
  EllipsisVertical,
  GalleryVertical,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function AdminManageUserPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          onClick={() => navigate("/admin/", { viewTransition: true })}
          className="cursor-pointer"
        />
        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 my-2 p-2 shadow-sm">
            <li>
              <a>Delete user</a>
            </li>
            <li>
              <a>Suspend user</a>
            </li>
            <li>
              <a>Change user's email</a>
            </li>
            <li>
              <a>Change user's password</a>
            </li>
          </ul>
        </details>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl">
          <div className="aspect-square items-center">
            <h1 className="font-bold text-4xl p-6 rounded-full bg-base-200 w-fit">
              JV
            </h1>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold">Jhon Lloyd Viernes</h1>
            <p className="text-sm text-base-content/35">
              viernes.jhonlloydd@gmail.com
            </p>
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
    </div>
  );
}
