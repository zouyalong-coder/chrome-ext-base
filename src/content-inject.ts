export class Inject {
  private handlers: Map<string, (...args: any[]) => Promise<any>>;

  constructor() {
    this.handlers = new Map();
    this.initMessageListener();
  }

  private initMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const handleRequest = async () => {
        try {
          const { action, data } = request;
          console.log('收到消息:', request);
          const handler = this.handlers.get(action);

          if (handler) {
            const result = await handler(data);
            this.sendResponseWrapper(sendResponse, {
              success: true,
              data: result,
            });
          } else {
            this.sendResponseWrapper(sendResponse, {
              success: false,
              error: `未知的 action: ${action}`,
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

  private sendResponseWrapper(sendResponse: (response: any) => void, response: any) {
    sendResponse(response);
  }

  /**
   * 注册事件处理器
   * @param action 事件名称
   * @param handler 处理函数
   */
  public registerHandler(action: string, handler: (...args: any[]) => Promise<any>) {
    this.handlers.set(action, handler);
  }

  /**
   * 快速注册事件。
   * @param handler
   */
  public register(handler: (...args: any[]) => Promise<any>) {
    this.registerHandler(handler.name, handler);
  }
}
