import { ArrowLeft, Clock, EllipsisVertical, Megaphone } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

export default function AdminManagePostPage() {
  const data = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-row justify-between items-center">
        <ArrowLeft
          onClick={() => navigate("/admin/")}
          className="cursor-pointer"
        />
        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 my-2 p-2 shadow-sm">
            <li>
              <a>Delete post</a>
            </li>
            <li>
              <a>Suspend user</a>
            </li>
            <li>
              <a>Ban user</a>
            </li>
          </ul>
        </details>
      </div>
      <div className="flex flex-row items-center gap-3">
        <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
        <div>
          <p>user123986712893</p>
          <p className="text-base-content/40">January 1, 1970</p>
        </div>
      </div>
      <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
      </div>
      <h1 className="font-bold text-xl">Reports</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-100 border border-base-200 shadow">
          <div className="flex flex-row gap-2 items-center">
            <Megaphone size={16} />
            <p>username6969</p>
          </div>
          <p>Lorem ipsum rawrwarwarawr.</p>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit flex flex-row gap-2 items-center">
            <Clock size={16} />
            <h1>Date</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-100 border border-base-200 shadow">
          <div className="flex flex-row gap-2 items-center">
            <Megaphone size={16} />
            <p>username6969</p>
          </div>
          <p>Lorem ipsum rawrwarwarawr.</p>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit flex flex-row gap-2 items-center">
            <Clock size={16} />
            <h1>Date</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-100 border border-base-200 shadow">
          <div className="flex flex-row gap-2 items-center">
            <Megaphone size={16} />
            <p>username6969</p>
          </div>
          <p>Lorem ipsum rawrwarwarawr.</p>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit flex flex-row gap-2 items-center">
            <Clock size={16} />
            <h1>Date</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-100 border border-base-200 shadow">
          <div className="flex flex-row gap-2 items-center">
            <Megaphone size={16} />
            <p>username6969</p>
          </div>
          <p>Lorem ipsum rawrwarwarawr.</p>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit flex flex-row gap-2 items-center">
            <Clock size={16} />
            <h1>Date</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
