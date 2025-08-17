import { MessageRequest, MessageResponse } from './types/message';

/**
 * 通用消息发送服务
 * 提供向 background script 和 content script 发送消息的通用方法
 */
export class MessageService {
  /**
   * 向 background script 发送消息
   * @param method 方法名
   * @param params 参数
   * @returns Promise<R> 返回数据
   */
  static async sendToBackground<P, R>(method: string, params: P): Promise<R> {
    try {
      const request: MessageRequest<P> = {
        method,
        params,
      };

      const response = (await chrome.runtime.sendMessage(request)) as MessageResponse<R>;

      if (response.success) {
        return response.data!;
      } else {
        throw new Error(response.error || 'Unknown error');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error');
    }
  }

  /**
   * 向当前活动标签页的 content script 发送消息
   * @param method 方法名
   * @param params 参数
   * @returns Promise<R> 返回数据
   */
  static async sendToContent<P, R>(method: string, params: P): Promise<R> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        const activeTab = tabs[0];
        if (!activeTab?.id) {
          reject(new Error('No active tab found'));
          return;
        }

        chrome.tabs.sendMessage(activeTab.id, { method, params }, (response: R) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    });
  }

  /**
   * 向指定标签页的 content script 发送消息
   * @param method 方法名
   * @param params 参数
   * @param tabId 目标标签页ID
   * @returns Promise<R> 返回数据
   */
  static async sendToContentTab<P, R>(method: string, params: P, tabId: number): Promise<R> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, { method, params }, (response: R) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * 向所有标签页的 content script 发送消息
   * @param method 方法名
   * @param params 参数
   * @returns Promise<R[]> 返回所有标签页的响应数据
   */
  static async sendToAllContent<P, R>(method: string, params: P): Promise<R[]> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        const promises: Promise<R>[] = [];

        tabs.forEach((tab) => {
          if (tab.id) {
            promises.push(
              new Promise<R>((resolveTab) => {
                chrome.tabs.sendMessage(tab.id!, { method, params }, (response: R) => {
                  if (chrome.runtime.lastError) {
                    // 忽略没有 content script 的标签页错误
                    resolveTab(null as R);
                  } else {
                    resolveTab(response);
                  }
                });
              })
            );
          }
        });

        Promise.all(promises)
          .then((responses) => resolve(responses.filter((r) => r !== null)))
          .catch(reject);
      });
    });
  }

  /**
   * 向指定窗口的所有标签页发送消息
   * @param method 方法名
   * @param params 参数
   * @param windowId 窗口ID
   * @returns Promise<R[]> 返回所有标签页的响应数据
   */
  static async sendToWindowContent<P, R>(
    method: string,
    params: P,
    windowId: number
  ): Promise<R[]> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ windowId }, (tabs: chrome.tabs.Tab[]) => {
        const promises: Promise<R>[] = [];

        tabs.forEach((tab) => {
          if (tab.id) {
            promises.push(
              new Promise<R>((resolveTab) => {
                chrome.tabs.sendMessage(tab.id!, { method, params }, (response: R) => {
                  if (chrome.runtime.lastError) {
                    // 忽略没有 content script 的标签页错误
                    resolveTab(null as R);
                  } else {
                    resolveTab(response);
                  }
                });
              })
            );
          }
        });

        Promise.all(promises)
          .then((responses) => resolve(responses.filter((r) => r !== null)))
          .catch(reject);
      });
    });
  }
}

// 为了向后兼容，导出简化的函数
export const sendMessage = MessageService.sendToBackground;
export const sendToContent = MessageService.sendToContent;
export const sendToContentTab = MessageService.sendToContentTab;
export const sendToAllContent = MessageService.sendToAllContent;
export const sendToWindowContent = MessageService.sendToWindowContent;
