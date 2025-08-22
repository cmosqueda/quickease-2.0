import _API_INSTANCE from "@/utils/axios";

export const _BADGES = {
  learningProgress: [
    {
      id: "firstStep",
      name: "First Step",
      description:
        "Created the first note, first flashcards set, and first quiz.",
    },
    {
      id: "quickLearner",
      name: "Quick Learner",
      description: "Achieved at least 80% score on 5 different quizzes.",
    },
    {
      id: "noteTaker",
      name: "Note Taker",
      description: "Created 10 personal notes or summaries.",
    },
    {
      id: "flashcardMaster",
      name: "Flashcard Master",
      description: "Created 10 flashcard sets.",
    },
    {
      id: "masterReviewer",
      name: "Master Reviewer",
      description: "Answered and reviewed the same quiz at least 5 times.",
    },
  ],
  collaborationCommunity: [
    {
      id: "firstPost",
      name: "First Post",
      description:
        "Shared a post with your first attachment (summary notes, flashcard set, or quiz set) to the forum.",
    },
    {
      id: "helpfulCommenter",
      name: "Helpful Commenter",
      description: "Received 10 upvotes across your comments",
    },
    {
      id: "communityFavorite",
      name: "Community Favorite",
      description:
        "One of your posts with any attached shared materials received 25 upvotes from different users.",
    },
  ],
  milestonesAchievements: [
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Achieved 100% score on a quiz.",
    },
    {
      id: "achiever",
      name: "Achiever",
      description: "Achieved 100% score on 10 different quizzes.",
    },
    {
      id: "forumVeteran",
      name: "Forum Veteran",
      description:
        "Participated in 100+ forum activities (votes, comments, shares)",
    },
  ],
};

export const _BADGE_MAP = Object.values(_BADGES)
  .flat()
  .reduce(
    (acc, badge) => {
      acc[badge.id] = badge;
      return acc;
    },
    {} as Record<string, { id: string; name: string; description: string }>
  );

export const _BADGE_ASSET_MAP: Record<string, any> = {
  firstStep: require("../../assets/images/badges/first-step-gradient.png"),
  quickLearner: require("../../assets/images/badges/quick-learner-gradient.png"),
  noteTaker: require("../../assets/images/badges/note-taker-gradient.png"),
  flashcardMaster: require("../../assets/images/badges/flashcard-master-gradient.png"),
  masterReviewer: require("../../assets/images/badges/master-reviewer-gradient.png"),
  firstPost: require("../../assets/images/badges/first-post-gradient.png"),
  helpfulCommenter: require("../../assets/images/badges/helpful-commenter-gradient.png"),
  communityFavorite: require("../../assets/images/badges/community-favorite-gradient.png"),
  perfectionist: require("../../assets/images/badges/perfectionist-gradient.png"),
  achiever: require("../../assets/images/badges/achiever-gradient.png"),
};

export async function checkBadges() {
  try {
    const { data } = await _API_INSTANCE.get("badges/check");

    const { awarded } = data;

    console.log(awarded);
  } catch (err) {
    console.error("Badge check failed", err);
  }
}
