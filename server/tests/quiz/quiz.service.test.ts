import * as quizService from "../../modules/quiz/quiz.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    quiz: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    quizAttempt: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockQuiz = {
  id: "quiz-1",
  title: "Sample Quiz",
  description: "A sample quiz",
  quiz_content: [
    {
      question: "What is 2 + 2?",
      description: "A basic math question",
      options: ["1", "2", "3", "4"],
      correctAnswers: [3],
    },
  ],
  is_randomized: false,
  timed_quiz: 30,
  user_id: "user-1",
  is_public: false,
};

describe("Quiz Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // get user quizzes
  test("getUserQuizzes should return quizzes by user ID", async () => {
    (db_client.quiz.findMany as jest.Mock).mockResolvedValue([mockQuiz]);

    const result = await quizService.getUserQuizzes("user-1");
    expect(result).toEqual([mockQuiz]);
    expect(db_client.quiz.findMany).toHaveBeenCalledWith({
      where: { user_id: "user-1" },
    });
  });

  // test("getQuiz should return quiz with attempts", async () => {
  //   const mockQuizWithAttempts = { ...mockQuiz, attempts: [] };
  //   (db_client.quiz.findUnique as jest.Mock).mockResolvedValue(mockQuizWithAttempts);

  //   const result = await quizService.getQuiz("quiz-1", "user-123");
  //   expect(result).toEqual(mockQuizWithAttempts);
  //   expect(db_client.quiz.findUnique).toHaveBeenCalledWith({
  //     where: { id: "quiz-1" },
  //     include: { attempts: true },
  //   });
  // });

  // create user quiz
  test("createUserQuiz should create and return a quiz", async () => {
    (db_client.quiz.create as jest.Mock).mockResolvedValue(mockQuiz);

    const result = await quizService.createUserQuiz(
      mockQuiz.title,
      mockQuiz.description,
      mockQuiz.quiz_content,
      mockQuiz.is_randomized,
      mockQuiz.timed_quiz,
      mockQuiz.user_id
    );

    expect(result).toEqual(mockQuiz);
    expect(db_client.quiz.create).toHaveBeenCalledWith({
      data: {
        title: mockQuiz.title,
        description: mockQuiz.description,
        quiz_content: mockQuiz.quiz_content,
        is_randomized: mockQuiz.is_randomized,
        timed_quiz: mockQuiz.timed_quiz,
        user_id: mockQuiz.user_id,
      },
    });
  });

  // update user quiz
  test("updateUserQuiz should update and return quiz", async () => {
    (db_client.quiz.update as jest.Mock).mockResolvedValue(mockQuiz);

    const result = await quizService.updateUserQuiz(
      mockQuiz.title,
      mockQuiz.description,
      mockQuiz.quiz_content,
      mockQuiz.is_randomized,
      mockQuiz.timed_quiz,
      mockQuiz.id
    );

    expect(result).toEqual(mockQuiz);
    expect(db_client.quiz.update).toHaveBeenCalledWith({
      data: {
        title: mockQuiz.title,
        description: mockQuiz.description,
        quiz_content: mockQuiz.quiz_content,
        is_randomized: mockQuiz.is_randomized,
        timed_quiz: mockQuiz.timed_quiz,
      },
      where: { id: mockQuiz.id },
    });
  });

  // update user quiz visibility should update and return quiz
  test("updateUserQuizVisibility should update and return quiz", async () => {
    const updatedQuiz = { ...mockQuiz, is_public: true };
    (db_client.quiz.update as jest.Mock).mockResolvedValue(updatedQuiz);

    const result = await quizService.updateUserQuizVisibility(true, mockQuiz.id);
    expect(result).toEqual(updatedQuiz);
    expect(db_client.quiz.update).toHaveBeenCalledWith({
      data: { is_public: true },
      where: { id: mockQuiz.id },
    });
  });

  // delete user quiz should delete quiz and return true
  test("deleteUserQuiz should delete quiz and return true", async () => {
    (db_client.quiz.delete as jest.Mock).mockResolvedValue({});

    const result = await quizService.deleteUserQuiz(mockQuiz.id);
    expect(result).toBe(true);
    expect(db_client.quiz.delete).toHaveBeenCalledWith({
      where: { id: mockQuiz.id },
    });
  });

  // submit quiz attempt should store attempt
  test("submitQuizAttempt should store attempt and return an object", async () => {
    (db_client.quizAttempt.create as jest.Mock).mockResolvedValue({ id: "attempt-123" });

    const attemptData = {
      question: {
        question: "What is 2 + 2?",
        options: ["1", "2", "3", "4"],
        correctAnswers: [3],
      },
      user_answer: [3],
    };

    const started_at = new Date().toISOString();
    const completed_at = new Date().toISOString();
    const duration = 10; // seconds
    const score = 100;
    const quiz_id = "quiz-1";
    const user_id = "user-1";

    const result = await quizService.submitQuizAttempt(
      attemptData,
      started_at,
      completed_at,
      duration,
      score,
      quiz_id,
      user_id
    );

    expect(result).toEqual({ submitted: true, id: "attempt-123" });
    expect(db_client.quizAttempt.create).toHaveBeenCalledWith({
      data: {
        user_id,
        started_at,
        completed_at,
        answer_data: attemptData,
        duration,
        score,
        quiz_id,
        is_public: true,
      },
    });
  });

  // get quiz attempt should return attempt by ID
  test("getQuizAttempt should return attempt by ID", async () => {
    const mockAttempt = {
      id: "attempt-1",
      quiz_id: "quiz-1",
      user_id: "user-1",
      answer_data: {},
      started_at: "2025-06-01T10:00:00Z",
      completed_at: "2025-06-01T10:10:00Z",
      quiz: {
        id: "quiz-1",
        title: "Sample Quiz",
      },
      user: {
        first_name: "John",
        last_name: "Doe",
      },
    };

    (db_client.quizAttempt.findUnique as jest.Mock).mockResolvedValue(mockAttempt);

    const result = await quizService.getQuizAttempt("attempt-1");

    expect(result).toEqual(mockAttempt);
    expect(db_client.quizAttempt.findUnique).toHaveBeenCalledWith({
      where: { id: "attempt-1" },
      include: {
        quiz: true,
        user: { select: { first_name: true, last_name: true } },
      },
    });
  });

  // fetching quiz should return  leaderboard ranks and current user's quiz attempts
  test("getQuiz should return leaderboard ranks", async () => {
    const quiz_id = "quiz-1";
    const user_id = "user-1";

    const mockQuiz = {
      id: quiz_id,
      title: "Sample Quiz",
      attempts: [
        {
          id: "attempt-1",
          user_id: user_id,
          score: 85,
        },
      ],
    };

    const mockLeaderboard = [
      {
        id: "attempt-2",
        quiz_id: quiz_id,
        user_id: "user-2",
        score: 95,
        duration: 300,
        is_public: true,
        user: {
          id: "user-2",
          first_name: "Alice",
          last_name: "Smith",
        },
      },
      {
        id: "attempt-3",
        quiz_id: quiz_id,
        user_id: "user-3",
        score: 90,
        duration: 320,
        is_public: true,
        user: {
          id: "user-3",
          first_name: "Bob",
          last_name: "Johnson",
        },
      },
    ];

    // Mock database calls
    (db_client.quiz.findUnique as jest.Mock).mockResolvedValue(mockQuiz);
    (db_client.quizAttempt.findMany as jest.Mock).mockResolvedValue(mockLeaderboard);

    const result = await quizService.getQuiz(quiz_id, user_id);

    expect(result).toEqual({
      ...mockQuiz,
      leaderboard: mockLeaderboard,
    });

    expect(db_client.quiz.findUnique).toHaveBeenCalledWith({
      where: { id: quiz_id },
      include: {
        attempts: {
          where: { user_id },
        },
      },
    });

    expect(db_client.quizAttempt.findMany).toHaveBeenCalledWith({
      where: {
        quiz_id,
        is_public: true,
      },
      orderBy: [{ score: "desc" }, { duration: "asc" }],
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  });
});
