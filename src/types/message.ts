export interface MessageRequest<T = any> {
  action: string;
  params: T;
}

export interface MessageResponse {
  success: boolean;
  data?: any;
  error?: string;
}
