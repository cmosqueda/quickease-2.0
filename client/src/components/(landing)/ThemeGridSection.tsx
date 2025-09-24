import useTheme from "@/hooks/useTheme";

const ThemeGridSection = ({
  themes,
  label,
}: {
  themes: string[];
  label: string;
}) => {
  const { setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-xl">{label}</h1>
      <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {themes.map((theme) => (
          <div
            key={theme}
            className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent cursor-pointer"
            data-act-classname="outline-base-content!"
            data-set-theme={theme}
            onClick={() => setTheme(theme)}
          >
            <div
              className="bg-base-100 text-base-content font-sans"
              data-theme={theme}
            >
              <div className="grid grid-cols-5 grid-rows-3">
                <div className="bg-base-200 col-start-1 row-span-2 row-start-1" />
                <div className="bg-base-300 col-start-1 row-start-3" />
                <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                  <div className="font-bold">{theme}</div>
                  <div className="flex flex-wrap gap-1">
                    {["primary", "secondary", "accent", "neutral"].map(
                      (type) => (
                        <div
                          key={type}
                          className={`bg-${type} flex aspect-square w-5 items-center justify-center rounded lg:w-6`}
                        >
                          <div
                            className={`text-${type}-content text-sm font-bold`}
                          >
                            A
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeGridSection;
