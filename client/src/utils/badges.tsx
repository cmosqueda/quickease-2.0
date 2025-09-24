import _API_INSTANCE from "./axios";
import { toast } from "sonner";

/**
 * Checks for newly awarded badges by making an API request.
 * If any badges are awarded, displays a custom toast notification for each badge,
 * including its image, name, and a message.
 */
export async function checkBadges() {
  try {
    const { data } = await _API_INSTANCE.get("badges/check");

    const { awarded } = data;

    console.log(awarded);

    if (awarded?.length) {
      awarded.forEach(
        (badge: { id: string; name: string; description: string }) => {
          const slug = badge.id
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .toLowerCase();
          const imageUrl = `/assets/images/badges/${slug}-gradient.png`;

          toast.custom(
            () => (
              <div className="flex flex-row items-center justify-around gap-3 py-4 px-8 w-[22rem] bg-base-100 rounded-xl border border-base-300 shadow">
                <img
                  className="w-24 h-24 rounded-md object-cover"
                  src={imageUrl}
                  alt={badge.id}
                />
                <div>
                  <p className="text-sm text-base-content/50">
                    You unlocked a badge
                  </p>
                  <p className="font-bold text-2xl">{badge.name}</p>
                </div>
              </div>
            ),
            {
              duration: 5000,
            }
          );
        }
      );
    }
  } catch (err) {
    console.error("Badge check failed", err);
  }
}
