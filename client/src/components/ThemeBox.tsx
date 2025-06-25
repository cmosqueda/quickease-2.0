import useTheme from "@/hooks/useTheme";
import clsx from "clsx";
import { Paintbrush } from "lucide-react";
import { darkThemes, lightThemes } from "@/types/themes";

function ThemeItem({ theme, onClick }: { theme: string; onClick: () => void }) {
  return (
    <div
      className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent cursor-pointer"
      data-act-class="outline-base-content!"
      data-set-theme={theme}
      onClick={onClick}
    >
      <div
        className="bg-base-100 text-base-content w-full font-sans"
        data-theme={theme}
      >
        <div className="grid grid-cols-5 grid-rows-3">
          <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
          <div className="bg-base-300 col-start-1 row-start-3"></div>
          <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
            <div className="font-bold">{theme}</div>
            <div className="flex flex-wrap gap-1">
              {["primary", "secondary", "accent", "neutral"].map((color) => (
                <div
                  key={color}
                  className={`bg-${color} flex aspect-square w-5 items-center justify-center rounded lg:w-6`}
                >
                  <div className={`text-${color}-content text-sm font-bold`}>
                    A
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeSection({
  label,
  themes,
  onClick,
}: {
  label: string;
  themes: string[];
  onClick: (theme: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-xl">{label}</h1>
      <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {themes.map((theme) => (
          <ThemeItem key={theme} theme={theme} onClick={() => onClick(theme)} />
        ))}
      </div>
    </div>
  );
}

export default function ThemeBox({ floating = true }: { floating?: boolean }) {
  const { setTheme } = useTheme();

  if (floating) {
    return (
      <div className="tooltip absolute -right-4 top-21" data-tip="Themes">
        <details
          className={clsx(
            "dropdown dropdown-right hidden lg:grid",
            "p-1.5 rounded-full shrink-0 border border-base-300 bg-base-100",
            "transition-all duration-300 cursor-pointer hover:shadow"
          )}
        >
          <summary className="list-none">
            <Paintbrush size={24} />
          </summary>
          <ul className="dropdown-content z-10 w-[52rem] bg-base-100 rounded-box border border-base-300 shadow-sm p-4 flex flex-col gap-8">
            <ThemeSection
              label="Dark themes"
              themes={darkThemes}
              onClick={setTheme}
            />
            <ThemeSection
              label="Light themes"
              themes={lightThemes}
              onClick={setTheme}
            />
          </ul>
        </details>
      </div>
    );
  }

  return (
    <div className="my-2 flex flex-col gap-8">
      <ThemeSection
        label="Light themes"
        themes={lightThemes}
        onClick={setTheme}
      />
      <ThemeSection
        label="Dark themes"
        themes={darkThemes}
        onClick={setTheme}
      />
    </div>
  );
}
