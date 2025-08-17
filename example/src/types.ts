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
