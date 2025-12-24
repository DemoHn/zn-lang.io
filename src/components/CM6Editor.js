import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { vsCodeLight } from '@fsegurai/codemirror-theme-bundle';
import { zinc } from '../lang/zinc/zinc-language'

const EditorBox = styled.div`
  .cm-editor {
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    font-family: 'Fira Code', 'Consolas', 'Microsoft YaHei', monospace;
    transition: border-color 0.2s ease;
  }

  .cm-gutters {
    padding-right: 0px;
  }

  .cm-lineNumbers .cm-gutterElement {
    padding: 0 0px 0 10px;
  }

  .cm-editor:hover {
    border-color: #bcbcbc;
  }

  .cm-scroller {
    overflow: auto;
    font-family: inherit;
  }

  .cm-disabled {
    background-color: rgba(248, 248, 242, 0.5);
    opacity: 0.9;
  }

  .cm-line {
    whitespace: pre-wrap;
    word-break: break-word;
  }
`;

const CM6Editor = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const editor = useRef();
  const view = useRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!editor.current) return;

    const lineHeight = 1.78 * 0.9
    const maxLines = 20;
    const editorHeight = `${maxLines * lineHeight}em`;

    // 创建编辑器主题扩展，设置固定高度和滚动条
    const fixedHeightTheme = EditorView.theme({
      '&': {
        height: editorHeight,
        overflow: 'auto'
      },
      '.cm-content': {
        padding: 0,
        minHeight: editorHeight,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      },
    });

    // 创建自定义Tab键处理，插入4个空格
    const insertSpaces = ({ state, dispatch }) => {
      if (state.readOnly) return false;
      
      const spaces = "    "; // 4个空格
      dispatch(state.replaceSelection(spaces));
      return true;
    };

    // 创建编辑器更新监听器
    const updateListener = EditorView.updateListener.of((viewUpdate) => {
      if (viewUpdate.docChanged && onChange) {
        const newDoc = viewUpdate.state.doc.toString();
        onChange(newDoc);
      }
    });

    // 创建编辑器状态
    const startState = EditorState.create({
      doc: value || '',
      extensions: [
        basicSetup,
        keymap.of([
          ...defaultKeymap.filter(key => key.key !== "Tab"), // 移除默认Tab行为
          { key: "Tab", run: insertSpaces }, // 添加自定义Tab行为
        ]),
        EditorView.lineWrapping, // 启用自动换行
        vsCodeLight,
        zinc(),
        fixedHeightTheme,
        updateListener,
      ]
    });

    // 创建编辑器视图
    view.current = new EditorView({
      state: startState,
      parent: editor.current,
    });

    setIsReady(true);

    // 清理函数
    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = null;
      }
    };
  }, []);

  // 当 value 变化时更新编辑器内容
  useEffect(() => {
    if (view.current && value !== undefined) {
      const currentDoc = view.current.state.doc.toString();
      if (currentDoc !== value) {
        view.current.dispatch({
          changes: {
            from: 0,
            to: currentDoc.length,
            insert: value
          }
        });
      }
    }
  }, [value]);

  return (
    <EditorBox>
      <div ref={editor} className={readOnly ? 'cm-disabled' : ''} />
    </EditorBox>
  );
};

export default CM6Editor;