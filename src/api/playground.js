// 运行代码的 API 函数
export const sendRunCodeRequest = async (code, params, onOutputUpdate) => {
  try {
    const varInputItems = [];
    for (let p in params) {
        varInputItems.push("`" + p + "` = " + params[p])
    }

    // 后台API其实无所谓request path 的...
    const res = await fetch('/api/playground/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        sourceCode: code,
        varInput: varInputItems.join('；') 
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text };
    }

    // 如果响应体不支持流式读取，直接返回所有文本
    if (!res.body || !res.body.getReader) {
      const text = await res.text();
      return { success: true, output: text.split('\\n') };
    }

    // 处理流式响应
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let buffer = '';
    const lines = [];

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        buffer += decoder.decode(value, { stream: !done });
        let parts = buffer.split(/\\r?\\n/);
        buffer = parts.pop() || '';

        parts.forEach((line) => {
          lines.push(line);
        });
        
        // 调用回调函数更新输出
        if (onOutputUpdate) {
          onOutputUpdate([...lines]);
        }
      }
    }
    
    // 处理剩余的缓冲区内容
    if (buffer) {
      lines.push(buffer);
      if (onOutputUpdate) {
        onOutputUpdate([...lines]);
      }
    }

    return { success: true, output: lines };
  } catch (err) {
    return { 
      success: false, 
      error: `[error] ${err.message || String(err)}` 
    };
  }
};