import CustomText from "../CustomText";
import CustomView from "../CustomView";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Post } from "@/types/user/types";
import { router } from "expo-router";
import { View, Pressable } from "react-native";

const ViewPostAttachmentsTray = ({
  close,
  post,
}: {
  close: () => void;
  post: Post;
}) => {
  if (post.attachments.length > 0) {
    return (
      <CustomView
        variant="colorBase100"
        className="rounded-tr-3xl rounded-tl-3xl p-6 gap-4 flex-1"
      >
        <View className="flex flex-row items-center gap-4">
          <CustomText>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              onPress={close}
            />
          </CustomText>
          <CustomText variant="bold" className="text-xl">
            Attachments
          </CustomText>
        </View>
        {post.attachments.map((attachment) => {
          switch (attachment.resource_type) {
            case "NOTE":
              return (
                <Pressable
                  key={attachment.id}
                  onPress={() => {
                    close();
                    router.push({
                      pathname: "/(learner)/(note)/view/others/[id]",
                      params: { id: attachment.note!.id },
                    });
                  }}
                  className="flex flex-row gap-4 items-center"
                >
                  <CustomText>
                    <MaterialCommunityIcons name="note" size={28} />
                  </CustomText>
                  <CustomView
                    variant="colorBase200"
                    className="p-4 rounded-3xl flex-1"
                  >
                    <CustomText className="text-xl" variant="bold">
                      {attachment.note?.title}
                    </CustomText>
                  </CustomView>
                </Pressable>
              );
            case "FLASHCARD":
              return (
                <Pressable
                  key={attachment.id}
                  onPress={() => {
                    close();
                    router.push({
                      pathname: "/(learner)/(flashcard)/view/[id]",
                      params: { id: attachment.flashcard!.id },
                    });
                  }}
                  className="flex flex-row gap-4 items-center"
                >
                  <CustomText>
                    <MaterialCommunityIcons name="view-column" size={28} />
                  </CustomText>
                  <CustomView
                    variant="colorBase200"
                    className="p-4 rounded-3xl flex-1"
                  >
                    <CustomText className="text-xl" variant="bold">
                      {attachment.flashcard?.title}
                    </CustomText>
                  </CustomView>
                </Pressable>
              );
            case "QUIZ":
              return (
                <Pressable
                  key={attachment.id}
                  onPress={() => {
                    close();
                    router.push({
                      pathname: "/(learner)/(quiz)/view/[id]",
                      params: { id: attachment.quiz!.id },
                    });
                  }}
                  className="flex flex-row gap-4 items-center"
                >
                  <CustomText>
                    <MaterialCommunityIcons name="head-question" size={28} />
                  </CustomText>
                  <CustomView
                    variant="colorBase200"
                    className="p-4 rounded-3xl flex-1"
                  >
                    <CustomText className="text-xl" variant="bold">
                      {attachment.quiz?.title}
                    </CustomText>
                  </CustomView>
                </Pressable>
              );
          }
        })}
      </CustomView>
    );
  }
};

export default ViewPostAttachmentsTray;
