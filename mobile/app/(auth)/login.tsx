import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";

import Entypo from "@expo/vector-icons/Entypo";

import { toast } from "sonner-native";
import { router } from "expo-router";
import { useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { isConnected } = useNetInfo();
  const { currentScheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  /**
   * Handles the login process for the user.
   *
   * - Checks for network connectivity and required credentials.
   * - Sends a login request to the API with the provided email and password.
   * - If the user is an admin, displays a toast message and prevents mobile login.
   * - If login is successful and the user is not an admin:
   *   - Fetches notes, flashcards, and quizzes in parallel.
   *   - Updates the authentication state with user data and fetched resources.
   *   - Navigates to the learner forum route.
   * - Displays appropriate toast messages for errors or missing information.
   * - Manages the logging-in state throughout the process.
   */
  const handleLogin = async () => {
    if (!isConnected) {
      toast("You're not connected to network connection.");
      return;
    }

    if (!email || !password) {
      toast("Email and password required.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const { data, status } = await _API_INSTANCE.post("auth/login", {
        email,
        password,
      });

      if (status === 200) {
        const { status } = await _API_INSTANCE.get("/users/check", {
          withCredentials: true,
        });

        if (data.is_admin) {
          toast("This is an admin account, please try logging in on desktop.");
          return;
        } else {
          const [notes, flashcard, quiz] = await Promise.all([
            _API_INSTANCE.get("/notes"),
            _API_INSTANCE.get("/flashcard"),
            _API_INSTANCE.get("/quiz"),
          ]);
          useAuth.setState((state) => {
            state.user = data;
            state.user!.notes = notes.data;
            state.user!.flashcards = flashcard.data;
            state.user!.quizzes = quiz.data;
          });
          router.dismissTo("/(learner)/(forum)");
        }
      }
    } catch (err: any) {
      toast(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView
      className="flex flex-1 px-6 py-4 gap-4"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <CustomText>
        <Entypo
          name="chevron-left"
          size={24}
          className=""
          onPress={() => router.replace("/")}
        />
      </CustomText>
      <View className="flex">
        <CustomText variant="black" className="text-5xl">
          Welcome back
        </CustomText>
        <CustomText className="opacity-50">
          Continue your learning journey.
        </CustomText>
      </View>
      <View className="flex flex-col gap-4">
        <View className="flex flex-col gap-1">
          <CustomText className="opacity-50">Email</CustomText>
          <CustomTextInput
            value={email}
            onChangeText={setEmail}
            className="rounded-xl"
          />
        </View>
        <View className="flex flex-col gap-1">
          <CustomText className="opacity-50">Password</CustomText>
          <CustomTextInput
            value={password}
            onChangeText={setPassword}
            className="rounded-xl"
            secureTextEntry={true}
          />
        </View>
        <View className="flex flex-col gap-4">
          <CustomPressable
            variant="colorPrimary"
            className="rounded-3xl"
            disabled={isLoggingIn}
            onPress={handleLogin}
          >
            <CustomText color="colorPrimaryContent" className="text-center">
              Login
            </CustomText>
          </CustomPressable>
        </View>
        <Pressable
          className="flex flex-row gap-2"
          onPress={() => router.push("/(auth)/register")}
        >
          <CustomText className="opacity-70">
            Don&apos;t have an account?
          </CustomText>
          <CustomText color="colorAccent">Register now</CustomText>
        </Pressable>
      </View>
      <View className="flex-1" />
      <Pressable className="self-center">
        <CustomText>Terms of use & Privacy and policy</CustomText>
      </Pressable>
    </SafeAreaView>
  );
}
