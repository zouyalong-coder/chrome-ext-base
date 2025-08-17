# 消息服务重构总结

## 重构目标

将原有的 `sendMessage` 方法重构为通用的消息服务，提供统一的 Chrome 扩展消息发送功能，同时添加向 content script 发送消息的方法。

## 重构成果

### 1. 新增文件

#### `src/message-service.ts`

- 创建了 `MessageService` 类，提供完整的消息发送功能
- 支持向 background script 和 content script 发送消息
- 提供多种发送方式：单个标签页、所有标签页、指定窗口等
- 完整的 TypeScript 类型支持

#### `MESSAGE_SERVICE.md`

- 详细的使用文档
- API 参考
- 示例代码
- 迁移指南

#### `example/src/message-example.ts`

- 完整的使用示例
- 展示各种消息发送场景
- 批量操作示例

#### `example/src/test-message-service.ts`

- 单元测试示例
- 功能验证测试

### 2. 修改文件

#### `src/background-svc.ts`

- 移除了重复的消息发送方法
- 保持向后兼容性，重新导出 MessageService 的方法
- 简化了代码结构

#### `src/index.ts`

- 添加了消息服务模块的导出

#### `example/src/sidepanel.ts`

- 更新为使用新的消息服务
- 移除了原有的 `sendMessage` 方法
- 添加了 `sendToContent` 方法

#### `README.md`

- 添加了消息服务的说明
- 更新了主要功能列表
- 添加了文档链接

#### `package.json`

- 版本号更新到 0.3.0
- 添加了新的关键词
- 添加了新的文档文件到发布列表

## 功能特性

### 消息发送方法

1. **向 Background Script 发送消息**

   - `MessageService.sendToBackground()` / `sendMessage()`

2. **向 Content Script 发送消息**

   - `MessageService.sendToContent()` / `sendToContent()` - 当前活动标签页
   - `MessageService.sendToContentTab()` / `sendToContentTab()` - 指定标签页

3. **批量发送消息**
   - `MessageService.sendToAllContent()` / `sendToAllContent()` - 所有标签页
   - `MessageService.sendToWindowContent()` / `sendToWindowContent()` - 指定窗口

### 错误处理

- 统一的错误处理机制
- 详细的错误信息
- 网络错误处理
- Chrome API 错误处理

### 类型安全

- 完整的 TypeScript 类型支持
- 泛型参数支持
- 类型安全的 API 设计

## 使用方式

### 基本用法

```typescript
import { sendMessage, sendToContent } from 'chrome-ext-base';

// 向 background script 发送消息
const result = await sendMessage('handleTestMessage', {
  message: '测试消息',
  timestamp: new Date().toISOString(),
});

// 向 content script 发送消息
const pageInfo = await sendToContent('getPageInfo', {
  includeDOM: true,
  includeMeta: true,
});
```

### 高级用法

```typescript
import { MessageService } from 'chrome-ext-base';

// 向指定标签页发送消息
const tabId = 123;
await MessageService.sendToContentTab(
  'injectScript',
  {
    script: 'console.log("Hello!");',
    type: 'inline',
  },
  tabId
);

// 向所有标签页发送消息
const results = await MessageService.sendToAllContent('showNotification', {
  message: '这是来自扩展的通知',
  type: 'info',
});
```

## 向后兼容性

- 保留了原有的 `callBg`、`callContentScript`、`callContentScriptToTab` 函数
- 这些函数现在指向 MessageService 的对应方法
- 现有代码无需修改即可继续使用

## 测试验证

- 构建成功，无编译错误
- 类型定义文件正确生成
- 模块导出正常
- 功能测试通过

## 文档完善

- 详细的使用文档
- API 参考
- 示例代码
- 迁移指南
- 注意事项说明

## 总结

本次重构成功实现了以下目标：

1. ✅ 将 `sendMessage` 方法封装成通用方法
2. ✅ 添加了向 content script 发送消息的方法
3. ✅ 提供了多种消息发送方式
4. ✅ 保持了向后兼容性
5. ✅ 提供了完整的文档和示例
6. ✅ 确保了类型安全和错误处理

使用这个库的项目现在可以使用统一的 API 来发送消息，大大简化了 Chrome 扩展开发中的消息通信部分。
