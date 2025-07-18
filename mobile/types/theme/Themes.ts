interface Theme {
  name: string;
  prefersdark: boolean;
  colorscheme: "light" | "dark";

  colorBase100: string;
  colorBase200: string;
  colorBase300: string;
  colorBaseContent: string;
  colorPrimary: string;
  colorPrimaryContent: string;
  colorSecondary: string;
  colorSecondaryContent: string;
  colorAccent: string;
  colorAccentContent: string;
  colorNeutral: string;
  colorNeutralContent: string;
  colorInfo: string;
  colorInfoContent: string;
  colorSuccess: string;
  colorSuccessContent: string;
  colorWarning: string;
  colorWarningContent: string;
  colorError: string;
  colorErrorContent: string;

  /* border radius */
  radiusSelector: string;
  radiusField: string;
  radiusBox: string;

  /* base sizes */
  sizeSelector: string;
  sizeField: string;

  /* border size */
  border: string;
}

interface Themes {
  light: Theme;
  dark: Theme;
  cupcake: Theme;
  bumblebee: Theme;
  emerald: Theme;
  retro: Theme;
  valentine: Theme;
  luxury: Theme;
  dracula: Theme;
  autumn: Theme;
  coffee: Theme;
  winter: Theme;
  dim: Theme;
  nord: Theme;
  sunset: Theme;
  rush: Theme;
  depth: Theme;
  nightowl: Theme;
}

const _THEMES: Themes = {
  light: {
    name: "light",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "#f9f6f2", // oklch(97% 0.013 17.38)
    colorBase200: "#f1e8e1", // oklch(93% 0.032 17.717)
    colorBase300: "#e5d9cf", // oklch(88% 0.062 18.334)
    colorBaseContent: "#3f2e2a", // oklch(39% 0.141 25.723)

    colorPrimary: "#5bb4df", // oklch(76% 0.188 70.08)
    colorPrimaryContent: "#f8fcff", // oklch(98% 0.022 95.277)

    colorSecondary: "#c66eaa", // oklch(70% 0.213 47.604)
    colorSecondaryContent: "#fcf9ff", // oklch(98% 0.016 73.684)

    colorAccent: "#60a0ff", // oklch(76% 0.233 130.85)
    colorAccentContent: "#fbfaff", // oklch(98% 0.031 120.757)

    colorNeutral: "#7c4c3a", // oklch(57% 0.245 27.325)
    colorNeutralContent: "#f9f6f2", // oklch(97% 0.013 17.38)

    colorInfo: "#4a88f7", // oklch(70% 0.165 254.624)
    colorInfoContent: "#2e2c64", // oklch(28% 0.091 267.935)

    colorSuccess: "#48c57e", // oklch(76% 0.177 163.223)
    colorSuccessContent: "#1f3f2e", // oklch(26% 0.051 172.552)

    colorWarning: "#ffc14d", // oklch(75% 0.183 55.934)
    colorWarningContent: "#45341e", // oklch(26% 0.079 36.259)

    colorError: "#f35879", // oklch(71% 0.202 349.761)
    colorErrorContent: "#4c2022", // oklch(28% 0.109 3.907)

    // Border radius
    radiusSelector: "0rem",
    radiusField: "0.5rem",
    radiusBox: "0.25rem",

    // Sizes
    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    // Border size
    border: "1px",
  },
  dark: {
    name: "dark",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(28, 27, 49)",
    colorBase200: "rgb(26, 25, 47)",
    colorBase300: "rgb(24, 23, 46)",
    colorBaseContent: "rgb(250, 250, 255)",

    colorPrimary: "rgb(133, 77, 206)",
    colorPrimaryContent: "rgb(245, 243, 255)",

    colorSecondary: "rgb(203, 76, 104)",
    colorSecondaryContent: "rgb(245, 231, 237)",

    colorAccent: "rgb(137, 227, 189)",
    colorAccentContent: "rgb(88, 124, 106)",

    colorNeutral: "rgb(15, 13, 24)",
    colorNeutralContent: "rgb(233, 233, 238)",

    colorInfo: "rgb(98, 142, 255)",
    colorInfoContent: "rgb(63, 72, 123)",

    colorSuccess: "rgb(70, 213, 135)",
    colorSuccessContent: "rgb(74, 105, 89)",

    colorWarning: "rgb(255, 205, 106)",
    colorWarningContent: "rgb(124, 95, 62)",

    colorError: "rgb(240, 93, 98)",
    colorErrorContent: "rgb(85, 47, 48)",

    radiusSelector: "0.5rem",
    radiusField: "0.25rem",
    radiusBox: "0.5rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  cupcake: {
    name: "cupcake",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(250, 248, 244)",
    colorBase200: "rgb(242, 237, 230)",
    colorBase300: "rgb(236, 231, 222)",
    colorBaseContent: "rgb(46, 39, 68)",

    colorPrimary: "rgb(173, 243, 233)",
    colorPrimaryContent: "rgb(61, 95, 93)",

    colorSecondary: "rgb(249, 210, 224)",
    colorSecondaryContent: "rgb(113, 41, 47)",

    colorAccent: "rgb(253, 233, 199)",
    colorAccentContent: "rgb(111, 69, 35)",

    colorNeutral: "rgb(39, 38, 50)",
    colorNeutralContent: "rgb(234, 234, 238)",

    colorInfo: "rgb(112, 156, 255)",
    colorInfoContent: "rgb(63, 72, 123)",

    colorSuccess: "rgb(115, 229, 161)",
    colorSuccessContent: "rgb(47, 76, 62)",

    colorWarning: "rgb(255, 227, 162)",
    colorWarningContent: "rgb(80, 61, 38)",

    colorError: "rgb(232, 111, 102)",
    colorErrorContent: "rgb(85, 47, 48)",

    radiusSelector: "1rem",
    radiusField: "2rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "2px",
  },
  bumblebee: {
    name: "bumblebee",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(255, 255, 255)",
    colorBase200: "rgb(247, 247, 247)",
    colorBase300: "rgb(234, 234, 234)",
    colorBaseContent: "rgb(51, 51, 51)",

    colorPrimary: "rgb(255, 233, 112)",
    colorPrimaryContent: "rgb(128, 90, 55)",

    colorSecondary: "rgb(255, 205, 106)",
    colorSecondaryContent: "rgb(112, 76, 48)",

    colorAccent: "rgb(0, 0, 0)",
    colorAccentContent: "rgb(255, 255, 255)",

    colorNeutral: "rgb(88, 85, 65)",
    colorNeutralContent: "rgb(235, 235, 221)",

    colorInfo: "rgb(112, 156, 255)",
    colorInfoContent: "rgb(89, 105, 155)",

    colorSuccess: "rgb(70, 213, 135)",
    colorSuccessContent: "rgb(74, 105, 89)",

    colorWarning: "rgb(255, 227, 162)",
    colorWarningContent: "rgb(124, 95, 62)",

    colorError: "rgb(229, 111, 85)",
    colorErrorContent: "rgb(100, 65, 59)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  emerald: {
    name: "emerald",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(255, 255, 255)",
    colorBase200: "rgb(237, 237, 237)",
    colorBase300: "rgb(219, 219, 219)",
    colorBaseContent: "rgb(66, 70, 115)",

    colorPrimary: "rgb(114, 222, 166)",
    colorPrimaryContent: "rgb(52, 86, 60)",

    colorSecondary: "rgb(105, 114, 205)",
    colorSecondaryContent: "rgb(255, 255, 255)",

    colorAccent: "rgb(239, 196, 143)",
    colorAccentContent: "rgb(0, 0, 0)",

    colorNeutral: "rgb(66, 70, 115)",
    colorNeutralContent: "rgb(250, 250, 253)",

    colorInfo: "rgb(112, 156, 255)",
    colorInfoContent: "rgb(0, 0, 0)",

    colorSuccess: "rgb(107, 192, 140)",
    colorSuccessContent: "rgb(0, 0, 0)",

    colorWarning: "rgb(255, 217, 130)",
    colorWarningContent: "rgb(0, 0, 0)",

    colorError: "rgb(233, 109, 90)",
    colorErrorContent: "rgb(0, 0, 0)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  retro: {
    name: "retro",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(235, 228, 202)",
    colorBase200: "rgb(226, 213, 192)",
    colorBase300: "rgb(214, 197, 179)",
    colorBaseContent: "rgb(102, 76, 45)",

    colorPrimary: "rgb(214, 152, 112)",
    colorPrimaryContent: "rgb(100, 65, 59)",

    colorSecondary: "rgb(222, 245, 218)",
    colorSecondaryContent: "rgb(92, 133, 113)",

    colorAccent: "rgb(235, 203, 153)",
    colorAccentContent: "rgb(102, 76, 45)",

    colorNeutral: "rgb(109, 104, 89)",
    colorNeutralContent: "rgb(224, 220, 211)",

    colorInfo: "rgb(112, 130, 255)",
    colorInfoContent: "rgb(245, 247, 255)",

    colorSuccess: "rgb(101, 186, 181)",
    colorSuccessContent: "rgb(245, 247, 255)",

    colorWarning: "rgb(220, 153, 89)",
    colorWarningContent: "rgb(245, 247, 255)",

    colorError: "rgb(229, 111, 85)",
    colorErrorContent: "rgb(112, 76, 48)",

    radiusSelector: "0.25rem",
    radiusField: "0.25rem",
    radiusBox: "0.5rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  valentine: {
    name: "valentine",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(255, 236, 240)",
    colorBase200: "rgb(249, 218, 226)",
    colorBase300: "rgb(238, 186, 205)",
    colorBaseContent: "rgb(156, 38, 46)",

    colorPrimary: "rgb(203, 76, 104)",
    colorPrimaryContent: "rgb(255, 255, 255)",

    colorSecondary: "rgb(188, 82, 193)",
    colorSecondaryContent: "rgb(250, 231, 246)",

    colorAccent: "rgb(182, 200, 255)",
    colorAccentContent: "rgb(89, 105, 155)",

    colorNeutral: "rgb(109, 45, 46)",
    colorNeutralContent: "rgb(238, 186, 205)",

    colorInfo: "rgb(194, 234, 255)",
    colorInfoContent: "rgb(86, 102, 153)",

    colorSuccess: "rgb(199, 247, 210)",
    colorSuccessContent: "rgb(84, 128, 110)",

    colorWarning: "rgb(255, 205, 106)",
    colorWarningContent: "rgb(73, 55, 36)",

    colorError: "rgb(207, 76, 55)",
    colorErrorContent: "rgb(250, 244, 237)",

    radiusSelector: "1rem",
    radiusField: "2rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  luxury: {
    name: "luxury",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(37, 36, 40)",
    colorBase200: "rgb(53, 51, 58)",
    colorBase300: "rgb(61, 59, 66)",
    colorBaseContent: "rgb(255, 226, 142)",

    colorPrimary: "rgb(255, 255, 255)",
    colorPrimaryContent: "rgb(51, 51, 51)",

    colorSecondary: "rgb(94, 79, 138)",
    colorSecondaryContent: "rgb(234, 229, 243)",

    colorAccent: "rgb(120, 77, 97)",
    colorAccentContent: "rgb(243, 240, 244)",

    colorNeutral: "rgb(66, 56, 41)",
    colorNeutralContent: "rgb(250, 236, 230)",

    colorInfo: "rgb(173, 215, 255)",
    colorInfoContent: "rgb(41, 46, 66)",

    colorSuccess: "rgb(158, 248, 184)",
    colorSuccessContent: "rgb(42, 64, 52)",

    colorWarning: "rgb(255, 220, 143)",
    colorWarningContent: "rgb(47, 35, 19)",

    colorError: "rgb(235, 95, 63)",
    colorErrorContent: "rgb(37, 24, 18)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  dracula: {
    name: "dracula",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(74, 72, 87)",
    colorBase200: "rgb(69, 67, 80)",
    colorBase300: "rgb(64, 62, 75)",
    colorBaseContent: "rgb(255, 254, 252)",

    colorPrimary: "rgb(255, 85, 113)",
    colorPrimaryContent: "rgb(39, 19, 25)",

    colorSecondary: "rgb(244, 106, 255)",
    colorSecondaryContent: "rgb(38, 20, 28)",

    colorAccent: "rgb(250, 230, 133)",
    colorAccentContent: "rgb(43, 29, 18)",

    colorNeutral: "rgb(104, 92, 110)",
    colorNeutralContent: "rgb(240, 236, 233)",

    colorInfo: "rgb(202, 234, 255)",
    colorInfoContent: "rgb(45, 50, 66)",

    colorSuccess: "rgb(198, 253, 182)",
    colorSuccessContent: "rgb(44, 65, 52)",

    colorWarning: "rgb(255, 245, 175)",
    colorWarningContent: "rgb(49, 35, 21)",

    colorError: "rgb(224, 72, 57)",
    colorErrorContent: "rgb(35, 23, 18)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  autumn: {
    name: "autumn",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(244, 244, 244)",
    colorBase200: "rgb(227, 227, 227)",
    colorBase300: "rgb(210, 210, 210)",
    colorBaseContent: "rgb(49, 49, 49)",

    colorPrimary: "rgb(168, 63, 34)",
    colorPrimaryContent: "rgb(255, 239, 225)",

    colorSecondary: "rgb(211, 90, 42)",
    colorSecondaryContent: "rgb(39, 20, 10)",

    colorAccent: "rgb(255, 194, 94)",
    colorAccentContent: "rgb(43, 28, 17)",

    colorNeutral: "rgb(145, 120, 94)",
    colorNeutralContent: "rgb(245, 239, 235)",

    colorInfo: "rgb(163, 201, 255)",
    colorInfoContent: "rgb(41, 51, 66)",

    colorSuccess: "rgb(119, 186, 148)",
    colorSuccessContent: "rgb(39, 52, 45)",

    colorWarning: "rgb(255, 207, 105)",
    colorWarningContent: "rgb(48, 34, 18)",

    colorError: "rgb(173, 41, 30)",
    colorErrorContent: "rgb(245, 238, 233)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  coffee: {
    name: "coffee",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(61, 53, 62)",
    colorBase200: "rgb(53, 47, 55)",
    colorBase300: "rgb(41, 36, 43)",
    colorBaseContent: "rgb(239, 214, 149)",

    colorPrimary: "rgb(234, 176, 83)",
    colorPrimaryContent: "rgb(37, 30, 17)",

    colorSecondary: "rgb(82, 111, 138)",
    colorSecondaryContent: "rgb(242, 246, 245)",

    colorAccent: "rgb(100, 137, 171)",
    colorAccentContent: "rgb(244, 247, 249)",

    colorNeutral: "rgb(41, 36, 41)",
    colorNeutralContent: "rgb(232, 232, 232)",

    colorInfo: "rgb(200, 236, 200)",
    colorInfoContent: "rgb(40, 45, 39)",

    colorSuccess: "rgb(210, 243, 181)",
    colorSuccessContent: "rgb(39, 44, 33)",

    colorWarning: "rgb(255, 228, 143)",
    colorWarningContent: "rgb(47, 36, 19)",

    colorError: "rgb(240, 138, 84)",
    colorErrorContent: "rgb(39, 27, 19)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  winter: {
    name: "winter",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(255, 255, 255)",
    colorBase200: "rgb(248, 248, 255)",
    colorBase300: "rgb(239, 239, 255)",
    colorBaseContent: "rgb(105, 122, 202)",

    colorPrimary: "rgb(145, 163, 255)",
    colorPrimaryContent: "rgb(243, 245, 255)",

    colorSecondary: "rgb(118, 114, 204)",
    colorSecondaryContent: "rgb(243, 245, 255)",

    colorAccent: "rgb(203, 120, 170)",
    colorAccentContent: "rgb(34, 14, 28)",

    colorNeutral: "rgb(49, 52, 84)",
    colorNeutralContent: "rgb(239, 241, 249)",

    colorInfo: "rgb(224, 239, 255)",
    colorInfoContent: "rgb(45, 50, 66)",

    colorSuccess: "rgb(203, 234, 220)",
    colorSuccessContent: "rgb(41, 47, 43)",

    colorWarning: "rgb(255, 242, 206)",
    colorWarningContent: "rgb(46, 40, 27)",

    colorError: "rgb(233, 130, 109)",
    colorErrorContent: "rgb(37, 23, 18)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  dim: {
    name: "dim",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(79, 77, 103)",
    colorBase200: "rgb(71, 69, 93)",
    colorBase300: "rgb(66, 64, 87)",
    colorBaseContent: "rgb(232, 240, 255)",

    colorPrimary: "rgb(216, 255, 204)",
    colorPrimaryContent: "rgb(44, 54, 43)",

    colorSecondary: "rgb(255, 199, 134)",
    colorSecondaryContent: "rgb(37, 25, 18)",

    colorAccent: "rgb(237, 157, 243)",
    colorAccentContent: "rgb(38, 23, 34)",

    colorNeutral: "rgb(64, 62, 82)",
    colorNeutralContent: "rgb(232, 240, 255)",

    colorInfo: "rgb(224, 242, 255)",
    colorInfoContent: "rgb(44, 53, 61)",

    colorSuccess: "rgb(224, 255, 213)",
    colorSuccessContent: "rgb(44, 54, 44)",

    colorWarning: "rgb(255, 248, 189)",
    colorWarningContent: "rgb(44, 39, 27)",

    colorError: "rgb(241, 170, 125)",
    colorErrorContent: "rgb(42, 29, 22)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  nord: {
    name: "nord",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(243, 246, 255)",
    colorBase200: "rgb(238, 243, 255)",
    colorBase300: "rgb(229, 240, 255)",
    colorBaseContent: "rgb(66, 74, 103)",

    colorPrimary: "rgb(146, 172, 255)",
    colorPrimaryContent: "rgb(30, 38, 59)",

    colorSecondary: "rgb(181, 202, 255)",
    colorSecondaryContent: "rgb(35, 42, 61)",

    colorAccent: "rgb(205, 229, 255)",
    colorAccentContent: "rgb(39, 47, 61)",

    colorNeutral: "rgb(115, 128, 166)",
    colorNeutralContent: "rgb(229, 240, 255)",

    colorInfo: "rgb(229, 153, 222)",
    colorInfoContent: "rgb(39, 31, 48)",

    colorSuccess: "rgb(196, 245, 181)",
    colorSuccessContent: "rgb(39, 47, 35)",

    colorWarning: "rgb(255, 229, 154)",
    colorWarningContent: "rgb(44, 36, 26)",

    colorError: "rgb(179, 58, 50)",
    colorErrorContent: "rgb(31, 20, 16)",

    radiusSelector: "1rem",
    radiusField: "0.25rem",
    radiusBox: "0.5rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  sunset: {
    name: "sunset",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(56, 60, 84)",
    colorBase200: "rgb(51, 55, 78)",
    colorBase300: "rgb(46, 50, 72)",
    colorBaseContent: "rgb(240, 244, 255)",

    colorPrimary: "rgb(247, 149, 70)",
    colorPrimaryContent: "rgb(38, 27, 16)",

    colorSecondary: "rgb(255, 135, 113)",
    colorSecondaryContent: "rgb(37, 24, 20)",

    colorAccent: "rgb(237, 133, 255)",
    colorAccentContent: "rgb(36, 22, 35)",

    colorNeutral: "rgb(66, 70, 94)",
    colorNeutralContent: "rgb(179, 186, 211)",

    colorInfo: "rgb(220, 240, 255)",
    colorInfoContent: "rgb(44, 50, 63)",

    colorSuccess: "rgb(220, 255, 229)",
    colorSuccessContent: "rgb(44, 50, 44)",

    colorWarning: "rgb(255, 243, 180)",
    colorWarningContent: "rgb(44, 40, 27)",

    colorError: "rgb(255, 215, 205)",
    colorErrorContent: "rgb(43, 38, 25)",

    radiusSelector: "1rem",
    radiusField: "0.5rem",
    radiusBox: "1rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  rush: {
    name: "rush",
    prefersdark: false,
    colorscheme: "light",

    colorBase100: "rgb(247, 246, 255)",
    colorBase200: "rgb(237, 233, 255)",
    colorBase300: "rgb(222, 216, 255)",
    colorBaseContent: "rgb(84, 107, 209)",

    colorPrimary: "rgb(138, 153, 255)",
    colorPrimaryContent: "rgb(255, 255, 255)",

    colorSecondary: "rgb(152, 132, 255)",
    colorSecondaryContent: "rgb(245, 239, 255)",

    colorAccent: "rgb(187, 170, 255)",
    colorAccentContent: "rgb(255, 255, 255)",

    colorNeutral: "rgb(160, 153, 240)",
    colorNeutralContent: "rgb(247, 246, 255)",

    colorInfo: "rgb(180, 201, 255)",
    colorInfoContent: "rgb(74, 101, 188)",

    colorSuccess: "rgb(204, 252, 180)",
    colorSuccessContent: "rgb(66, 110, 74)",

    colorWarning: "rgb(243, 226, 142)",
    colorWarningContent: "rgb(90, 56, 34)",

    colorError: "rgb(229, 109, 74)",
    colorErrorContent: "rgb(81, 36, 30)",

    radiusSelector: "0.5rem",
    radiusField: "0.5rem",
    radiusBox: "0.5rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  depth: {
    name: "depth",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(74, 101, 188)",
    colorBase200: "rgb(101, 133, 212)",
    colorBase300: "rgb(114, 150, 217)",
    colorBaseContent: "rgb(247, 247, 255)",

    colorPrimary: "rgb(168, 198, 255)",
    colorPrimaryContent: "rgb(250, 250, 253)",

    colorSecondary: "rgb(123, 155, 223)",
    colorSecondaryContent: "rgb(250, 255, 252)",

    colorAccent: "rgb(168, 198, 255)",
    colorAccentContent: "rgb(255, 255, 255)",

    colorNeutral: "rgb(146, 170, 217)",
    colorNeutralContent: "rgb(250, 253, 255)",

    colorInfo: "rgb(144, 183, 255)",
    colorInfoContent: "rgb(247, 246, 255)",

    colorSuccess: "rgb(212, 255, 176)",
    colorSuccessContent: "rgb(250, 255, 229)",

    colorWarning: "rgb(243, 226, 142)",
    colorWarningContent: "rgb(250, 250, 232)",

    colorError: "rgb(158, 42, 40)",
    colorErrorContent: "rgb(247, 246, 255)",

    radiusSelector: "0.5rem",
    radiusField: "0.5rem",
    radiusBox: "0.5rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
  nightowl: {
    name: "nightowl",
    prefersdark: false,
    colorscheme: "dark",

    colorBase100: "rgb(31, 34, 62)",
    colorBase200: "rgb(51, 56, 96)",
    colorBase300: "rgb(68, 75, 108)",
    colorBaseContent: "rgb(245, 246, 252)",

    colorPrimary: "rgb(148, 178, 255)",
    colorPrimaryContent: "rgb(250, 253, 255)",

    colorSecondary: "rgb(165, 142, 255)",
    colorSecondaryContent: "rgb(64, 67, 113)",

    colorAccent: "rgb(222, 230, 255)",
    colorAccentContent: "rgb(33, 34, 66)",

    colorNeutral: "rgb(68, 75, 108)",
    colorNeutralContent: "rgb(250, 250, 254)",

    colorInfo: "rgb(144, 183, 255)",
    colorInfoContent: "rgb(247, 247, 255)",

    colorSuccess: "rgb(165, 235, 148)",
    colorSuccessContent: "rgb(250, 255, 243)",

    colorWarning: "rgb(233, 210, 145)",
    colorWarningContent: "rgb(250, 247, 224)",

    colorError: "rgb(158, 42, 40)",
    colorErrorContent: "rgb(247, 246, 255)",

    radiusSelector: "0.5rem",
    radiusField: "0.5rem",
    radiusBox: "0.5rem",

    sizeSelector: "0.25rem",
    sizeField: "0.25rem",

    border: "1px",
  },
};

export default _THEMES;
