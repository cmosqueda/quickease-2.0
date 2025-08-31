# `Font.ts`

## Overview

Defines the font family keys used with **Expo Google Fonts** (Gabarito).  
This allows consistent usage of font variants across the app.

## Exports

- **`_FONTS`** _(default)_  
  An object containing Gabarito font variants:
  - `Gabarito_400Regular`
  - `Gabarito_500Medium`
  - `Gabarito_600SemiBold`
  - `Gabarito_700Bold`
  - `Gabarito_800ExtraBold`
  - `Gabarito_900Black`

## Example Usage

```ts
import _FONTS from "@/types/Font";
import { useFonts, Gabarito_400Regular, Gabarito_700Bold } from "@expo-google-fonts/gabarito";

export default function App() {
  const [fontsLoaded] = useFonts({
    [_FONTS.Gabarito_400Regular]: Gabarito_400Regular,
    [_FONTS.Gabarito_700Bold]: Gabarito_700Bold,
  });

  if (!fontsLoaded) return null;

  return <Text style={{ fontFamily: _FONTS.Gabarito_700Bold }}>Hello</Text>;
}
```

# `./types/TenTapThemes.tsx`

## Overview

Defines custom theme bridges for the **TenTap Editor** (`@10play/tentap-editor`) with support for Gabarito fonts and `useTheme` integration.

## Key Exports

- **`_HEADING_BRIDGE_THEME`**  
  CSS theme for headings, using Gabarito font and app’s current theme color.

- **`_BULLET_LIST_BRIDGE_THEME`**  
  CSS theme for unordered lists with consistent padding and color.

- **`_ORDERED_LIST_BRIDGE_THEME`**  
  CSS theme for ordered lists styled with decimal numbering.

- **`_CODEBLOCK_BRIDGE_THEME`**  
  CSS theme for code blocks with background color styling.

- **`_BLOCKQUOTE_BRIDGE_THEME`**  
  CSS theme for blockquotes with padding, background, and border styling.

- **`_EDITOR_BRIDGE_EXTENSIONS`** _(default)_  
  Bundles the TenTap starter kit with all custom CSS bridge themes applied.

## Example Usage

```tsx
import { TenTapEditor } from "@10play/tentap-editor";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/TenTapThemes";

export default function Editor() {
  return (
    <TenTapEditor
      content="<p>Hello world!</p>"
      extensions={_EDITOR_BRIDGE_EXTENSIONS}
    />
  );
}
```

# `./types/Themes.ts`

## Overview

Defines **theme interfaces** for consistent color schemes and UI styling.  
Themes can be generated using the [daisyUI Theme Generator](https://daisyui.com/theme-generator/).

## Interfaces

### `Theme`

Describes a single theme object.

#### Properties

- **Metadata**
  - `name: string`
  - `prefersdark: boolean`
  - `colorscheme: "light" | "dark"`

- **Color Palette**
  - `colorBase100`, `colorBase200`, `colorBase300`, `colorBaseContent`
  - `colorPrimary`, `colorPrimaryContent`
  - `colorSecondary`, `colorSecondaryContent`
  - `colorAccent`, `colorAccentContent`
  - `colorNeutral`, `colorNeutralContent`
  - `colorInfo`, `colorInfoContent`
  - `colorSuccess`, `colorSuccessContent`
  - `colorWarning`, `colorWarningContent`
  - `colorError`, `colorErrorContent`

- **UI Tokens**
  - `radiusSelector`, `radiusField`, `radiusBox`
  - `sizeSelector`, `sizeField`
  - `border`

---

### `Themes`

Defines a map of multiple named themes:

- `light`, `dark`, `cupcake`, `bumblebee`, `emerald`, `retro`, `valentine`,  
  `luxury`, `dracula`, `autumn`, `coffee`, `winter`, `dim`, `nord`,  
  `sunset`, `rush`, `depth`, `nightowl`

## Example Usage

```ts
import type { Theme, Themes } from "@/types/Themes";

const customTheme: Theme = {
  name: "custom",
  prefersdark: false,
  colorscheme: "light",
  colorBase100: "#ffffff",
  colorBase200: "#f0f0f0",
  colorBase300: "#e0e0e0",
  colorBaseContent: "#000000",
  colorPrimary: "#1d4ed8",
  colorPrimaryContent: "#ffffff",
  colorSecondary: "#9333ea",
  colorSecondaryContent: "#ffffff",
  colorAccent: "#f97316",
  colorAccentContent: "#ffffff",
  colorNeutral: "#64748b",
  colorNeutralContent: "#ffffff",
  colorInfo: "#0ea5e9",
  colorInfoContent: "#ffffff",
  colorSuccess: "#22c55e",
  colorSuccessContent: "#ffffff",
  colorWarning: "#facc15",
  colorWarningContent: "#000000",
  colorError: "#ef4444",
  colorErrorContent: "#ffffff",
  radiusSelector: "0.25rem",
  radiusField: "0.375rem",
  radiusBox: "0.5rem",
  sizeSelector: "2rem",
  sizeField: "3rem",
  border: "1px",
};
```
