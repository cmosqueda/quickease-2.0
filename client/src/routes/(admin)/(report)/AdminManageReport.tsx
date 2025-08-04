/* eslint-disable @typescript-eslint/no-explicit-any */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import { EditorProvider } from "@tiptap/react";
import dayjs from "dayjs";
import {
  ArrowLeft,
  Delete,
  EllipsisVertical,
  Key,
  MailCheck,
  MessageCircle,
  Trash,
} from "lucide-react";
import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";

export default function AdminManagePostPage() {
  const data = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(data);
  }, [data]);

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
          <p>
            {data.post.user.first_name} {data.post.user.last_name}
          </p>
          <p className="text-base-content/40">
            {dayjs(data.post.created_at).format("MMMM DD, YYYY").toString()}
          </p>
        </div>
      </div>
      <h1 className="text-4xl font-bold">{data.post.title}</h1>
      {data.post.post_body && (
        <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
          <EditorProvider
            content={data.post?.post_body || ""}
            extensions={_TIPTAP_EXTENSIONS}
            editable={false}
          />
        </div>
      )}

      <div className="collapse collapse-arrow bg-base-100 rounded-box">
        <input type="checkbox" />
        <div className="collapse-title font-medium">
          {data.reports.length > 1 ? "Reports" : "Report"} (
          {data.reports.length})
        </div>
        <div className="collapse-content flex flex-col gap-4">
          {data.reports.map((report: any, idx: number) => (
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
              <p>{report.reason ?? "No reason provided."}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="collapse border-none rounded-3xl collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Other options</div>
        <div className="flex flex-col gap-2 collapse-content text-sm">
          <div className="grid grid-cols-2 gap-4">
            <button className="btn" disabled={data.is_verified}>
              <Delete size={16} />
              <h1>Delete post</h1>
            </button>
            <button className="btn">
              <Trash size={16} />
              <h1>Delete user's account</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
