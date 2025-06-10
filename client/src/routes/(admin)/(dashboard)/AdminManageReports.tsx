import {
  Clock,
  Megaphone,
  MessageCircle,
  Search,
} from "lucide-react";

export default function AdminManageReports() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <h1 className="font-bold lg:text-4xl text-3xl">Manage reports</h1>
      <label className="input w-full lg:w-fit">
        <Search size={24} />
        <input type="search" className="lg:w-md" placeholder="Search" />
      </label>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 justify-between p-4 rounded-3xl bg-base-100 cursor-pointer">
          <h1 className="font-bold text-xl">Reported by Name</h1>
          <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-200">
            <div className="flex flex-row gap-2 items-center">
              <Megaphone size={16} />
              <p>username6969</p>
            </div>
            <p>Lorem ipsum rawrwarwarawr.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-200">
            <div className="flex flex-row gap-2 items-center">
              <MessageCircle size={16} />
              <p>username6969</p>
            </div>
            <p>Lorem ipsum rawrwarwarawr.</p>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit flex flex-row gap-2 items-center">
            <Clock size={16} />
            <h1>Date</h1>
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-between p-4 rounded-3xl bg-base-100 cursor-pointer">
          <h1 className="font-bold text-xl">Reported by Name</h1>
          <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-200">
            <div className="flex flex-row gap-2 items-center">
              <Megaphone size={16} />
              <p>username6969</p>
            </div>
            <p>Lorem ipsum rawrwarwarawr.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-3xl bg-base-200">
            <div className="flex flex-row gap-2 items-center">
              <MessageCircle size={16} />
              <p>username6969</p>
            </div>
            <p>Lorem ipsum rawrwarwarawr.</p>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit flex flex-row gap-2 items-center">
            <Clock size={16} />
            <h1>Date</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
