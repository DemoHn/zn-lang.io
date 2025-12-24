import React from 'react';
import styled from 'styled-components';

// 统一的颜色变量
const COLORS = {
  // 背景色系 - 与应用整体协调
  background: 'rgba(248, 248, 242, 0.9)',
  cardBackground: 'rgba(255, 255, 255, 0.85)',
  panelBackground: 'rgba(255, 255, 255, 0.85)',
  
  // 文字颜色
  textPrimary: '#2d3748',
  textSecondary: '#718096',
  textMuted: '#a0aec0',
  
  // 主色调 - 灰色系
  primary: '#bcbcbc',
  primaryHover: '#bbbbbb',
  primaryLight: 'rgba(66, 153, 225, 0.1)',
  
  // 成功色
  success: '#48bb78',
  successHover: '#38a169',
  
  // 边框和阴影
  border: 'rgba(0, 0, 0, 0.08)',
  shadow: 'rgba(0, 0, 0, 0.05)',
  shadowHover: 'rgba(0, 0, 0, 0.08)',
  
  // 输出框配色
  outputBg: '#f8f8f8',
  outputText: '#333333',
  
  // 代码编辑器
  editorBorder: 'rgba(0, 0, 0, 0.12)',
  fileNameBg: 'rgba(66, 153, 225, 0.1)',
};

const Panel = styled.div`
  border-radius: 6px;
  border: 1px solid ${COLORS.border};
  background: ${COLORS.panelBackground};
  box-shadow: 0 2px 8px ${COLORS.shadow};
  padding: 0.8rem 1rem 1rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
`;

const PanelTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${COLORS.textPrimary};
`;

const PanelTag = styled.span`
  font-size: 0.75rem;
  color: ${COLORS.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ParamsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ParamRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 4fr);
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
`;

const ParamLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  color: ${COLORS.textPrimary};
  font-weight: 500;
`;

const ParamMeta = styled.span`
  font-size: 0.75rem;
  color: ${COLORS.textMuted};
`;

const ParamInput = styled.input`
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  border: 1px solid ${COLORS.border};
  font-size: 0.85rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primaryLight};
    background: rgba(255, 255, 255, 0.9);
  }

  &:disabled {
    background: rgba(248, 248, 242, 0.5);
    color: ${COLORS.textMuted};
  }
`;

const BoolSelect = styled.select`
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  border: 1px solid ${COLORS.border};
  font-size: 0.85rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primaryLight};
    background: rgba(255, 255, 255, 0.9);
  }

  &:disabled {
    background: rgba(248, 248, 242, 0.5);
    color: ${COLORS.textMuted};
  }
`;

const EmptyHint = styled.div`
  font-size: 0.8rem;
  color: ${COLORS.textMuted};
  margin-top: 0.2rem;
  padding: 0.5rem;
  background: rgba(66, 153, 225, 0.05);
  border-radius: 4px;
  border-left: 3px solid ${COLORS.primary};
`;

const ParamInputBox = styled.div`
    min-height: 178px;
`

const OutputBox = styled.pre`
  flex: 1;
  margin: 0;
  padding: 0.6rem 0.8rem;
  background: ${COLORS.outputBg};
  color: ${COLORS.outputText};
  font-family: 'Fira Code', 'Consolas', 'Microsoft YaHei', monospace;
  font-size: 0.85rem;
  border-radius: 4px;
  overflow: auto;
  min-height: 8em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const OutputLine = styled.div`
  white-space: pre-wrap;
`;

const OutputLinePlaceHolder = styled.div`
  white-space: pre-wrap;
  color: #bfbfbf;
  font-style: italic;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: ${COLORS.textSecondary};
  padding: 0.2rem 0;
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.3rem;
  background: ${props => (props.active ? COLORS.success : COLORS.textMuted)};
  box-shadow: ${props => (props.active ? `0 0 4px ${COLORS.success}` : 'none')};
`;

// 参数输入面板组件
export const InputPanel = ({ isStarted, inputs, isRunning, onInputChange }) => {
  return (
    <Panel>
        <ParamInputBox>
            <PanelHeader>
                <PanelTitle>参数输入区</PanelTitle>
                <PanelTag>
                <StatusDot active={isStarted} />
                {isStarted ? '待填写' : '待生成参数列表'}
                </PanelTag>
            </PanelHeader>
      
      {isStarted && inputs.length > 0 ? (
        <ParamsList>
          {inputs.map((p) => (
            <ParamRow key={p.id}>
              <ParamLabel>
                {p.label}
                {/* 
                <ParamMeta>
                  {p.name} ({p.type})
                </ParamMeta>
                */}
              </ParamLabel>
              {p.type.toLowerCase() === 'bool' ? (
                <BoolSelect
                  value={p.value}
                  onChange={(e) => onInputChange(p.id, e.target.value)}
                  disabled={isRunning}
                >
                  <option value="">请选择…</option>
                  <option value="真">真</option>
                  <option value="假">假</option>
                </BoolSelect>
              ) : (
                <ParamInput
                  placeholder="请输入参数值…"
                  value={p.value}
                  onChange={(e) =>
                    onInputChange(p.id, e.target.value)
                  }
                  disabled={isRunning}
                />
              )}
            </ParamRow>
          ))}
        </ParamsList>
      ) : (
        <EmptyHint>
         点击左侧 "开始" 按钮生成所需参数列表
        </EmptyHint>
      )}
      </ParamInputBox>
    </Panel>
  );
};

// 结果显示面板组件
export const OutputPanel = ({ output }) => {
  return (
    <Panel>
        <PanelHeader>
            <PanelTitle>结果显示区</PanelTitle>
            <PanelTag>
            <span>
            <StatusDot active={!!output.length} />
            {output.length ? `结果已输出` : '无输出'}
            </span>
            </PanelTag>
        </PanelHeader>
      <OutputBox>
        {output.length === 0 ? (
          <OutputLinePlaceHolder>► 运行结果将在这里显示</OutputLinePlaceHolder>
        ) : (
          output.map((line, idx) => (
            <OutputLine key={idx}>{line}</OutputLine>
          ))
        )}
      </OutputBox>
      <StatusBar>&nbsp;
      </StatusBar>
    </Panel>
  );
};

// 默认导出包含两个面板的组件
const DisplayPanel = ({ isStarted, inputs, isRunning, onInputChange, output }) => {
  return (
    <>
      <InputPanel 
        isStarted={isStarted} 
        inputs={inputs} 
        isRunning={isRunning} 
        onInputChange={onInputChange} 
      />
      <OutputPanel output={output} />
    </>
  );
};

export default DisplayPanel;