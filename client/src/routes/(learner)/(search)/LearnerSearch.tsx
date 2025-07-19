/* eslint-disable @typescript-eslint/no-explicit-any */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import dayjs from "dayjs";

import { ArrowLeft } from "lucide-react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { EditorProvider } from "@tiptap/react";

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
    navigate(`/search/${data.query}${pagePath}`);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <ArrowLeft
        onClick={() => navigate(-1, { viewTransition: false })}
        className="cursor-pointer"
      />
      <div>
        <p className="text-sm">Searched for</p>
        <h1 className="font-bold text-4xl break-words">{data.query}</h1>
      </div>
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
      <div className="flex flex-col gap-4">
        {data.posts.map((post) => (
          <Link
            className="flex flex-col gap-4 bg-base-100 p-4 rounded-3xl"
            key={post.id}
            to={`/learner/post/${post.id}`}
          >
            <div className="flex flex-row items-center gap-3">
              <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
              <div>
                <p>
                  {post?.user?.first_name} {post?.user?.last_name}
                </p>
                <p className="text-base-content/40">
                  {dayjs(post?.created_at).format("MMMM DD, YYYY").toString()}
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-bold">{post?.title}</h1>

            {post.tags.length > 0 && (
              <div className="flex flex-row flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <div key={tag.tag.tag_name} className="badge badge-neutral">
                    {tag.tag.tag_name}
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
              <EditorProvider
                content={post?.post_body || ""}
                extensions={_TIPTAP_EXTENSIONS}
                editable={false}
              />
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`btn btn-sm ${
                  pageNum === currentPage ? "btn-primary" : "btn-ghost"
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
