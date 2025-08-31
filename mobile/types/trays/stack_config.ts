import useTheme from "@/hooks/useTheme";

const _STACK_CONFIG = {
  DismissibleStickToTopTray: {
    adjustForKeyboard: true,
    dismissOnBackdropPress: true,
    stickToTop: true,
    trayStyles: {
      backgroundColor: useTheme.getState().currentScheme.colorBase100,
    },
    backdropStyles: { backgroundColor: "rgba(0,0,0,0.7)" },
  },
  DismissibleRoundedNoMarginAndSpacingTray: {
    dismissOnBackdropPress: true,
    adjustForKeyboard: true,
    trayStyles: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: useTheme.getState().currentScheme.colorBase100,
    },
    backdropStyles: { backgroundColor: "rgba(0,0,0,0.5)" },
    horizontalSpacing: 0,
  },
  RoundedNoMarginAndSpacingTray: {
    adjustForKeyboard: true,
    trayStyles: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: useTheme.getState().currentScheme.colorBase100,
    },
    backdropStyles: { backgroundColor: "rgba(0,0,0,0.5)" },
    horizontalSpacing: 0,
  },
};

export default _STACK_CONFIG;
