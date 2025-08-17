export interface MessageRequest<T = unknown> {
  method: string;
  params: T;
}

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TestMessageParams {
  message: string;
  timestamp: string;
}

export interface BackgroundMessageParams {
  message: string;
  originalMessage: string;
  timestamp: string;
}

export interface ContentResponse {
  message: string;
  receivedAt: string;
  originalMessage: string;
}

export interface SendToContentParams {
  message: string;
  action: 'showNotification' | 'getPageInfo' | 'injectScript';
  data?: any;
}

export interface PageInfoParams {
  includeDOM?: boolean;
  includeMeta?: boolean;
}

export interface InjectScriptParams {
  script: string;
  type?: 'inline' | 'file';
}

export interface StorageParams {
  key: string;
  value?: any;
}
