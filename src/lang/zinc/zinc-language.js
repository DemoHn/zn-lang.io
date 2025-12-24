import { LRLanguage, LanguageSupport } from '@codemirror/language';
import { parser } from './zinc-parser.js';
import { highlighting } from "./zinc-highlight.js"


// 创建 Zinc 语言
export const zincLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      highlighting,
    ]
  }),
  languageData: {
    commentTokens: { line: "//" },
    indentOnInput: /^\s*[\}\]\)]$/,
    //closeBrackets: { brackets: ["(", "[", "{", "'", '"', '`'] }
  }
});

// 创建语言支持
export function zinc() {
  return new LanguageSupport(zincLanguage);
}

// 导出解析器以供其他地方使用
export { parser };