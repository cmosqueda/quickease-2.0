import useTheme from "@/hooks/useTheme";

import { StyleProp, ViewStyle } from "react-native";

import {
  RecursivePartial,
  RichText,
  useEditorBridge,
} from "@10play/tentap-editor";

import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";
import { useState } from "react";

export default function CustomRichText({
  content,
  dynamicHeight = true,
  editable = false,
  webviewTheme,
}: {
  content: any;
  dynamicHeight?: boolean;
  editable?: boolean;
  webviewTheme?: RecursivePartial<StyleProp<ViewStyle>>;
}) {
  const { currentScheme } = useTheme();

  const [isReady, setIsReady] = useState(false);

  const editor = useEditorBridge({
    theme: {
      webview: {
        backgroundColor: currentScheme.colorBase100,
        minHeight: 240,
        ...webviewTheme,
      },
    },
    bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
    dynamicHeight: dynamicHeight,
    editable: editable,
    initialContent: content ? content : "",
    avoidIosKeyboard: true,
  });

  if (editor) {
    return <RichText editor={editor} />;
  }
}
