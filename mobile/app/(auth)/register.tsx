import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";

import Entypo from "@expo/vector-icons/Entypo";

import { router } from "expo-router";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";

export default function Page() {
  const { currentScheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [tabIndex, setTabIndex] = useState(0);
  const pageViewRef = useRef<PagerView>(null);

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
          Create your account
        </CustomText>
        <CustomText className="opacity-50">
          Start your learning journey.
        </CustomText>
      </View>
      <View className="flex flex-row gap-2">
        <Pressable
          onPress={() => {
            setTabIndex(0);
            pageViewRef.current?.setPage(0);
          }}
          className="flex-1"
        >
          <CustomView
            className="rounded-full"
            variant={tabIndex == 0 ? "colorPrimary" : "colorBase300"}
            style={{ height: 6 }}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            setTabIndex(1);
            pageViewRef.current?.setPage(1);
          }}
          className="flex-1"
        >
          <CustomView
            className="rounded-full"
            style={{ height: 6 }}
            variant={tabIndex == 1 ? "colorPrimary" : "colorBase300"}
          />
        </Pressable>
      </View>
      <PagerView style={{ flex: 1 }} ref={pageViewRef} scrollEnabled={false}>
        <View className="flex flex-col gap-4" key={0}>
          <View className="flex flex-col gap-1">
            <CustomText className="opacity-50">First Name</CustomText>
            <CustomTextInput
              value={email}
              onChangeText={setEmail}
              className="rounded-xl"
            />
          </View>
          <View className="flex flex-col gap-1">
            <CustomText className="opacity-50">Last Name</CustomText>
            <CustomTextInput
              value={password}
              onChangeText={setPassword}
              className="rounded-xl"
              secureTextEntry
            />
          </View>

          <View className="flex flex-col gap-4">
            <CustomPressable
              variant="colorPrimary"
              className="rounded-3xl"
              onPress={() => {
                setTabIndex(1);
                pageViewRef.current?.setPage(1);
              }}
            >
              <CustomText
                color="colorPrimaryContent"
                className="text-center text-xl"
              >
                <Entypo name="chevron-right" size={24} />
              </CustomText>
            </CustomPressable>
          </View>
        </View>
        <View className="flex flex-col gap-4" key={1}>
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
          <View className="flex flex-col gap-4">
            <CustomPressable variant="colorPrimary" className="rounded-3xl">
              <CustomText
                color="colorPrimaryContent"
                className="text-center text-xl"
              >
                Register
              </CustomText>
            </CustomPressable>
          </View>
          <Pressable
            className="flex flex-row gap-2"
            onPress={() => router.push("/(auth)/login")}
          >
            <CustomText className="opacity-70">
              Already have an account?
            </CustomText>
            <CustomText color="colorAccent">Login</CustomText>
          </Pressable>
        </View>
      </PagerView>
      <View className="flex-1" />
      <Pressable className="self-center">
        <CustomText>Terms of use & Privacy and policy</CustomText>
      </Pressable>
    </SafeAreaView>
  );
}
