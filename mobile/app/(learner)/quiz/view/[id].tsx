import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import _API_INSTANCE from "@/utils/axios";
import useTheme from "@/hooks/useTheme";
import CustomView from "@/components/CustomView";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useState } from "react";
import { ScrollView, Pressable, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { CommonActions } from "@react-navigation/native";

interface QuizData {
  id: string;
  user_id: string;
  quiz_content: {
    question: string;
    description?: string;
    options: string[];
    correctAnswers: number[];
  }[];
  title: string;
  description?: string;
  is_public: boolean | null;
  created_at: string;
  updated_at: string;
  is_ai_generated: boolean;
  is_randomized: boolean;
  timed_quiz: string;
  attempts: {
    id: string;
    duration: number;
    score: number;
    started_at: string;
    completed_at: string;
    user_id: string;
    answer_data: {
      question: {
        correctAnswers: number[];
      };
      user_answer: number[];
    }[];
  }[];
  leaderboard: {
    id: string;
    duration: number;
    score: number;
    started_at: string;
    completed_at: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
    };
    answer_data: {
      question: {
        correctAnswers: number[];
      };
      user_answer: number[];
    }[];
  }[];
}

export default function LearnerQuizPage() {
  const { currentScheme } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigate = useNavigation();

  const [quiz, setQuiz] = useState<QuizData | null>({
    id: "dd06550e-65ed-4ac0-95c3-b13f8191dc10",
    user_id: "27bba94a-b17f-4cc3-9389-279aa94d79e0",
    quiz_content: [
      {
        options: [
          "Hyper Text Manipulation Language",
          "Hyper Text Markup Language",
          "Home Tool Markup Language",
          "Hyper Text Markup Language",
        ],
        question: "What does HTML stand for?",
        description:
          "This question tests your basic understanding of the HTML acronym.",
        correctAnswers: [1, 3],
      },
      {
        options: [
          "To style web pages",
          "To define the content and structure of web content",
          "To add interactivity to web pages",
          "To manage server-side logic",
        ],
        question: "What is the primary purpose of HTML?",
        description:
          "This question assesses your understanding of HTML's core function.",
        correctAnswers: [1],
      },
      {
        options: [
          "In a text editor",
          "In a web browser",
          "On a server",
          "In the command line",
        ],
        question: "Where is HTML generally displayed?",
        description:
          "This question tests your knowledge of where HTML code is rendered.",
        correctAnswers: [1],
      },
      {
        options: [
          "JavaScript",
          "Cascading Style Sheets (CSS)",
          "Python",
          "SQL",
        ],
        question:
          "HTML is often assisted by which of the following technologies for styling?",
        description:
          "This question asks about a common technology used alongside HTML for styling.",
        correctAnswers: [1],
      },
      {
        options: ["CSS", "HTML", "JavaScript", "XML"],
        question:
          "Which technology is used to add interactivity to web pages, often alongside HTML?",
        description:
          "This question relates to a scripting language commonly used with HTML for interactivity.",
        correctAnswers: [2],
      },
      {
        options: [
          "A programming language",
          "A scripting language",
          "A markup language",
          "A database management system",
        ],
        question: "Which of the following best describes HTML?",
        description: "Tests your ability to describe HTML.",
        correctAnswers: [2],
      },
      {
        options: [
          "Style, Interactivity",
          "Content, Structure",
          "Functionality, Appearance",
          "Animations, Layout",
        ],
        question: "HTML defines the ______ and ______ of web content.",
        description: "Fill in the blanks regarding HTML's role.",
        correctAnswers: [1],
      },
      {
        options: ["Yes", "No", "Only with CSS", "Only with HTML"],
        question: "Can Javascript directly style HTML elements?",
        description: "Asks about Javascript styling capabilities.",
        correctAnswers: [0],
      },
      {
        options: [
          "HTML",
          "JavaScript",
          "Cascading Style Sheets (CSS)",
          "Python",
        ],
        question:
          "If you wanted to design the visual layout of a website, what would you use?",
        description: "Asks about how to design the layout of the website.",
        correctAnswers: [2],
      },
      {
        options: [
          "Only Cascading Style Sheets (CSS)",
          "Only Javascript",
          "Cascading Style Sheets (CSS) and Javascript",
          "None of the above",
        ],
        question: "What technologies may be used to improve HTML?",
        description: "Asks about technologies that work with HTML.",
        correctAnswers: [2],
      },
    ],
    title: "HTML Fundamentals Quiz",
    description: "asdasdsad",
    is_public: true,
    created_at: "2025-08-17T09:45:25.945Z",
    updated_at: "2025-08-17T09:45:25.945Z",
    is_ai_generated: true,
    is_randomized: false,
    timed_quiz: "0",
    attempts: [
      {
        id: "091cb095-b029-45a6-a077-3b3d9ee4a7c6",
        quiz_id: "dd06550e-65ed-4ac0-95c3-b13f8191dc10",
        user_id: "27bba94a-b17f-4cc3-9389-279aa94d79e0",
        started_at: "2025-08-17T10:03:52.915Z",
        completed_at: "2025-08-17T10:04:31.369Z",
        answer_data: [
          {
            question: {
              options: [
                "Hyper Text Manipulation Language",
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Highly Textual Machine Language",
              ],
              question: "What does HTML stand for?",
              description:
                "This question tests your basic understanding of the HTML acronym.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: [
                "To style web pages",
                "To define the content and structure of web content",
                "To add interactivity to web pages",
                "To manage server-side logic",
              ],
              question: "What is the primary purpose of HTML?",
              description:
                "This question assesses your understanding of HTML's core function.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: [
                "In a text editor",
                "In a web browser",
                "On a server",
                "In the command line",
              ],
              question: "Where is HTML generally displayed?",
              description:
                "This question tests your knowledge of where HTML code is rendered.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: [
                "JavaScript",
                "Cascading Style Sheets (CSS)",
                "Python",
                "SQL",
              ],
              question:
                "HTML is often assisted by which of the following technologies for styling?",
              description:
                "This question asks about a common technology used alongside HTML for styling.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: ["CSS", "HTML", "JavaScript", "XML"],
              question:
                "Which technology is used to add interactivity to web pages, often alongside HTML?",
              description:
                "This question relates to a scripting language commonly used with HTML for interactivity.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
          {
            question: {
              options: [
                "A programming language",
                "A scripting language",
                "A markup language",
                "A database management system",
              ],
              question: "Which of the following best describes HTML?",
              description: "Tests your ability to describe HTML.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
          {
            question: {
              options: [
                "Style, Interactivity",
                "Content, Structure",
                "Functionality, Appearance",
                "Animations, Layout",
              ],
              question: "HTML defines the ______ and ______ of web content.",
              description: "Fill in the blanks regarding HTML's role.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: ["Yes", "No", "Only with CSS", "Only with HTML"],
              question: "Can Javascript directly style HTML elements?",
              description: "Asks about Javascript styling capabilities.",
              correctAnswers: [0],
            },
            user_answer: [0],
          },
          {
            question: {
              options: [
                "HTML",
                "JavaScript",
                "Cascading Style Sheets (CSS)",
                "Python",
              ],
              question:
                "If you wanted to design the visual layout of a website, what would you use?",
              description:
                "Asks about how to design the layout of the website.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
          {
            question: {
              options: [
                "Only Cascading Style Sheets (CSS)",
                "Only Javascript",
                "Cascading Style Sheets (CSS) and Javascript",
                "None of the above",
              ],
              question: "What technologies may be used to improve HTML?",
              description: "Asks about technologies that work with HTML.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
        ],
        is_public: true,
        duration: 38,
        score: 10,
      },
    ],
    leaderboard: [
      {
        id: "091cb095-b029-45a6-a077-3b3d9ee4a7c6",
        quiz_id: "dd06550e-65ed-4ac0-95c3-b13f8191dc10",
        user_id: "27bba94a-b17f-4cc3-9389-279aa94d79e0",
        started_at: "2025-08-17T10:03:52.915Z",
        completed_at: "2025-08-17T10:04:31.369Z",
        answer_data: [
          {
            question: {
              options: [
                "Hyper Text Manipulation Language",
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Highly Textual Machine Language",
              ],
              question: "What does HTML stand for?",
              description:
                "This question tests your basic understanding of the HTML acronym.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: [
                "To style web pages",
                "To define the content and structure of web content",
                "To add interactivity to web pages",
                "To manage server-side logic",
              ],
              question: "What is the primary purpose of HTML?",
              description:
                "This question assesses your understanding of HTML's core function.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: [
                "In a text editor",
                "In a web browser",
                "On a server",
                "In the command line",
              ],
              question: "Where is HTML generally displayed?",
              description:
                "This question tests your knowledge of where HTML code is rendered.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: [
                "JavaScript",
                "Cascading Style Sheets (CSS)",
                "Python",
                "SQL",
              ],
              question:
                "HTML is often assisted by which of the following technologies for styling?",
              description:
                "This question asks about a common technology used alongside HTML for styling.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: ["CSS", "HTML", "JavaScript", "XML"],
              question:
                "Which technology is used to add interactivity to web pages, often alongside HTML?",
              description:
                "This question relates to a scripting language commonly used with HTML for interactivity.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
          {
            question: {
              options: [
                "A programming language",
                "A scripting language",
                "A markup language",
                "A database management system",
              ],
              question: "Which of the following best describes HTML?",
              description: "Tests your ability to describe HTML.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
          {
            question: {
              options: [
                "Style, Interactivity",
                "Content, Structure",
                "Functionality, Appearance",
                "Animations, Layout",
              ],
              question: "HTML defines the ______ and ______ of web content.",
              description: "Fill in the blanks regarding HTML's role.",
              correctAnswers: [1],
            },
            user_answer: [1],
          },
          {
            question: {
              options: ["Yes", "No", "Only with CSS", "Only with HTML"],
              question: "Can Javascript directly style HTML elements?",
              description: "Asks about Javascript styling capabilities.",
              correctAnswers: [0],
            },
            user_answer: [0],
          },
          {
            question: {
              options: [
                "HTML",
                "JavaScript",
                "Cascading Style Sheets (CSS)",
                "Python",
              ],
              question:
                "If you wanted to design the visual layout of a website, what would you use?",
              description:
                "Asks about how to design the layout of the website.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
          {
            question: {
              options: [
                "Only Cascading Style Sheets (CSS)",
                "Only Javascript",
                "Cascading Style Sheets (CSS) and Javascript",
                "None of the above",
              ],
              question: "What technologies may be used to improve HTML?",
              description: "Asks about technologies that work with HTML.",
              correctAnswers: [2],
            },
            user_answer: [2],
          },
        ],
        is_public: true,
        duration: 38,
        score: 10,
        user: {
          id: "27bba94a-b17f-4cc3-9389-279aa94d79e0",
          first_name: "Jhon Lloyd",
          last_name: "Viernes",
        },
      },
    ],
  });
  const [tabIndex, setTabIndex] = useState(1);
  const [quizVisibility, setQuizVisibility] = useState<boolean | null>(null);

  const handleAnswerQuiz = () => {
    navigate.dispatch(
      CommonActions.navigate({
        name: "quiz/answer/[id]",
        params: {
          id: "test",
        },
      })
    );
  };

  const handleEditQuiz = () => {
    navigate.dispatch(
      CommonActions.navigate({
        name: "quiz/edit/[id]",
        params: {
          id: "test",
        },
      })
    );
  };

  const handleDeleteQuiz = async () => {
    try {
      const { status } = await _API_INSTANCE.delete(`/quiz/delete`, {
        data: { quiz_id: quiz?.id },
      });
      if (status === 200) {
        ToastAndroid.show("Quiz deleted.", ToastAndroid.SHORT);
        navigate.goBack();
      }
    } catch {
      ToastAndroid.show("Failed to delete quiz.", ToastAndroid.SHORT);
    }
  };

  const handleVisibility = async (visibility: boolean) => {
    try {
      const { status } = await _API_INSTANCE.put("/quiz/toggle-visibility", {
        visibility,
        quiz_id: quiz?.id,
      });
      if (status === 200) {
        setQuizVisibility(visibility);
        ToastAndroid.show("Quiz visibility updated.", ToastAndroid.SHORT);
      }
    } catch {
      ToastAndroid.show("Error updating visibility.", ToastAndroid.SHORT);
    }
  };

  const renderAttempts = () =>
    quiz?.attempts.map((entry, index) => {
      const totalQuestions = entry.answer_data.length;
      const correctCount = entry.answer_data.reduce((acc, item) => {
        const { correctAnswers } = item.question;
        const userAnswers = item.user_answer;
        const isCorrect =
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((ans) => userAnswers.includes(ans));
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      return (
        <CustomView
          key={entry.id}
          variant="colorBase100"
          className="flex flex-row justify-between items-center p-4 rounded-2xl"
        >
          <CustomView className="flex flex-row gap-4">
            <CustomText>{index + 1}</CustomText>
            <CustomView>
              <CustomText variant="bold" className="text-xl">
                {user?.first_name} {user?.last_name}
              </CustomText>
              <CustomText>
                {dayjs(entry.completed_at).format("MMMM DD YYYY / hh:mm A")}
              </CustomText>
            </CustomView>
          </CustomView>
          <CustomText variant="bold" className="text-xl">
            {correctCount}/{totalQuestions}
          </CustomText>
        </CustomView>
      );
    });

  const renderLeaderboard = () =>
    quiz?.leaderboard.map((entry, index) => {
      const totalQuestions = entry.answer_data.length;
      const correctCount = entry.answer_data.reduce((acc, item) => {
        const { correctAnswers } = item.question;
        const userAnswers = item.user_answer;
        const isCorrect =
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((ans) => userAnswers.includes(ans));
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      return (
        <CustomView
          key={entry.id}
          variant="colorBase100"
          className="flex flex-row justify-between items-center p-4 rounded-2xl"
        >
          <CustomView className="flex flex-row gap-4">
            <CustomText>{index + 1}</CustomText>
            <CustomView>
              <CustomText variant="bold" className="text-xl">
                {entry.user.first_name} {entry.user.last_name}
              </CustomText>
              <CustomText>
                {dayjs(entry.completed_at).format("MMMM DD YYYY / hh:mm A")}
              </CustomText>
            </CustomView>
          </CustomView>
          <CustomText variant="bold" className="text-xl">
            {correctCount}/{totalQuestions}
          </CustomText>
        </CustomView>
      );
    });

  if (!quiz) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: currentScheme.colorBase200 }}
      >
        <CustomText>Loading quiz...</CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 p-4 gap-4"
      style={{
        backgroundColor: currentScheme.colorBase200,
      }}
    >
      <CustomView
        variant="colorBase200"
        className="flex flex-row justify-between items-center"
      >
        <Pressable onPress={() => navigate.goBack()}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={24} />
          </CustomText>
        </Pressable>
        <Pressable onPress={handleEditQuiz}>
          <CustomText>
            <MaterialCommunityIcons name="layers-edit" size={24} />
          </CustomText>
        </Pressable>
      </CustomView>

      <CustomView variant="colorBase100" className="gap-4 p-4 rounded-3xl">
        {quiz.is_ai_generated && (
          <View className="flex flex-row items-center gap-2">
            <CustomText className="opacity-50">
              <MaterialIcons name="info" size={16} />
            </CustomText>
            <CustomText className="opacity-50">AI-generated</CustomText>
          </View>
        )}
        <CustomText variant="black" className="text-4xl">
          {quiz.title || "Untitled"}
        </CustomText>
        <CustomText>{quiz.description || "No description provided"}</CustomText>
      </CustomView>

      <View className="flex flex-row gap-4">
        {quiz.attempts.length > 0 && (
          <CustomPressable
            className={clsx(
              "flex-1 items-center rounded-3xl",
              tabIndex === 0 ? "opacity-100" : "opacity-50"
            )}
            onPress={() => setTabIndex(0)}
          >
            <CustomText
              color={
                tabIndex === 0 ? "colorPrimaryContent" : "colorBaseContent"
              }
            >
              Your attempts
            </CustomText>
          </CustomPressable>
        )}
        <CustomPressable
          className={clsx(
            "flex-1 items-center rounded-3xl",
            tabIndex === 1 ? "opacity-100" : "opacity-50"
          )}
          onPress={() => setTabIndex(1)}
        >
          <CustomText
            color={tabIndex === 1 ? "colorPrimaryContent" : "colorBaseContent"}
          >
            Leaderboard
          </CustomText>
        </CustomPressable>
      </View>

      <ScrollView className="flex flex-col gap-4">
        {tabIndex === 0 ? renderAttempts() : renderLeaderboard()}
      </ScrollView>
      <CustomPressable
        className="flex flex-row gap-4 items-center justify-center rounded-3xl"
        onPress={handleAnswerQuiz}
      >
        <CustomText variant="bold" color="colorPrimaryContent">
          Start
        </CustomText>
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="arrow-forward" size={20} />
        </CustomText>
      </CustomPressable>
    </SafeAreaView>
  );
}
