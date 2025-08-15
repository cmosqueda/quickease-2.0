import clsx from "clsx";

export default function FlippableCard({
  front,
  back,
  isFlipped = false,
  hasMargin = true,
  style,
  onFlip,
}: {
  front: string;
  back: string;
  isFlipped?: boolean;
  hasMargin?: boolean;
  style?: string;
  onFlip?: () => void;
}) {
  return (
    <div
      className={clsx(
        style,
        "flex flex-col cursor-pointer",
        hasMargin ? "my-8 lg:my-16 mx-auto lg:max-w-3xl" : null
      )}
      onClick={onFlip}
    >
      <div className="perspective w-[80vw] h-[60vh] lg:w-3xl lg:h-[24rem]">
        <div
          className={`relative w-full h-full duration-500 transform-style preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-8 rounded-3xl bg-base-100 border border-base-300 shadow">
            <h1 className="text-xl">{front}</h1>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center items-center p-8 rounded-3xl bg-base-300 border border-base-300 shadow">
            <h1 className="text-xl">{back}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
