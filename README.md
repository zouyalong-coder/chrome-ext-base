# Chrome Extension Base

一个用于 Chrome 扩展开发的 TypeScript 库。

## 安装

```bash
npm install chrome-ext-base
```

## 使用方法

```typescript
import {
  actionWithText,
  waitForElement,
  batchAction,
  getElementValue,
  setElementValue,
} from 'chrome-ext-base';

// 等待元素出现并点击
const element = await waitForElement('.button', 3000);
if (element) {
  element.click();
}

// 根据文本内容查找并点击元素
actionWithText('button', '提交');

// 批量处理元素
await batchAction('.item', async (element) => {
  // 处理每个元素
  console.log(element.textContent);
});

// 获取和设置输入框的值
const value = getElementValue('#input');
setElementValue('#input', '新值');
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建项目
npm run build

# 运行代码检查
npm run lint

# 格式化代码
npm run format
```

## 发布到 npm

1. 确保您已经登录到 npm：

```bash
npm login
```

2. 更新版本号（遵循语义化版本）：

```bash
npm version patch  # 小版本更新 (0.0.x)
npm version minor  # 中版本更新 (0.x.0)
npm version major  # 大版本更新 (x.0.0)
```

3. 发布到 npm：

```bash
npm publish
```

注意：

- 确保 `package.json` 中的 `name` 字段是唯一的
- 发布前请确保已经运行 `npm run build` 生成了最新的构建文件
- 如果包名包含 scope（如 @your-name/package-name），发布时需要使用 `npm publish --access public`

## 许可证

本项目采用 GNU Lesser General Public License v3.0 (LGPL-3.0) 许可证。

主要条款：

- 允许自由使用，包括商业用途
- 如果只是使用本库（不修改），不需要开源您的代码
- 如果修改了本库并重新发布，需要：
  - 开源修改后的代码
  - 使用相同的 LGPL 许可证
  - 保留原始版权声明

详细条款请查看 [LICENSE](LICENSE) 文件。
