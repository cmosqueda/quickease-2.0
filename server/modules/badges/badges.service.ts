import db_client from "../../utils/client";

const _BADGES = [
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
];

/**
 * Checks the user's activity and awards new badges based on predefined conditions.
 *
 * This function evaluates various user metrics such as notes, flashcards, quizzes,
 * quiz attempts, posts, comments, and votes to determine which badges the user qualifies for.
 * If new badges are earned, they are merged with the user's existing badges and updated in the database.
 *
 * @param user_id - The unique identifier of the user to check and award badges for.
 * @returns An object containing the list of newly awarded badges.
 */
export async function checkAndAwardBadges(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
    select: { badges: true },
  });

  const currentBadges: any = user?.badges ?? [];
  const newBadges: string[] = [];

  const [
    notesCount,
    flashcardCount,
    quizCount,
    perfectQuizzes,
    highScoreQuizzes,
    repeatedQuizAttempts,
    postsWithAttachments,
    commentUpvotes,
    topPostUpvotes,
    forumActivityCount,
  ] = await Promise.all([
    db_client.note.count({ where: { user_id } }),
    db_client.flashcard.count({ where: { user_id } }),
    db_client.quiz.count({ where: { user_id } }),
    db_client.quizAttempt.count({ where: { user_id, score: 100 } }),
    db_client.quizAttempt.findMany({
      where: { user_id, score: { gte: 80 } },
      distinct: ["quiz_id"],
    }),
    db_client.quizAttempt.groupBy({
      by: ["quiz_id"],
      where: { user_id },
      _count: { quiz_id: true },
      having: { quiz_id: { _count: { gte: 5 } } },
    }),
    db_client.post.count({
      where: {
        user_id,
        attachments: { some: {} },
      },
    }),
    db_client.commentVote.count({
      where: {
        comment: { user_id },
        vote_type: 1,
      },
    }),
    db_client.post.count({
      where: {
        user_id,
        votes: {
          some: {
            vote_type: 1,
          },
        },
      },
    }),
    Promise.all([
      db_client.postVote.count({ where: { user_id } }),
      db_client.commentVote.count({ where: { user_id } }),
      db_client.comment.count({ where: { user_id } }),
      db_client.post.count({ where: { user_id } }),
    ]).then(([pv, cv, c, p]) => pv + cv + c + p),
  ]);

  const badgeConditions: Record<string, boolean> = {
    firstStep: notesCount > 0 && flashcardCount > 0 && quizCount > 0,
    quickLearner: highScoreQuizzes.length >= 5,
    noteTaker: notesCount >= 10,
    flashcardMaster: flashcardCount >= 10,
    masterReviewer: repeatedQuizAttempts.length >= 1,
    firstPost: postsWithAttachments > 0,
    helpfulCommenter: commentUpvotes >= 10,
    communityFavorite: topPostUpvotes >= 25,
    perfectionist: perfectQuizzes >= 1,
    achiever: perfectQuizzes >= 10,
    forumVeteran: forumActivityCount >= 100,
  };

  const currentBadgeIds = currentBadges.map((b: any) => b.id);

  for (const badgeId in badgeConditions) {
    if (badgeConditions[badgeId] && !currentBadgeIds.includes(badgeId)) {
      newBadges.push(badgeId);
    }
  }

  if (newBadges.length > 0) {
    const awardedBadgeObjects = newBadges
      .map((id) => _BADGES.find((b) => b.id === id))
      .filter(Boolean);

    const mergedBadges = [...currentBadges, ...awardedBadgeObjects].reduce(
      (acc, badge) => {
        if (!acc.find((b: any) => b.id === badge.id)) acc.push(badge);
        return acc;
      },
      []
    );

    await db_client.user.update({
      where: { id: user_id },
      data: {
        badges: mergedBadges,
      },
    });
  }

  return {
    awarded: newBadges
      .map((id) => {
        const badge = _BADGES.find((b) => b.id === id);
        return badge ? { id, ...badge } : null;
      })
      .filter(Boolean),
  };
}
