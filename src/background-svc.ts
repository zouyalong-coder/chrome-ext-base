import { MessageRequest, MessageResponse } from './types/message';
import { MessageService } from './message-service';

export type Handler<P, R> = (params: P) => Promise<R>;

// 为了向后兼容，重新导出 MessageService 的方法
export const callBg = MessageService.sendToBackground;
export const callContentScript = MessageService.sendToContent;

// 向后兼容的包装函数，支持可选的 tabId 参数
export async function callContentScriptToTab<P, R>(
  method: string,
  params: P,
  tabId?: number | null
): Promise<R> {
  if (tabId) {
    return MessageService.sendToContentTab(method, params, tabId);
  } else {
    return MessageService.sendToContent(method, params);
  }
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

  public registerHandler<P, R>(method: string, handler: Handler<P, R>) {
    this.handlers.set(method, handler as Handler<any, any>);
  }

  public serve() {
    chrome.runtime.onMessage.addListener(
      (
        request: MessageRequest,
        _sender: chrome.runtime.MessageSender,
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
