import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styled from 'styled-components';
import CM6Editor from '../components/CM6Editor';
import DisplayPanel from '../components/DisplayPanel';
import { sendRunCodeRequest } from '@site/src/api/playground';

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

const PageContainer = styled.div`
  width: 60%;
  margin:0 auto;
  padding: 1.5rem 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${COLORS.border};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
  color: ${COLORS.textPrimary};
`;

const SubTitle = styled.span`
  font-size: 0.9rem;
  color: ${COLORS.textSecondary};
  max-width: 80%;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${COLORS.textSecondary};
`;

const SmallTextButton = styled.button`
  border: 1px solid ${COLORS.border};
  line-height: 1;
  background: transparent;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  color: ${COLORS.textSecondary};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${COLORS.primaryLight};
    color: ${COLORS.primary};
    border-color: ${COLORS.primary};
  }
`;

const MainPanel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 15fr) minmax(0, 9fr);
  gap: 1.5rem;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const EditorColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditorLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${COLORS.textSecondary};
`;

const Selector = styled.select`
  font-family: 'Fira Code', 'Consolas', 'Microsoft YaHei', monospace;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.4rem 2.5rem 0.4rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
  border: 1px solid rgba(66, 153, 225, 0.2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234299e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.4rem center;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primaryLight};
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PrimaryButton = styled.button`
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  line-height: 1;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  background: ${props => {
    if (props.disabled) return '#e2e8f0';
    if (props.variant === 'secondary') return 'rgba(255, 255, 255, 0.8)';
    if (props.variant === 'run') return '#2d7a2d'; // 深绿色
    return COLORS.primary;
  }};
  color: ${props => {
    if (props.disabled) return COLORS.textMuted;
    if (props.variant === 'secondary') return COLORS.textPrimary;
    return '#fff';
  }};
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px ${COLORS.shadow};

  &:hover {
    background: ${props => {
      if (props.disabled) return '#e2e8f0';
      if (props.variant === 'secondary') return COLORS.primaryLight;
      if (props.variant === 'run') return '#245a24'; // 更深的绿色
      return COLORS.primaryHover;
    }};
    transform: ${props => (props.disabled ? 'none' : 'translateY(-1px)')};
    box-shadow: ${props => (props.disabled ? 'none' : `0 4px 6px ${COLORS.shadowHover}`)};
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LoadingDots = styled.span`
  display: inline-block;
  width: 1.2em;
  text-align: left;
  &::after {
    display: inline-block;
    animation: dotty steps(1, end) 1s infinite;
    content: '';
  }

  @keyframes dotty {
    0% {
      content: '';
    }
    25% {
      content: '.';
    }
    50% {
      content: '..';
    }
    75% {
      content: '...';
    }
    100% {
      content: '';
    }
  }
`;

// 预制程序代码示例
const templateCodes = {
  "示例程序": `导入“1234”
[ABD]
输入`,
  "HelloWorld": `fn main() {
    println!("Hello, World!");
    println!("欢迎使用 Zinc 语言!");
}`,
  "温度转换": `fn main() {
    // 摄氏度转华氏度
    let celsius = input!("请输入摄氏温度: {}", f64);
    let fahrenheit = celsius * 9.0 / 5.0 + 32.0;
    println!("华氏温度: {:.2}°F", fahrenheit);
    
    // 华氏度转摄氏度
    let fahr = input!("请输入华氏温度: {}", f64);
    let cels = (fahr - 32.0) * 5.0 / 9.0;
    println!("摄氏温度: {:.2}°C", cels);
}`,
  "读博判断": `fn main() {
    let age = input!("请输入年龄: {}", i32);
    let has_master = input!("是否拥有硕士学位? (true/false): {}", bool);
    let has_publication = input!("是否有发表论文? (true/false): {}", bool);
    
    let can_apply_phd = age >= 22 && age <= 35 && has_master && has_publication;
    
    if can_apply_phd {
        println!("恭喜！您符合申请博士的条件。");
    } else {
        println!("抱歉，您目前不符合申请博士的条件。");
        println!("条件：22-35岁，拥有硕士学位，有发表论文");
    }
}`,
  "计算器": `fn main() {
    println!("简单计算器");
    let a = input!("第一个数字: {}", f64);
    let b = input!("第二个数字: {}", f64);
    let op = input!("运算符 (+, -, *, /): {}", String);
    
    let result = match op.as_str() {
        "+" => a + b,
        "-" => a - b,
        "*" => a * b,
        "/" => {
            if b != 0.0 {
                a / b
            } else {
                println!("错误：除数不能为零！");
                return;
            }
        },
        _ => {
            println!("错误：不支持的运算符！");
            return;
        }
    };
    
    println!("结果: {} {} {} = {}", a, op, b, result);
}`,
  "猜数字": `fn main() {
    let secret = 42; // 秘密数字
    let mut attempts = 0;
    let max_attempts = 5;
    
    println!("猜数字游戏！我有了一个1-100之间的秘密数字。");
    println!("你有{}次机会来猜中它。", max_attempts);
    
    while attempts < max_attempts {
        let guess = input!("第{}次猜测，请输入数字: {}", attempts + 1, i32);
        attempts += 1;
        
        if guess == secret {
            println!("恭喜！你用{}次猜中了数字{}！", attempts, secret);
            return;
        } else if guess < secret {
            println!("太小了！");
        } else {
            println!("太大了！");
        }
    }
    
    println!("游戏结束！你没有在{}次内猜中数字{}。", max_attempts, secret);
}`,
  "斐波那契数列": `fn main() {
    let n = input!("要输出斐波那契数列的前几项? {}", i32);
    
    if n <= 0 {
        println!("请输入一个正整数！");
        return;
    }
    
    if n == 1 {
        println!("斐波那契数列前1项: 1");
        return;
    }
    
    let mut a = 1;
    let mut b = 1;
    
    print!("斐波那契数列前{}项: 1, 1", n);
    
    for i in 3..=n {
        let next = a + b;
        print!(", {}", next);
        a = b;
        b = next;
    }
    
    println!();
}`,
};

// 简单解析代码中的 input!/read_line/prompt 调用，生成参数定义
function extractInputsFromCode(code) {
  const lines = code.split('\n');
  const results = [];
  let counter = 1;

  for (var i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('输入')) {
      const variables = line.slice(2).split('、');

      for (let v of variables) {
        const varName = v.trim().replaceAll('`', '');
        if (varName != "" && varName != null) {
          results.push({
            id: `input-${counter}`,
            name: varName,
            label: varName,
            type: 'String',
            value: '',
          });
          counter += 1;
        }
      }

      break;
    }
  }

  return results;
}

const Playground = () => {
  //// Panel States
  const STATE_INIT = 0;
  const STATE_FILL_INPUT = 1;
  const STATE_RUNNING = 2;
  const [pState, setPanelState] = useState(STATE_INIT);

  const [currentTemplate, setCurrentTemplate] = useState("示例程序");
  const [code, setCode] = useState(templateCodes["示例程序"]);

  const [inputs, setInputs] = useState([]);
  const [output, setOutput] = useState([]);

  // 添加键盘事件监听器，在 STATE_FILL_INPUT 状态时按下 Ctrl+Enter 运行程序
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 检查是否是 Ctrl+Enter 组合键
      if (event.ctrlKey && event.key === 'Enter') {
        // 只有在 STATE_FILL_INPUT 状态时才执行
        if (pState === STATE_FILL_INPUT) {
          setPanelState(STATE_RUNNING);
          handleRun(inputs);
        }
      }
    };
    // 添加事件监听器
    document.addEventListener('keydown', handleKeyDown);

    // 清理函数，移除事件监听器
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pState, inputs]); // 依赖项，当状态变化时重新绑定事件

  

  const handleStart = () => {
    const found = extractInputsFromCode(code);
    setInputs(found);

    // 如果不需要等待输入，直接运行即可
    if (found.length == 0) {
      setPanelState(STATE_RUNNING);
      handleRun(inputs);
    } else {
      setPanelState(STATE_FILL_INPUT);
    }
  };

  const handleReset = () => {
    // reset data
    setOutput([])
    setInputs([])
    setPanelState(STATE_INIT);
  }

  const handleInputChange = (id, value) => {
    setInputs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value } : p))
    );
  };

  const handleRun = async (inputs) => {
    setOutput([]);

    const params = {};
    inputs.forEach((p) => {
      params[p.name] = p.value;
    });

    // 使用 API 函数运行代码
    const result = await sendRunCodeRequest(code, params, (lines) => {
      setOutput(lines);
    });

    if (result.success) {
      setOutput(result.output);
    } else {
      setOutput([result.error]);
    }

    // 无论成功与否，都重置状态
    setPanelState(STATE_INIT);
  };

  const handleTemplateChange = (template) => {
    setCurrentTemplate(template);
    setCode(templateCodes[template]);
    setPanelState(STATE_INIT);
    setInputs([]);
    setOutput([]);
  };

  return (
    <Layout title="芯语言 - 在线运行" description="playground">
        <PageContainer>
        <HeaderRow>
            <TitleGroup>
            <Title>在线运行</Title>
            <SubTitle>注：如果程序带有‘输入’语句，则执行时需要先点击‘开始’，在参数输入区填好对应的按钮后，再点击‘运行’得到结果！</SubTitle>
            </TitleGroup>
        </HeaderRow>

        <MainPanel>
            <EditorColumn>
            <EditorLabelRow>
                <Selector
                value={currentTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                disabled={pState == STATE_RUNNING || pState == STATE_FILL_INPUT}
                >
                {Object.keys(templateCodes).map(template => (
                    <option key={template} value={template}>{template}</option>
                ))}
                </Selector>
                <ActionsRow>
                {pState == STATE_FILL_INPUT ? 
                    <PrimaryButton
                    onClick={handleReset}
                    variant="secondary">
                    重置
                </PrimaryButton> :
                    <PrimaryButton
                    onClick={handleStart}
                    disabled={pState == STATE_RUNNING}
                    variant="secondary">
                    开始 
                    </PrimaryButton>
                }
                <PrimaryButton
                    onClick={() => handleRun(inputs)}
                    disabled={pState == STATE_INIT || pState == STATE_RUNNING}
                    variant="run"
                >
                    运行 (Ctrl + ↵)
                </PrimaryButton>
                </ActionsRow>
            </EditorLabelRow>
                <CM6Editor
                value={code}
                onChange={setCode}
                readOnly={pState == STATE_RUNNING}
                />
            </EditorColumn>

            <RightColumn>
            <DisplayPanel
                isStarted={pState != STATE_INIT}
                inputs={inputs}
                isRunning={pState == STATE_RUNNING}
                onInputChange={handleInputChange}
                output={output}
            />
            </RightColumn>
        </MainPanel>
        </PageContainer>
    </Layout>
  );
};

export default Playground;
