# BackgroundSvc 继承示例演示

这个示例展示了如何通过继承 `BackgroundSvc` 类来构建 Chrome 扩展的 Background Service。

## 快速开始

### 1. 构建项目

```bash
cd example
npm install
npm run build
```

### 2. 加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `example` 目录

### 3. 测试功能

1. 打开任意网页
2. 点击扩展图标，打开侧边栏
3. 点击各种按钮测试功能

## 核心代码示例

### Background Service (background.ts)

```typescript
class ExamplePluginService extends BackgroundSvc {
  constructor() {
    super();
    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    // 注册各种消息处理器
    this.register(this.handleTestMessage.bind(this));
    this.register(this.handleGetTabInfo.bind(this));
    this.register(this.handleStoreData.bind(this));
    this.register(this.handleGetStoredData.bind(this));
  }

  // 实现具体的处理器方法...
}

// 创建并启动服务
const exampleService = new ExamplePluginService();
exampleService.start();
```

### 消息处理器示例

```typescript
private async handleTestMessage(request: MessageRequest<TestMessageParams>): Promise<any> {
  console.log('处理测试消息:', request.params);

  // 向 content script 发送消息
  const response = await callContentScriptToTab('fromBackground', {
    message: '来自 Background Service 的消息',
    originalMessage: request.params.message,
    timestamp: new Date().toISOString(),
  });

  return {
    message: '消息处理成功',
    contentResponse: response,
    processedBy: 'ExamplePluginService',
  };
}
```

### Sidepanel 调用示例

```typescript
// 通用消息发送函数
async function sendMessage<T>(method: string, params: T): Promise<any> {
  const request: MessageRequest<T> = { method, params };
  const response = await chrome.runtime.sendMessage(request);

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.error);
  }
}

// 调用示例
const result = await sendMessage('handleTestMessage', {
  message: '来自 Sidepanel 的测试消息',
  timestamp: new Date().toISOString(),
});
```

## 功能演示

### 1. 测试消息

- 发送消息到 content script
- 接收 content script 的响应
- 显示处理结果

### 2. 获取标签页信息

- 查询当前活动标签页
- 返回标签页的详细信息

### 3. 存储数据

- 使用 Chrome Storage API
- 存储键值对数据

### 4. 获取存储数据

- 从 Chrome 本地存储读取数据
- 显示存储的内容

## 优势

1. **代码复用**: 继承 `BackgroundSvc` 获得统一的消息处理机制
2. **类型安全**: 完整的 TypeScript 类型支持
3. **错误处理**: 统一的错误处理和响应格式
4. **易于扩展**: 通过注册新的处理器来添加功能
5. **维护性好**: 清晰的结构和分离的关注点

## 扩展开发

要添加新功能，只需：

1. 在服务类中添加新的处理方法
2. 在 `initializeHandlers()` 中注册处理器
3. 在 sidepanel 中添加调用代码

这种模式使得扩展开发变得简单和可维护。
