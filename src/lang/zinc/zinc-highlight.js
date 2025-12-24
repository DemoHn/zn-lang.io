import { styleTags, tags } from "@lezer/highlight"

export const highlighting = styleTags({
    "关键字": tags.keyword,
    Identifier: tags.className,
    "标点符号": tags.brace,
    "运算符": tags.operator,
    "纯数值": tags.number,
    "行注释 块注释": tags.comment,
    Number: tags.number,
    "文本 文本内容": tags.className,
})