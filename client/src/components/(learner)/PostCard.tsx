import {
  EllipsisVertical,
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

export default function PostCard({ post, user, date, description, title }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-[32px] h-[32px] aspect-square rounded-full bg-base-100" />
          <p>user123</p>
          <p>/ January 20, 2025</p>
        </div>
        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical
              className="rounded-full grow shrink-0 p-2 border border-base-200"
              size={36}
            />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 p-2 my-2 shadow-sm">
            <li>
              <a>Report</a>
            </li>
          </ul>
        </details>
      </div>
      <div className="cursor-pointer transition-all delay-0 duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-200 border border-base-200 hover:shadow">
        <p className="">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </p>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp className="cursor-pointer delay-0 duration-300 transition-all hover:text-green-500" />
          <p>1</p>
          <ChevronDown className="cursor-pointer delay-0 duration-300 transition-all hover:text-red-500" />
        </div>
        <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300">
          <MessageCircle />
          <p>2</p>
        </div>
      </div>
    </div>
  );
}
