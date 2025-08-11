import { MessageRequest, MessageResponse } from './types/message';

export type Handler<P, R> = (params: P) => Promise<R>;

/**
 * 向 background 发送消息的通用方法
 * @param action 动作名称
 * @param params 参数
 * @returns Promise<MessageResponse>
 */
export async function callBg<P, R>(method: string, params: P): Promise<R> {
  try {
    const response = await chrome.runtime.sendMessage({
      method,
      params,
    } as MessageRequest);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('unknown error');
  }
}

/**
 * 调用 content script 的函数
 * @param action 动作名称
 * @param params 参数
 * @returns Promise<any>
 */
export async function callContentScript<P, R>(method: string, params: P): Promise<R> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { method, params }, (response: R) => {
          resolve(response);
        });
      } else {
        reject(new Error('no active tab'));
      }
    });
  });
}

/**
 * 调用 content script 的函数
 * @param action 动作名称
 * @param params 参数
 * @param tabId 目标 tab id
 * @returns Promise<any>
 */
export async function callContentScriptToTab<P, R>(
  method: string,
  params: P,
  tabId: number | null = null
): Promise<R> {
  const targetTabId: number =
    tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]!.id!;
  if (!targetTabId) {
    throw new Error('no active tab');
  }
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(targetTabId as number, { method, params }, (response: R) => {
        resolve(response);
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('unknown error');
      reject(err);
    }
  });
}
export class BackgroundSvc {
  private handlers: Map<string, Handler<any, any>>;
  private defaultHandler: Handler<any, any> | null;

  constructor(defaultHandler?: Handler<any, any>) {
    this.handlers = new Map();
    this.defaultHandler = defaultHandler || null;
  }

  public register<P, R>(handler: Handler<P, R>) {
    this.handlers.set(handler.name, handler as Handler<any, any>);
  }

  public serve() {
    chrome.runtime.onMessage.addListener(
      (
        request: MessageRequest,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
      ) => {
        const { method } = request;

        const handleRequest = async () => {
          try {
            const handler = this.handlers.get(method) || this.defaultHandler;
            if (!handler) {
              sendResponse({
                success: false,
                error: `no handler found for method: ${method}`,
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
