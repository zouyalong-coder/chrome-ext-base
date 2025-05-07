import { MessageRequest, MessageResponse } from './types/message';

/**
 * 向 background 发送消息的通用方法
 * @param action 动作名称
 * @param params 参数
 * @returns Promise<MessageResponse>
 */
export async function callBg(
  method: string,
  params: MessageRequest['params'] = null
): Promise<MessageResponse['data']> {
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
export async function callContentScript(
  method: string,
  params: MessageRequest['params'] = null
): Promise<MessageResponse['data']> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { method, params }, (response: unknown) => {
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
export async function callContentScriptToTab(
  method: string,
  params: MessageRequest['params'] = null,
  tabId: number | null = null
): Promise<MessageResponse['data']> {
  const targetTabId: number =
    tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]!.id!;
  if (!targetTabId) {
    throw new Error('no active tab');
  }
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(
        targetTabId as number,
        { method, params },
        (response: MessageResponse['data']) => {
          resolve(response);
        }
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error('unknown error');
      reject(err);
    }
  });
}
export class BackgroundSvc {
  private handlers: Map<
    string,
    (params: MessageRequest['params']) => Promise<MessageResponse['data']>
  >;
  private defaultHandler:
    | ((params: MessageRequest['params']) => Promise<MessageResponse['data']>)
    | null;

  constructor(
    defaultHandler?: (params: MessageRequest['params']) => Promise<MessageResponse['data']>
  ) {
    this.handlers = new Map();
    this.defaultHandler = defaultHandler || null;
  }

  public register(handler: (params: MessageRequest['params']) => Promise<MessageResponse['data']>) {
    this.handlers.set(handler.name, handler);
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
