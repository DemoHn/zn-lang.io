import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { githubLight } from '@fsegurai/codemirror-theme-bundle';
import { zinc } from '@site/src/lang/zinc/zinc-language';

const EditorContainer = styled.div`
  background: #f5f5f5;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 80%;
  max-width: 630px;
  margin: 2rem auto;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const EditorHeader = styled.div`
  background: #eeeeee;
  padding: 0.5rem;
  display: flex;
  align-items: center;
`;

const WindowButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-left: 8px;
`;

const Button = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const EditorContent = styled.pre`
  padding: 0.5rem;
  margin: 0;
  background: #ffffff !important;
  color: #333333;
  overflow-x: auto;
  text-align: left;
  font-family: 'Fira Code', 'Consolas', 'Microsoft YaHei', monospace !important;
  font-size: 0.9rem !important;
  line-height: 1.4 !important;

  & code {
    font-family: inherit;
    background: transparent !important;
  }

  .cm-scroller {
    background: #ffffff !important;
  }

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
`;

function useCodeMirror(code) {
  const editorRef = useRef();
  const viewRef = useRef();

  const readonlyTheme = EditorView.theme({
    '.cm-content': {
      fontSize: '0.9rem',
      fontFamily: "'Fira Code', 'Consolas', 'Microsoft YaHei', monospace !important"
    }
  })

  useEffect(() => {
    const startState = EditorState.create({
      doc: code,
      extensions: [
        zinc(),
        
        githubLight,
        readonlyTheme,
        EditorView.editable.of(false),
        EditorState.readOnly.of(true)
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view;

    return () => {
      view.destroy()
    }
  }, []);

  return editorRef;
}

const CodeViewer = ({ code, language = 'zinc' }) => {
  
  const editor = useCodeMirror(code);
  return (
    <EditorContainer>
      <EditorHeader>
        <WindowButtons>
          <Button color="#ff5f56" />
          <Button color="#ffbd2e" />
          <Button color="#27c93f" />
        </WindowButtons>
      </EditorHeader>
      <EditorContent>
       <div ref={editor} language={language}/>
      </EditorContent>
    </EditorContainer>
  );
};

export default CodeViewer; 