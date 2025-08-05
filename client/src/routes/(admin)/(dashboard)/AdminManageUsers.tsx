/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";
import dayjs from "dayjs";

import { Check, Clock, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export default function AdminManageUsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["all-users", page],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get(
          `admin/auth/users?page=${page}&limit=${14}`
        );

        return data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <h1 className="font-bold lg:text-4xl text-3xl">Manage users</h1>
      <div className="flex flex-col gap-2">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
      </div>

      {!isLoading && (
        <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {data.users.map((user: any) => (
            <Link
              to={`user/${user.id}`}
              className="flex flex-col gap-2 justify-between p-4 rounded-3xl bg-base-100 border border-base-200 shadow cursor-pointer"
            >
              <div>
                <h1 className="font-bold text-xl">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex flex-row gap-2 items-center">
                  <Clock size={16} />
                  <p>
                    {dayjs(user.created_at)
                      .format("MMMM DD, YYYY hh:mm A")
                      .toString()}
                  </p>
                </div>
              </div>
              <div className="px-4 py-1 rounded-3xl bg-base-200 bg-soft w-fit flex flex-row gap-2 items-center">
                {user.is_verified ? <Check /> : <X />}
                {user.is_verified ? <h1>Verified</h1> : <h1>Unverified</h1>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex justify-center gap-4 self-end">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => (p < data.totalPages ? p + 1 : p))}
            disabled={page >= data.totalPages}
            className="btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
