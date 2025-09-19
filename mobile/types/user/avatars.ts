/**
 * USED FOR COMPONENTS NGA NAAY AVATARS, and para dali ra pag import sa useAssets
 * A mapping of avatar color names to their corresponding SVG asset imports.
 *
 * The keys represent the available avatar color options, and the values are the imported SVG assets
 * used for displaying user avatars in the application.
 *
 * @remarks
 * This map is used to dynamically select avatar images based on user preferences or settings.
 *
 * @example
 * ```typescript
 * const avatarAsset = _AVATAR_ASSET_MAP["blue"];
 * ```
 */
export const _AVATAR_ASSET_MAP: Record<string, any> = {
  blue: require("../../assets/images/avatars/blue.svg"),
  green: require("../../assets/images/avatars/green.svg"),
  orange: require("../../assets/images/avatars/orange.svg"),
  purple: require("../../assets/images/avatars/purple.svg"),
  black_green: require("../../assets/images/avatars/black_green.svg"),
  dark_blue: require("../../assets/images/avatars/dark_blue.svg"),
  gold: require("../../assets/images/avatars/gold.svg"),
  hot_pink: require("../../assets/images/avatars/hot_pink.svg"),
  red: require("../../assets/images/avatars/red.svg"),
  turquoise: require("../../assets/images/avatars/turquoise.svg"),
};
