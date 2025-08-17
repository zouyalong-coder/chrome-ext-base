# Chrome Ext Base - BackgroundSvc 继承示例

这个示例展示了如何通过继承 `BackgroundSvc` 类来构建 Chrome 扩展的 Background Service。

## 功能特性

- **继承 BackgroundSvc**: 通过继承基础服务类来构建插件服务
- **消息处理器注册**: 自动注册和管理消息处理器
- **多种功能演示**: 包含测试消息、标签页信息获取、数据存储等功能
- **类型安全**: 完整的 TypeScript 类型支持

## 项目结构

```
example/
├── src/
│   ├── background.ts      # 继承 BackgroundSvc 的示例服务
│   ├── sidepanel.html     # 侧边栏界面
│   ├── sidepanel.ts       # 侧边栏逻辑
│   ├── content.ts         # 内容脚本
│   └── types.ts           # 类型定义
├── manifest.json          # 扩展清单
├── package.json           # 项目配置
└── README.md             # 说明文档
```

## 核心概念

### BackgroundSvc 继承

`ExamplePluginService` 类继承自 `BackgroundSvc`，提供了以下优势：

1. **统一的消息处理**: 自动处理 Chrome 扩展的消息传递
2. **处理器注册机制**: 通过 `register()` 方法注册消息处理器
3. **错误处理**: 统一的错误处理和响应格式
4. **类型安全**: 完整的 TypeScript 类型支持

### 示例服务类

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
```

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `example` 目录

**注意**: 如果点击扩展图标后 sidepanel 不显示，请：

- 确保 Chrome 版本 >= 114
- 右键点击扩展图标，选择"打开侧边栏"
- 或使用快捷键 `Ctrl+Shift+Y`（Windows/Linux）或 `Cmd+Shift+Y`（Mac）
- 查看 [故障排除指南](./TROUBLESHOOTING.md) 获取更多帮助

### 4. 测试功能

1. 打开任意网页
2. 点击扩展图标，打开侧边栏
3. 点击各种按钮测试功能：
   - **测试消息**: 发送消息到 content script
   - **获取标签页信息**: 获取当前标签页的详细信息
   - **存储数据**: 将数据存储到 Chrome 本地存储
   - **获取存储数据**: 从 Chrome 本地存储读取数据

## 功能详解

### 1. 测试消息 (handleTestMessage)

- 发送消息到当前活动标签页的 content script
- 接收 content script 的响应
- 返回处理结果

### 2. 获取标签页信息 (handleGetTabInfo)

- 查询当前活动标签页
- 返回标签页的 ID、URL、标题、状态等信息

### 3. 存储数据 (handleStoreData)

- 使用 Chrome 的 `storage.local` API
- 存储键值对数据
- 返回存储确认信息

### 4. 获取存储数据 (handleGetStoredData)

- 从 Chrome 本地存储读取数据
- 返回存储的数据和检索时间

## 扩展开发

### 添加新的消息处理器

1. 在 `ExamplePluginService` 类中添加新的处理方法：

```typescript
private async handleNewFeature(request: MessageRequest<NewFeatureParams>): Promise<any> {
  // 实现新功能逻辑
  return { result: 'success' };
}
```

2. 在 `initializeHandlers()` 方法中注册处理器：

```typescript
this.register(this.handleNewFeature.bind(this));
```

3. 在 sidepanel 中添加调用代码：

```typescript
const result = await sendMessage('handleNewFeature', {
  // 参数
});
```

### 自定义服务类

你可以创建自己的服务类来继承 `BackgroundSvc`：

```typescript
class MyCustomService extends BackgroundSvc {
  constructor() {
    super();
    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    // 注册你的处理器
  }

  // 实现你的业务逻辑
}
```

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **Vite**: 快速构建工具
- **Chrome Extensions API**: Chrome 扩展开发 API
- **Chrome Storage API**: 本地数据存储

## 注意事项

1. 确保在 `manifest.json` 中正确配置了权限
2. 消息处理器必须是异步函数
3. 使用 `bind(this)` 确保处理器中的 `this` 指向正确
4. 错误处理会自动包装在统一的响应格式中

## 故障排除

### 常见问题

1. **消息发送失败**: 检查扩展是否正确加载
2. **权限错误**: 确认 `manifest.json` 中的权限配置
3. **类型错误**: 确保 TypeScript 类型定义正确

### 调试技巧

1. 打开 Chrome 开发者工具
2. 查看 Console 标签页的日志输出
3. 在 Sources 标签页中设置断点
4. 使用 Chrome 扩展的调试页面

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个示例项目。
