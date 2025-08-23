import useTheme from "@/hooks/useTheme";
import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";

import Entypo from "@expo/vector-icons/Entypo";

import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ToastAndroid, View } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { currentScheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      ToastAndroid.show("Email and password required.", ToastAndroid.SHORT);
      return;
    }
    setIsLoggingIn(true);

    try {
      const { data, status } = await _API_INSTANCE.post("auth/login", {
        email,
        password,
      });

      if (status === 200) {
        console.log(data, status);
        if (data.is_admin) {
          ToastAndroid.show(
            "This is an admin account, please try logging in on desktop.",
            ToastAndroid.SHORT
          );
          return;
        } else {
          router.replace("/(learner)/(forum)");
        }
      }
    } catch (err: any) {
      console.log(err);
      ToastAndroid.show(
        err?.response?.data?.message || "Something went wrong.",
        ToastAndroid.SHORT
      );
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
            secureTextEntry
          />
        </View>
        <Pressable className="self-end">
          <CustomText className="opacity-70">Forgot password?</CustomText>
        </Pressable>
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
