# 故障排除指南

## Sidepanel 不显示的问题

如果点击扩展图标后 sidepanel 没有显示，请按照以下步骤进行排查：

### 1. 检查扩展是否正确加载

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 确保扩展已启用（开关为蓝色）
4. 检查是否有错误信息

### 2. 检查控制台错误

1. 在扩展管理页面点击"检查视图"（在扩展卡片上）
2. 查看 Console 标签页是否有错误信息
3. 常见错误：
   - 文件路径错误
   - 权限不足
   - 语法错误

### 3. 验证文件路径

确保以下文件存在且路径正确：

- `dist/background.js`
- `dist/src/sidepanel.html`
- `dist/sidepanel.js`

### 4. 重新加载扩展

1. 在扩展管理页面点击"重新加载"按钮
2. 或者删除扩展后重新加载

### 5. 检查 Chrome 版本

Sidepanel 功能需要 Chrome 114+ 版本。检查你的 Chrome 版本：

1. 在地址栏输入 `chrome://version/`
2. 确保版本号 >= 114

### 6. 手动打开 Sidepanel

如果点击图标不工作，可以尝试：

1. 右键点击扩展图标
2. 选择"打开侧边栏"

### 7. 使用快捷键

使用快捷键 `Ctrl+Shift+Y`（Windows/Linux）或 `Cmd+Shift+Y`（Mac）打开侧边栏

### 8. 检查 manifest.json

确保 manifest.json 包含正确的配置：

```json
{
  "permissions": ["sidePanel", "activeTab", "storage"],
  "side_panel": {
    "default_path": "dist/src/sidepanel.html"
  },
  "action": {
    "default_title": "Chrome Ext Base Demo"
  }
}
```

### 9. 调试步骤

1. **重新构建项目**：

   ```bash
   npm run build
   ```

2. **检查构建输出**：

   - 确保没有构建错误
   - 检查 dist 目录中的文件

3. **清除浏览器缓存**：
   - 清除 Chrome 缓存
   - 重新加载扩展

### 10. 常见解决方案

#### 问题：点击图标无反应

**解决方案**：

- 检查 background.js 是否正确加载
- 查看控制台是否有错误信息

#### 问题：Sidepanel 显示空白

**解决方案**：

- 检查 sidepanel.html 文件路径
- 查看 sidepanel.js 是否正确加载

#### 问题：功能按钮不工作

**解决方案**：

- 检查 content script 是否正确注入
- 查看消息传递是否正常

### 11. 获取帮助

如果问题仍然存在：

1. 查看 Chrome 开发者工具的控制台错误
2. 检查扩展的权限设置
3. 尝试在无痕模式下测试
4. 检查是否有其他扩展冲突

### 12. 测试步骤

1. 构建项目：`npm run build`
2. 加载扩展到 Chrome
3. 打开任意网页
4. 点击扩展图标
5. 如果 sidepanel 打开，测试各个功能按钮
6. 查看控制台日志确认功能正常

如果按照以上步骤仍然无法解决问题，请检查：

- Chrome 版本是否支持 sidepanel
- 是否有其他扩展干扰
- 系统权限设置
