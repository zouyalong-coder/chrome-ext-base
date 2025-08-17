# Chrome 扩展示例 - 完整消息传递演示

这是一个展示 Chrome 扩展中完整消息传递机制的示例项目，包括 Sidepanel、Background Script 和 Content Script 之间的通信。

## 功能特性

### 🎯 核心功能

- **Sidepanel 界面**: 提供用户交互界面
- **Background 服务**: 处理扩展核心逻辑
- **Content Script**: 与网页交互
- **完整消息传递**: 三者之间的双向通信

### 📋 按钮功能说明

#### 1. 📤 测试消息

- **功能**: 向 Background 发送测试消息
- **流程**: Sidepanel → Background → Content → Background → Sidepanel
- **效果**: 在页面上显示通知，返回处理结果

#### 2. 📋 获取标签页信息

- **功能**: 获取当前活动标签页的详细信息
- **数据**: 标签页 ID、URL、标题、状态等
- **用途**: 了解当前浏览环境

#### 3. 💾 存储数据

- **功能**: 将数据存储到 Chrome 本地存储
- **数据**: 包含消息、时间戳、随机值
- **持久化**: 数据在浏览器重启后仍然保留

#### 4. 📖 获取存储数据

- **功能**: 从 Chrome 本地存储读取数据
- **验证**: 确认数据存储和读取功能正常

#### 5. 📨 向 Content 发送消息

- **功能**: 直接向当前页面的 Content Script 发送消息
- **效果**: 在页面上显示绿色通知
- **用途**: 演示 Sidepanel 到 Content 的直接通信

#### 6. 🌐 获取页面信息

- **功能**: 获取当前网页的详细信息
- **数据**: URL、标题、域名、Meta 标签、DOM 统计等
- **用途**: 分析页面结构和内容

#### 7. 🔧 注入脚本

- **功能**: 向当前页面注入并执行 JavaScript 代码
- **效果**: 临时为页面添加蓝色边框
- **安全**: 脚本执行后自动清理

#### 8. 🗑️ 清除存储数据

- **功能**: 清除指定的存储数据
- **用途**: 数据管理和清理

## 技术架构

### 消息传递流程

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Sidepanel  │◄──►│   Background │◄──►│   Content   │
│             │    │              │    │             │
│ 用户界面     │    │  核心服务     │    │  页面交互    │
└─────────────┘    └──────────────┘    └─────────────┘
```

### 文件结构

```
example/
├── src/
│   ├── sidepanel.html    # Sidepanel 界面
│   ├── sidepanel.ts      # Sidepanel 逻辑
│   ├── background.ts     # Background 服务
│   ├── content.ts        # Content Script
│   └── types.ts          # 类型定义
├── manifest.json         # 扩展清单
├── package.json          # 项目配置
└── README.md            # 说明文档
```

### 核心类

#### ExamplePluginService (Background)

- 继承自 `BackgroundSvc`
- 处理所有来自 Sidepanel 的消息
- 管理存储和标签页操作
- 协调 Content Script 通信

#### ContentScript (Content)

- 继承自 `Inject`
- 处理来自 Background 的消息
- 提供页面信息获取
- 支持脚本注入功能

## 使用方法

### 1. 安装依赖

```bash
cd example
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `example/dist` 目录

### 4. 测试功能

1. 点击扩展图标打开 Sidepanel
2. 在任意网页上测试各个按钮功能
3. 观察页面上的通知效果
4. 查看控制台日志了解消息传递过程

## 开发说明

### 消息类型定义

```typescript
// 基础消息结构
interface MessageRequest<T = unknown> {
  method: string;
  params: T;
}

interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 添加新功能

1. 在 `types.ts` 中定义新的参数类型
2. 在 `background.ts` 中添加新的消息处理器
3. 在 `content.ts` 中添加对应的处理方法
4. 在 `sidepanel.ts` 中添加新的按钮事件
5. 在 `sidepanel.html` 中添加新的按钮

### 调试技巧

- 使用 Chrome DevTools 查看 Background 页面
- 在网页控制台查看 Content Script 日志
- 在 Sidepanel 中查看消息响应结果

## 注意事项

1. **权限**: 确保 `manifest.json` 中包含必要的权限
2. **CSP**: Content Script 注入的脚本需要遵守 CSP 策略
3. **错误处理**: 所有异步操作都包含完整的错误处理
4. **类型安全**: 使用 TypeScript 确保类型安全

## 扩展功能建议

- 添加消息历史记录
- 实现数据导出功能
- 添加配置选项
- 支持快捷键操作
- 添加主题切换
- 实现数据同步功能

这个示例展示了 Chrome 扩展开发的最佳实践，可以作为开发其他扩展的参考模板。
