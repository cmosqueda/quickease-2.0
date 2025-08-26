import useTheme from "@/hooks/useTheme";
import {
  TenTapStartKit,
  HeadingBridge,
  BulletListBridge,
  OrderedListBridge,
  CodeBridge,
  BlockquoteBridge,
  CoreBridge,
} from "@10play/tentap-editor";

export const _HEADING_BRIDGE_THEME = `
    h1, h2, h3, h4, p {
        color: ${useTheme.getState().currentScheme.colorBaseContent};
    }
        
    h1 {
        font-size: 2.25rem;
    }
`;

export const _BULLET_LIST_BRIDGE_THEME = `
    ul {
        color: ${useTheme.getState().currentScheme.colorBaseContent};
        list-style: disc;
        padding-left: 1rem;
        list-style-position: outside;
    }
`;

export const _ORDERED_LIST_BRIDGE_THEME = `
   ul {
        color: ${useTheme.getState().currentScheme.colorBaseContent};
        list-style: decimal;
        padding-left: 1rem;
        list-style-position: outside;
    }
`;

export const _CODEBLOCK_BRIDGE_THEME = `
    code {
        background-color: ${useTheme.getState().currentScheme.colorBase300};
    }
`;

export const _BLOCKQUOTE_BRIDGE_THEME = `
    blockquote {
        color: ${useTheme.getState().currentScheme.colorBaseContent};
        padding: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        border-inline-start-width: 4px;
        width: fit-content;
        background-color: ${useTheme.getState().currentScheme.colorBase200};
    }
`;

const _EDITOR_BRIDGE_EXTENSIONS = [
  ...TenTapStartKit,
  HeadingBridge.configureCSS(_HEADING_BRIDGE_THEME),
  BulletListBridge.configureCSS(_BULLET_LIST_BRIDGE_THEME),
  OrderedListBridge.configureCSS(_ORDERED_LIST_BRIDGE_THEME),
  CodeBridge.configureCSS(_CODEBLOCK_BRIDGE_THEME),
  BlockquoteBridge.configureCSS(_BLOCKQUOTE_BRIDGE_THEME),
];

export default _EDITOR_BRIDGE_EXTENSIONS;
