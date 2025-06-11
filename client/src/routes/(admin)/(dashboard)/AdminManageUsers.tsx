import { Clock, Search } from "lucide-react";

export default function AdminManageUsersPage() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <h1 className="font-bold lg:text-4xl text-3xl">Manage users</h1>
      <div className="flex flex-col gap-2">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
        <div className="flex flex-row gap-4">
          <div className="filter">
            <input
              className="btn filter-reset"
              type="radio"
              name="metaframeworks"
              aria-label="All"
            />
            <input
              className="btn"
              type="radio"
              name="metaframeworks"
              aria-label="Unverified"
            />
            <input
              className="btn"
              type="radio"
              name="metaframeworks"
              aria-label="Verified"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 justify-between p-4 rounded-3xl bg-base-100 border border-base-200 shadow cursor-pointer">
          <div>
            <h1 className="font-bold text-xl">Name</h1>
            <div className="flex flex-row gap-2 items-center">
              <Clock size={16} />
              <p>Date created</p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit">
            <h1>Unverified</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between p-4 rounded-3xl bg-base-100 border border-base-200 shadow cursor-pointer">
          <div>
            <h1 className="font-bold text-xl">Name</h1>
            <div className="flex flex-row gap-2 items-center">
              <Clock size={16} />
              <p>Date created</p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit">
            <h1>Unverified</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between p-4 rounded-3xl bg-base-100 border border-base-200 shadow cursor-pointer">
          <div>
            <h1 className="font-bold text-xl">Name</h1>
            <div className="flex flex-row gap-2 items-center">
              <Clock size={16} />
              <p>Date created</p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit">
            <h1>Unverified</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between p-4 rounded-3xl bg-base-100 border border-base-200 shadow cursor-pointer">
          <div>
            <h1 className="font-bold text-xl">Name</h1>
            <div className="flex flex-row gap-2 items-center">
              <Clock size={16} />
              <p>Date created</p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit">
            <h1>Unverified</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between p-4 rounded-3xl bg-base-100 border border-base-200 shadow cursor-pointer">
          <div>
            <h1 className="font-bold text-xl">Name</h1>
            <div className="flex flex-row gap-2 items-center">
              <Clock size={16} />
              <p>Date created</p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit">
            <h1>Unverified</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between p-4 rounded-3xl bg-base-100 border border-base-200 shadow cursor-pointer">
          <div>
            <h1 className="font-bold text-xl">Name</h1>
            <div className="flex flex-row gap-2 items-center">
              <Clock size={16} />
              <p>Date created</p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit">
            <h1>Unverified</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
