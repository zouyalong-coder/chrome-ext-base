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

    // 注册处理来自 sidepanel 消息的处理器
    this.registerHandler('fromSidepanel', this.handleSidepanelMessage.bind(this));

    // 注册获取页面信息的处理器
    this.registerHandler('getPageInfo', this.handleGetPageInfo.bind(this));

    // 注册注入脚本的处理器
    this.registerHandler('injectScript', this.handleInjectScript.bind(this));
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

  private async handleSidepanelMessage(params: unknown): Promise<unknown> {
    console.log('Content script 处理来自 Sidepanel 的消息:', params);

    const { message, action, data } = params as any;

    switch (action) {
      case 'showNotification':
        this.showCustomNotification(message, data);
        break;
      case 'getPageInfo':
        return this.getPageInfo(data);
      case 'injectScript':
        return this.injectCustomScript(data);
      default:
        console.warn('未知的 action:', action);
    }

    return {
      message: 'Sidepanel 消息处理成功',
      action,
      receivedAt: new Date().toISOString(),
    };
  }

  private async handleGetPageInfo(params: unknown): Promise<unknown> {
    console.log('Content script 处理获取页面信息请求:', params);
    return this.getPageInfo(params as any);
  }

  private async handleInjectScript(params: unknown): Promise<unknown> {
    console.log('Content script 处理注入脚本请求:', params);
    return this.injectCustomScript(params as any);
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

  private showCustomNotification(message: string, _data?: any): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #34a853;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;

    notification.textContent = `Sidepanel: ${message}`;

    document.body.appendChild(notification);

    // 3秒后移除通知
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  private getPageInfo(params: any = {}): any {
    const { includeDOM = false, includeMeta = true } = params;

    const pageInfo: any = {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    if (includeMeta) {
      const metaTags = document.querySelectorAll('meta');
      const metaInfo: any = {};

      metaTags.forEach((meta) => {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (name && content) {
          metaInfo[name] = content;
        }
      });

      pageInfo.meta = metaInfo;
    }

    if (includeDOM) {
      pageInfo.domStats = {
        totalElements: document.querySelectorAll('*').length,
        links: document.querySelectorAll('a').length,
        images: document.querySelectorAll('img').length,
        forms: document.querySelectorAll('form').length,
      };
    }

    return pageInfo;
  }

  private injectCustomScript(params: any): any {
    const { script, type = 'inline' } = params;

    try {
      if (type === 'inline') {
        // 执行内联脚本
        const scriptElement = document.createElement('script');
        scriptElement.textContent = script;
        document.head.appendChild(scriptElement);

        // 执行后移除
        setTimeout(() => {
          if (scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
          }
        }, 100);

        return {
          success: true,
          message: '内联脚本注入成功',
          type: 'inline',
        };
      } else if (type === 'file') {
        // 注入外部脚本文件
        const scriptElement = document.createElement('script');
        scriptElement.src = script;
        scriptElement.async = true;
        document.head.appendChild(scriptElement);

        return {
          success: true,
          message: '外部脚本注入成功',
          type: 'file',
          src: script,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: '脚本注入失败',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

// 初始化 Content Script
console.log('Content script 已加载');
new ContentScript();
