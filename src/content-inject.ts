import { MessageRequest } from './types/message';

export class Inject {
  private handlers: Map<string, (params: unknown) => Promise<unknown>>;

  constructor() {
    this.handlers = new Map();
    this.initMessageListener();
  }

  private initMessageListener() {
    chrome.runtime.onMessage.addListener((request: MessageRequest, sender, sendResponse) => {
      const handleRequest = async () => {
        try {
          const { method, params } = request;
          const handler = this.handlers.get(method);

          if (handler) {
            const result = await handler(params);
            this.sendResponseWrapper(sendResponse, {
              success: true,
              data: result,
            });
          } else {
            this.sendResponseWrapper(sendResponse, {
              success: false,
              error: `unknown method: ${method}`,
            });
          }
        } catch (error: unknown) {
          this.sendResponseWrapper(sendResponse, {
            success: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      };

      handleRequest();
      return true; // 保持消息通道开放，以便异步响应
    });
  }

  private sendResponseWrapper(sendResponse: (response: unknown) => void, response: unknown) {
    sendResponse(response);
  }

  /**
   * 注册事件处理器
   * @param method 事件名称
   * @param handler 处理函数
   */
  public registerHandler(method: string, handler: (params: unknown) => Promise<unknown>) {
    this.handlers.set(method, handler);
  }

  /**
   * 快速注册事件。
   * @param handler
   */
  public register(handler: (params: unknown) => Promise<unknown>) {
    this.registerHandler(handler.name, handler);
  }
}
