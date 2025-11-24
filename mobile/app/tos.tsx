import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import useTheme from "@/hooks/useTheme";
import { router } from "expo-router";

const ListItem = ({
  title,
  content,
  boldContent = [],
}: {
  title: string;
  content: string;
  boldContent?: string[];
}) => {
  const renderContent = () => {
    if (!boldContent.length) return <CustomText>{content}</CustomText>;

    let parts = [content];
    boldContent.forEach((phrase) => {
      const newParts: any[] = [];
      parts.forEach((part) => {
        if (typeof part === "string" && part.includes(phrase)) {
          const split = part.split(phrase);
          for (let i = 0; i < split.length; i++) {
            if (i > 0)
              newParts.push(
                <CustomText key={phrase + i} variant="bold">
                  {phrase}
                </CustomText>
              );
            if (split[i]) newParts.push(split[i]);
          }
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return <CustomText>{parts}</CustomText>;
  };

  return (
    <View className="flex flex-row gap-4 mb-2">
      <CustomText>{"\u2022"}</CustomText>
      <View className="flex-1">
        <CustomText>
          <CustomText variant="bold">{title}</CustomText>
        </CustomText>
        {renderContent()}
      </View>
    </View>
  );
};

export default function TermsAndPrivacyPolicyModal() {
  const { currentScheme } = useTheme();

  return (
    <SafeAreaView
      className="flex flex-1 p-4 gap-6"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <CustomText onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} />
      </CustomText>

      <ScrollView contentContainerClassName="flex flex-col gap-3">
        <CustomText variant="black" className="text-2xl text-center">
          Privacy Policy
        </CustomText>

        <View className="items-center mb-2">
          <CustomText className="text-gray-500">
            <CustomText variant="bold">Effective Date:</CustomText> September
            25, 2025
          </CustomText>
        </View>

        <View>
          <CustomText>
            This Privacy Policy explains how{" "}
            <CustomText variant="bold">QuickEase</CustomText> (“the
            Application”, “the Service”, “we”, or “our”) collects, uses, and
            protects user information. The Application is developed as part of a{" "}
            <CustomText variant="bold">capstone project</CustomText> by students
            of University of Science and Technology of Southern Philippines and
            is not intended for commercial distribution.
          </CustomText>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            1. Information We Collect
          </CustomText>
          <CustomText>
            We collect only the information necessary for the proper functioning
            of the Application. This may include:
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="Personal Information:"
              content="such as name, email address, and login credentials when creating an account."
            />
            <ListItem
              title="Study Materials:"
              content="uploaded files (e.g., PDFs or text documents) used for AI-powered summarization and quiz generation."
            />
            <ListItem
              title="Usage Data:"
              content="interactions within the Application, including quiz results, progress tracking, and session history."
            />
            <ListItem
              title="Device Information (basic):"
              content="non-identifiable details such as device type and operating system to ensure compatibility."
            />
          </View>
          <CustomText className="mt-2">
            We do <CustomText variant="bold">not</CustomText> collect sensitive
            personal information such as government IDs, financial data, or
            precise location.
          </CustomText>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            2. How We Use Information
          </CustomText>
          <CustomText>
            The information collected is used{" "}
            <CustomText variant="bold">
              strictly for academic and functional purposes
            </CustomText>{" "}
            and is not intended for commercial exploitation. Specifically, we
            use data to:
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="Generate Study Aids:"
              content="Uploaded study materials are processed by the AI system to create summaries, quizzes, and other learning insights tailored to support the user’s academic needs."
            />
            <ListItem
              title="Track Learning Progress:"
              content="User activity, such as completed quizzes and in-app badge rewards, is monitored within the app to provide feedback and help students identify areas for improvement."
            />
            <ListItem
              title="Communicate with Users:"
              content="Personal information such as email addresses may be used to send essential notifications, including policy updates, system alerts, or academic feedback related to the app’s use."
            />
          </View>
          <CustomText className="mt-2">
            We will never use personal or academic data for advertising,
            marketing, or unrelated purposes.
          </CustomText>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            3. Data Storage and Retention
          </CustomText>
          <CustomText>
            We take careful steps to ensure that user data is managed
            responsibly and used only for the duration of this academic project:
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="Storage Location:"
              content="User data, including personal details, uploaded study materials, and quiz results, are secured in a PostgreSQL Neon instance cloud-based platform selected for project development."
            />
            <ListItem
              title="Retention Period:"
              content="Uploaded files, generated quizzes, and performance records will be retained only while the project is ongoing or until a user actively chooses to delete their account and associated content."
              boldContent={["only while the project is ongoing"]}
            />
            <ListItem
              title="End of Project Handling:"
              content="Upon conclusion of the capstone project, the Project Team may archive certain data in anonymized form or permanently delete all identifiable user information."
            />
            <ListItem
              title="User Control:"
              content="Users may request deletion of their personal information and uploaded materials at any time, and such requests will be honored promptly."
            />
          </View>
          <CustomText className="mt-2">
            While we implement appropriate measures to safeguard data, users
            should avoid uploading highly confidential or sensitive materials.
          </CustomText>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            4. Data Sharing and Disclosure
          </CustomText>
          <CustomText>
            We respect your privacy and handle data responsibly:
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="No Commercial Use:"
              content="User data is never sold, rented, or shared with external third parties for advertising, marketing, or commercial purposes."
            />
            <ListItem
              title="Limited Access:"
              content="Only the Project Team and designated faculty advisers may access user information, and solely for the purpose of academic evaluation, system improvement, and capstone project requirements."
            />
            <ListItem
              title="Legal or Institutional Compliance:"
              content="In rare cases, information may be disclosed if required to comply with applicable laws, school regulations, or academic integrity guidelines."
            />
          </View>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            5. AI Services
          </CustomText>
          <CustomText>
            The Application integrates{" "}
            <CustomText variant="bold">
              Gemini API (Google’s Generative AI)
            </CustomText>{" "}
            to support study functions:
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="Processing of Content:"
              content="Uploaded documents and study materials may be transmitted temporarily to the Gemini API in order to generate summaries, quizzes, flashcards, and insights."
            />
            <ListItem
              title="Third-Party Policies:"
              content="While we make efforts to safeguard information, users should note that Google’s Gemini API applies its own data handling and privacy practices, which may differ from this Privacy Policy."
              boldContent={["data handling and privacy practices"]}
            />
            <ListItem
              title="User Responsibility:"
              content="For this reason, we strongly encourage users not to upload highly sensitive or confidential materials."
            />
          </View>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            6. Data Security
          </CustomText>
          <CustomText>
            We strive to maintain the confidentiality and integrity of user
            information:
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="Protective Measures:"
              content="Reasonable technical and organizational safeguards (e.g., password protection, secure cloud storage) are implemented to reduce risks of unauthorized access, alteration, disclosure, or data loss."
            />
            <ListItem
              title="Project Limitation:"
              content="As this Application is developed as a student project, absolute data security cannot be guaranteed."
              boldContent={["absolute data security cannot be guaranteed"]}
            />
            <ListItem
              title="User Precaution:"
              content="Users are advised to upload only academic-related materials and avoid sensitive or personal files."
            />
          </View>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            7. Children’s Privacy
          </CustomText>
          <CustomText>We are committed to protecting younger users:</CustomText>
          <View className="pl-2">
            <ListItem
              title="Intended Audience:"
              content="The Application is designed primarily for students in higher education and older learners."
            />
            <ListItem
              title="Under 15 Use:"
              content="Children under the age of 15 may only use the Application under the supervision and consent of a parent, guardian, or teacher."
              boldContent={[
                "supervision and consent of a parent, guardian, or teacher",
              ]}
            />
            <ListItem
              title="Guardian Responsibility:"
              content="Supervising adults are responsible for ensuring that children’s data is handled appropriately in accordance with this Privacy Policy."
            />
          </View>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            8. Your Rights
          </CustomText>
          <CustomText>
            As a user, you maintain control over your information and have the
            following rights:
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="Access and Update:"
              content="You may review, correct, or update your personal information through your account settings."
            />
            <ListItem
              title="Data Deletion:"
              content="You may request deletion of your uploaded study materials, quiz results, or entire account at any time."
            />
            <ListItem
              title="Withdrawal:"
              content="You may stop using the Application whenever you choose. Account deletion will remove associated data, subject to academic reporting requirements."
            />
          </View>
        </View>

        <View className="gap-2">
          <CustomText variant="bold" className="text-xl">
            9. Changes to this Privacy Policy
          </CustomText>
          <View className="pl-2">
            <ListItem
              title="Policy Updates:"
              content="This Privacy Policy may be updated as needed to reflect project requirements, academic feedback, or system improvements."
            />
            <ListItem
              title="User Notification:"
              content="Any significant revisions will be communicated through the Application to ensure users are aware of changes."
            />
            <ListItem
              title="Continued Use:"
              content="By continuing to use the Application after updates, you acknowledge and accept the revised terms of this Privacy Policy."
            />
          </View>
        </View>

        <CustomView
          variant="colorBase200"
          className=" p-4 rounded-xl border border-gray-200 mt-4 gap-2"
        >
          <CustomText variant="bold" className="text-xl">
            10. Contact Us
          </CustomText>
          <CustomText>
            If you have any questions, feedback, or concerns about this Privacy
            Policy, you may reach out to the Project Team using the contact
            details below:
          </CustomText>

          <View className="mt-2 gap-1">
            <CustomText variant="bold" className="text-lg">
              Team Ikinamada
            </CustomText>
            <CustomText>
              <CustomText variant="bold">Members: </CustomText>
              Christine Mosqueda, Jhon Lloyd Viernes, Sherri Nicole Tilan,
              Jalanie Baraocor, Leann Christian Flores
            </CustomText>
            <CustomText className="italic mt-1 text-gray-600">
              Capstone Project Team – University of Science and Technology of
              Southern Philippines
            </CustomText>
            <CustomText className="mt-2">
              <CustomText variant="bold">Email: </CustomText>
              <CustomText className="text-blue-600 underline">
                quickease.mail@gmail.com
              </CustomText>
            </CustomText>
          </View>
        </CustomView>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
