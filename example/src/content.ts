import type { BackgroundMessageParams, ContentResponse } from './types';
import { Inject } from '../../src/content-inject';

// Content Script 类，继承 Inject
class ContentScript extends Inject {
  constructor() {
    super();
    this.initHandlers();
  }

  private initHandlers() {
    // 注册处理来自 background 消息的处理器
    this.registerHandler('fromBackground', this.handleBackgroundMessage.bind(this));
  }

  private async handleBackgroundMessage(params: unknown): Promise<unknown> {
    const backgroundParams = params as BackgroundMessageParams;
    console.log('Content script 处理来自 Background 的消息:', backgroundParams);

    // 在页面上显示一个通知
    this.showNotification(backgroundParams);

    // 返回响应
    return {
      message: 'Content script 已收到消息',
      receivedAt: new Date().toISOString(),
      originalMessage: backgroundParams.originalMessage,
    } as ContentResponse;
  }

  private showNotification(params: BackgroundMessageParams): void {
    // 创建一个简单的通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4285f4;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;

    notification.textContent = `收到消息: ${params.message}`;

    document.body.appendChild(notification);

    // 3秒后移除通知
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// 初始化 Content Script
console.log('Content script 已加载');
new ContentScript();
