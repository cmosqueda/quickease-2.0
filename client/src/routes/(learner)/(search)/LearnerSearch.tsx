/* eslint-disable @typescript-eslint/no-explicit-any */
import ForumPostCard from "@/components/(learner)/forum/ForumPostCard";

import { ArrowLeft, TriangleAlert } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

export default function LearnerSearchPage() {
  const navigate = useNavigate();
  const data = useLoaderData() as {
    sort?: string;
    posts: any[];
    total: number;
    query: string;
    page: number;
    limit: number;
  };

  const currentPage = data.page;
  const totalPages = Math.ceil(data.total / data.limit);

  const handlePageChange = (pageNum: number) => {
    const pagePath = pageNum === 1 ? "" : `/${pageNum}`;
    navigate(`/learner/search/${data.query}${pagePath}`);
  };

  if (data.posts.length == 0) {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
        <ArrowLeft
          onClick={() => navigate(-1 as any, { viewTransition: false })}
          className="cursor-pointer"
        />
        <div>
          <p className="text-sm">Searched for</p>
          <h1 className="font-bold text-4xl break-words">{data.query}</h1>
        </div>
        <div className="h-full flex flex-col gap-4 items-center justify-center">
          <TriangleAlert size={48} />
          <div>
            <h1 className="font-bold text-4xl">It's empty?</h1>
            <p>Your search has no results.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <ArrowLeft
        onClick={() => navigate(-1 as any, { viewTransition: false })}
        className="cursor-pointer"
      />
      <div>
        <p className="text-sm">Searched for</p>
        <h1 className="font-bold text-4xl break-words">{data.query}</h1>
        <div className="flex flex-row gap-4 items-center">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Filter by relevancy</legend>
            <select
              value={data.sort}
              onChange={(e) =>
                navigate(
                  `/learner/search/${data.query}/${data.page}?sort=${e.target.value}`
                )
              }
              className="select select-bordered max-w-xs"
            >
              <option value="newest">Newest</option>
              <option value="top">Top votes</option>
              <option value="comments">Most comments</option>
            </select>
          </fieldset>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {data.posts.map((post) => (
          <ForumPostCard post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`btn ${
                  pageNum === currentPage ? "btn-neutral" : "btn-ghost"
                }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
