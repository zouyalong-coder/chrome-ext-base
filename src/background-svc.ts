import { MessageRequest, MessageResponse } from './types/message';

/**
 * 向 background 发送消息的通用方法
 * @param action 动作名称
 * @param params 参数
 * @returns Promise<MessageResponse>
 */
export async function callBg<T>(action: string, params: T = null as T): Promise<any> {
  try {
    const response = await chrome.runtime.sendMessage({
      action,
      params,
    } as MessageRequest<T>);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('未知错误');
  }
}

/**
 * 调用 content script 的函数
 * @param action 动作名称
 * @param params 参数
 * @returns Promise<any>
 */
export async function callContentScript<T = any>(
  action: string,
  params: T = null as T
): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { action, params }, (response: any) => {
          resolve(response);
        });
      } else {
        reject(new Error('没有找到活动标签页'));
      }
    });
  });
}

export class BackgroundSvc {
  private handlers: Map<string, (params: MessageRequest) => Promise<MessageResponse>>;
  private defaultHandler: ((params: MessageRequest) => Promise<MessageResponse>) | null;

  constructor(defaultHandler?: (params: MessageRequest) => Promise<MessageResponse>) {
    this.handlers = new Map();
    this.defaultHandler = defaultHandler || null;
  }

  public register(handler: (params: MessageRequest) => Promise<MessageResponse>) {
    this.handlers.set(handler.name, handler);
  }

  public serve() {
    chrome.runtime.onMessage.addListener(
      (
        request: MessageRequest,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
      ) => {
        const { action } = request;

        const handleRequest = async () => {
          try {
            const handler = this.handlers.get(action) || this.defaultHandler;
            if (!handler) {
              sendResponse({
                success: false,
                error: `未找到对应的处理器: ${action}`,
              });
              return;
            }

            const result = await handler(request);
            sendResponse({
              success: true,
              data: result,
            });
          } catch (error) {
            sendResponse({
              success: false,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        };

        handleRequest();
        return true; // 保持消息通道开放，以便异步响应
      }
    );
  }
}
