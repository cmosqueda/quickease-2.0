/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";

import { Clock, MessageCircle, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { EditorProvider } from "@tiptap/react";
import { Link, useNavigate, useSearchParams } from "react-router";

export default function AdminSearchReportsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [params] = useSearchParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-reports", page],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get(
          `admin/forum/reports/search?page=${page}&q=${params.get("query")}`
        );

        return data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!params.get("query")) {
      navigate(-1 as any, { viewTransition: true });
    }
  }, [params]);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <h1 className="font-bold lg:text-4xl text-3xl">Manage reports</h1>

      <label className="input w-full lg:w-fit">
        <Search size={24} />
        <input type="search" className="lg:w-md" placeholder="Search" />
      </label>

      {isLoading && <p>Loading reports...</p>}
      {isError && <p className="text-red-500">Failed to load reports.</p>}

      <div className="grid lg:grid-cols-2 gap-4">
        {data.posts.map((post: any) => (
          <div
            key={post.id}
            className="flex flex-col gap-4 p-4 rounded-3xl bg-base-100 border border-base-200 shadow"
          >
            <Link
              to={`/admin/report/${post.id}`}
              className="font-bold text-sm text-base-content/50"
            >
              Post by {post.user?.first_name} {post.user?.last_name}
            </Link>
            <Link
              to={`/admin/report/${post.id}`}
              className="text-4xl font-bold"
            >
              {post.title}
            </Link>
            {post.post_body && (
              <Link
                to={`/admin/report/${post.id}`}
                className="p-4 rounded-3xl bg-base-100 shadow border border-base-200"
              >
                <EditorProvider
                  content={post?.post_body || ""}
                  extensions={_TIPTAP_EXTENSIONS}
                  editable={false}
                />
              </Link>
            )}

            <div className="collapse collapse-arrow bg-base-200 rounded-box">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                {post.reports.length} Report(s)
              </div>
              <div className="collapse-content flex flex-col gap-4">
                {post.reports.map((report: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-base-100 border border-base-300"
                  >
                    <div className="flex flex-row gap-2 items-center mb-2">
                      <MessageCircle size={16} />
                      <p className="font-semibold">
                        {report.reported_by?.first_name}{" "}
                        {report.reported_by?.last_name}
                      </p>
                    </div>
                    <p>{report.description ?? "No reason provided."}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-1 rounded-3xl bg-base-200 w-fit flex flex-row gap-2 items-center">
              <Clock size={16} />
              <h1>{new Date(post.created_at).toLocaleDateString()}</h1>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && (
        <div className="flex justify-center gap-2 items-center self-end">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={data?.length < 10}
            className="btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
