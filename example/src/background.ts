import { BackgroundSvc, callContentScriptToTab } from '../../src/background-svc';
import type { MessageRequest, TestMessageParams, BackgroundMessageParams } from './types';

/**
 * 示例插件服务类 - 继承自 BackgroundSvc
 * 展示如何通过继承方式构建插件服务
 */
class ExamplePluginService extends BackgroundSvc {
  constructor() {
    super();
    this.initializeHandlers();
  }

  /**
   * 初始化消息处理器
   */
  private initializeHandlers(): void {
    // 注册测试消息处理器
    this.register(this.handleTestMessage.bind(this));

    // 注册获取标签页信息处理器
    this.register(this.handleGetTabInfo.bind(this));

    // 注册存储数据处理器
    this.register(this.handleStoreData.bind(this));

    // 注册获取存储数据处理器
    this.register(this.handleGetStoredData.bind(this));
  }

  /**
   * 处理测试消息
   */
  private async handleTestMessage(request: MessageRequest<TestMessageParams>): Promise<any> {
    console.log('ExamplePluginService 处理测试消息:', request.params);

    try {
      // 向当前活动标签页的 content script 发送消息
      const messageToContent: MessageRequest<BackgroundMessageParams> = {
        method: 'fromBackground',
        params: {
          message: '来自 ExamplePluginService 的消息',
          originalMessage: request.params.message,
          timestamp: new Date().toISOString(),
        },
      };

      const response = await callContentScriptToTab(
        messageToContent.method,
        messageToContent.params
      );

      console.log('Content script 响应:', response);

      return {
        message: '消息处理成功',
        contentResponse: response,
        processedBy: 'ExamplePluginService',
      };
    } catch (error) {
      console.error('处理测试消息时出错:', error);
      throw error;
    }
  }

  /**
   * 处理获取标签页信息请求
   */
  private async handleGetTabInfo(_request: MessageRequest): Promise<any> {
    console.log('ExamplePluginService 处理获取标签页信息请求');

    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];

      if (!activeTab) {
        throw new Error('没有找到活动标签页');
      }

      return {
        tabId: activeTab.id,
        url: activeTab.url,
        title: activeTab.title,
        status: activeTab.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('获取标签页信息时出错:', error);
      throw error;
    }
  }

  /**
   * 处理存储数据请求
   */
  private async handleStoreData(
    request: MessageRequest<{ key: string; value: any }>
  ): Promise<any> {
    console.log('ExamplePluginService 处理存储数据请求:', request.params);

    try {
      const { key, value } = request.params;
      await chrome.storage.local.set({ [key]: value });

      return {
        message: '数据存储成功',
        key,
        storedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('存储数据时出错:', error);
      throw error;
    }
  }

  /**
   * 处理获取存储数据请求
   */
  private async handleGetStoredData(request: MessageRequest<{ key: string }>): Promise<any> {
    console.log('ExamplePluginService 处理获取存储数据请求:', request.params);

    try {
      const { key } = request.params;
      const result = await chrome.storage.local.get(key);

      return {
        key,
        value: result[key],
        retrievedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('获取存储数据时出错:', error);
      throw error;
    }
  }

  /**
   * 启动服务
   */
  public start(): void {
    console.log('ExamplePluginService 启动中...');
    this.serve();
    console.log('ExamplePluginService 已启动，等待消息...');
  }
}

// 创建并启动示例插件服务
const exampleService = new ExamplePluginService();
exampleService.start();

// 处理扩展图标点击事件，打开 sidepanel
chrome.action.onClicked.addListener(async (tab) => {
  console.log('扩展图标被点击，打开 sidepanel');

  // 打开 sidepanel
  await chrome.sidePanel.open({ windowId: tab.windowId });

  // 可选：设置 sidepanel 为默认显示
  // await chrome.sidePanel.setOptions({
  //   tabId: tab.id,
  //   path: 'dist/src/sidepanel.html',
  //   enabled: true,
  // });
});

// 导出服务实例，以便在其他地方使用
export { exampleService };
