import { basicComponentLibrary, type ComponentLibrary } from "@mcp-ui/client";
import { CustomButton } from "./CustomButton";
import { CustomCounter } from "./CustomCounter";

// カスタムコンポーネントライブラリの定義（基本ライブラリと統合）
export const extendedComponentLibrary: ComponentLibrary = {
  name: "extended-library",
  elements: [
    ...basicComponentLibrary.elements,
    {
      tagName: "custom-button",
      component: CustomButton,
      propMapping: {
        label: "label",
      },
      eventMapping: {
        press: "onPress",
      },
    },
    {
      tagName: "custom-counter",
      component: CustomCounter,
      propMapping: {
        label: "label",
      },
      eventMapping: {
        press: "onPress",
      },
    },
  ],
};

// リモート要素の定義（サーバー側で使用する要素の仕様）
export const customRemoteElements = [
  {
    tagName: "custom-button",
    remoteAttributes: ["label"],
    remoteEvents: ["press"],
  },
  {
    tagName: "custom-counter",
    remoteAttributes: ["label"],
    remoteEvents: ["press"],
  },
];
