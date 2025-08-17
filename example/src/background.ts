import { BackgroundSvc, callContentScriptToTab } from '../../src/background-svc';
import type {
  MessageRequest,
  TestMessageParams,
  BackgroundMessageParams,
  SendToContentParams,
  PageInfoParams,
  InjectScriptParams,
  StorageParams,
} from './types';

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
    this.registerHandler('handleTestMessage', this.handleTestMessage.bind(this));

    // 注册获取标签页信息处理器
    this.registerHandler('handleGetTabInfo', this.handleGetTabInfo.bind(this));

    // 注册存储数据处理器
    this.registerHandler('handleStoreData', this.handleStoreData.bind(this));

    // 注册获取存储数据处理器
    this.registerHandler('handleGetStoredData', this.handleGetStoredData.bind(this));

    // 注册向 Content 发送消息处理器
    this.registerHandler('handleSendToContent', this.handleSendToContent.bind(this));

    // 注册获取页面信息处理器
    this.registerHandler('handleGetPageInfo', this.handleGetPageInfo.bind(this));

    // 注册注入脚本处理器
    this.registerHandler('handleInjectScript', this.handleInjectScript.bind(this));

    // 注册清除存储数据处理器
    this.registerHandler('handleClearStorage', this.handleClearStorage.bind(this));
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
   * 处理向 Content 发送消息请求
   */
  private async handleSendToContent(request: MessageRequest<SendToContentParams>): Promise<any> {
    console.log('ExamplePluginService 处理向 Content 发送消息请求:', request.params);

    try {
      const { message, action, data } = request.params;

      const messageToContent: MessageRequest = {
        method: 'fromSidepanel',
        params: {
          message,
          action,
          data,
          timestamp: new Date().toISOString(),
        },
      };

      const response = await callContentScriptToTab(
        messageToContent.method,
        messageToContent.params
      );

      return {
        message: '消息已发送到 Content',
        contentResponse: response,
        action,
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('向 Content 发送消息时出错:', error);
      throw error;
    }
  }

  /**
   * 处理获取页面信息请求
   */
  private async handleGetPageInfo(request: MessageRequest<PageInfoParams>): Promise<any> {
    console.log('ExamplePluginService 处理获取页面信息请求:', request.params);

    try {
      const messageToContent: MessageRequest = {
        method: 'getPageInfo',
        params: request.params,
      };

      const response = await callContentScriptToTab(
        messageToContent.method,
        messageToContent.params
      );

      return {
        message: '页面信息获取成功',
        pageInfo: response,
        retrievedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('获取页面信息时出错:', error);
      throw error;
    }
  }

  /**
   * 处理注入脚本请求
   */
  private async handleInjectScript(request: MessageRequest<InjectScriptParams>): Promise<any> {
    console.log('ExamplePluginService 处理注入脚本请求:', request.params);

    try {
      const { script, type = 'inline' } = request.params;

      const messageToContent: MessageRequest = {
        method: 'injectScript',
        params: { script, type },
      };

      const response = await callContentScriptToTab(
        messageToContent.method,
        messageToContent.params
      );

      return {
        message: '脚本注入成功',
        scriptType: type,
        response,
        injectedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('注入脚本时出错:', error);
      throw error;
    }
  }

  /**
   * 处理清除存储数据请求
   */
  private async handleClearStorage(request: MessageRequest<StorageParams>): Promise<any> {
    console.log('ExamplePluginService 处理清除存储数据请求:', request.params);

    try {
      const { key } = request.params;

      if (key) {
        // 清除指定键的数据
        await chrome.storage.local.remove(key);
        return {
          message: `键 "${key}" 的数据已清除`,
          clearedKey: key,
          clearedAt: new Date().toISOString(),
        };
      } else {
        // 清除所有数据
        await chrome.storage.local.clear();
        return {
          message: '所有存储数据已清除',
          clearedAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('清除存储数据时出错:', error);
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
