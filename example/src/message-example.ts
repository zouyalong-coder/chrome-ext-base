import {
  MessageService,
  sendMessage,
  sendToContent,
  sendToContentTab,
  sendToAllContent,
  sendToWindowContent,
} from '../../src/message-service';

/**
 * 消息发送示例
 * 展示如何使用新的消息服务
 */

// 示例 1: 向 background script 发送消息
async function exampleSendToBackground() {
  try {
    // 使用 MessageService 类
    const result1 = await MessageService.sendToBackground('handleTestMessage', {
      message: '测试消息',
      timestamp: new Date().toISOString(),
    });
    console.log('MessageService 结果:', result1);

    // 使用简化的函数
    const result2 = await sendMessage('handleTestMessage', {
      message: '测试消息',
      timestamp: new Date().toISOString(),
    });
    console.log('sendMessage 结果:', result2);
  } catch (error) {
    console.error('发送到 background 失败:', error);
  }
}

// 示例 2: 向当前活动标签页的 content script 发送消息
async function exampleSendToContent() {
  try {
    // 使用 MessageService 类
    const result1 = await MessageService.sendToContent('getPageInfo', {
      includeDOM: true,
      includeMeta: true,
    });
    console.log('页面信息:', result1);

    // 使用简化的函数
    const result2 = await sendToContent('getPageInfo', {
      includeDOM: true,
      includeMeta: true,
    });
    console.log('页面信息:', result2);
  } catch (error) {
    console.error('发送到 content 失败:', error);
  }
}

// 示例 3: 向指定标签页发送消息
async function exampleSendToSpecificTab() {
  try {
    // 获取当前活动标签页
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    if (activeTab?.id) {
      const result = await sendToContentTab(
        'injectScript',
        {
          script: 'console.log("Hello from specific tab!");',
          type: 'inline',
        },
        activeTab.id
      );
      console.log('注入脚本结果:', result);
    }
  } catch (error) {
    console.error('向指定标签页发送消息失败:', error);
  }
}

// 示例 4: 向所有标签页发送消息
async function exampleSendToAllTabs() {
  try {
    const results = await sendToAllContent('showNotification', {
      message: '这是来自扩展的通知',
      type: 'info',
    });
    console.log('所有标签页响应:', results);
  } catch (error) {
    console.error('向所有标签页发送消息失败:', error);
  }
}

// 示例 5: 向指定窗口的所有标签页发送消息
async function exampleSendToWindow() {
  try {
    // 获取当前窗口
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.id) {
      const results = await sendToWindowContent(
        'updateUI',
        {
          theme: 'dark',
          fontSize: '14px',
        },
        currentWindow.id
      );
      console.log('窗口内标签页响应:', results);
    }
  } catch (error) {
    console.error('向窗口发送消息失败:', error);
  }
}

// 示例 6: 批量操作
async function exampleBatchOperations() {
  try {
    // 同时向 background 和 content 发送消息
    const [bgResult, contentResult] = await Promise.all([
      sendMessage('getExtensionInfo', {}),
      sendToContent('getPageInfo', { includeDOM: false }),
    ]);

    console.log('扩展信息:', bgResult);
    console.log('页面信息:', contentResult);
  } catch (error) {
    console.error('批量操作失败:', error);
  }
}

// 导出示例函数
export {
  exampleSendToBackground,
  exampleSendToContent,
  exampleSendToSpecificTab,
  exampleSendToAllTabs,
  exampleSendToWindow,
  exampleBatchOperations,
};
