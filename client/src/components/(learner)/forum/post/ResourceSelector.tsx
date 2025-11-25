import { ArrowLeft, Check, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const ResourceSelector = ({
  title,
  postTitle,
  items,
  selectedItems,
  setSelectedItems,
  onBack,
  Icon,
}: {
  title: string;
  postTitle: string;
  items: any[];
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  onBack: () => void;
  Icon: any;
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const recommendedItems = useMemo(() => {
    if (!postTitle || postTitle.length < 3) return [];

    const keywords = postTitle
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 2);
    if (keywords.length === 0) return [];

    return items.filter((item) => {
      const itemTitle = item.title.toLowerCase();
      return item.is_public && keywords.some((k) => itemTitle.includes(k));
    });
  }, [postTitle, items]);

  const filteredItems = items.filter((item) => {
    const isPublic = item.is_public === true;
    const matchesQuery =
      query === "" || item.title.toLowerCase().includes(query.toLowerCase());
    return isPublic && matchesQuery;
  });

  const renderCard = (item: any) => {
    const isSelected = selectedItems.some((i) => i.id === item.id);
    return (
      <button
        key={item.id}
        onClick={() => {
          setSelectedItems((prev) =>
            isSelected ? prev.filter((i) => i.id !== item.id) : [...prev, item]
          );
        }}
        className={`flex flex-row p-4 rounded-xl cursor-pointer relative border shadow transition-all duration-200 text-left items-center gap-3
          ${
            isSelected
              ? "bg-primary/10 border-primary"
              : "bg-base-300 border-base-300 hover:border-base-content/20"
          }
        `}
      >
        <Icon
          className={isSelected ? "text-primary" : "text-base-content/70"}
        />
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-lg truncate">{item.title}</h1>
        </div>
        {isSelected && (
          <Check size={18} className="text-primary absolute right-4 top-4" />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded hover:bg-base-200 transition-colors"
          >
            <ArrowLeft className="cursor-pointer" />
          </button>
          <div>
            <h1 className="font-bold text-xl">{title}</h1>
            <p className="text-sm text-base-content/50">
              Only public items visible
            </p>
          </div>
        </div>
        <label className="input input-bordered flex items-center gap-2 w-full lg:w-fit">
          <Search size={18} className="opacity-70" />
          <input
            type="search"
            className="grow"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/learner/search/${query}`);
            }}
          />
        </label>
      </div>

      <div className="overflow-y-auto flex-1 pr-2 space-y-8">
        {recommendedItems.length > 0 && query === "" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-warning font-bold px-1">
              <h3>Recommended attachments based on title</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedItems.map(renderCard)}
            </div>
            <div className="divider">All Items</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(renderCard)
          ) : (
            <div className="col-span-full text-center py-10 opacity-50">
              No items found
            </div>
          )}
        </div>
      </div>

      <button type="button" className="btn btn-primary w-full" onClick={onBack}>
        Confirm selection ({selectedItems.length})
      </button>
    </div>
  );
};
