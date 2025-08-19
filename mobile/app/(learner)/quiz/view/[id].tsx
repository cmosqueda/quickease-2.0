import useTheme from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { currentScheme } = useTheme();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentScheme.colorBase100 }}
    ></SafeAreaView>
  );
}
