export interface MessageRequest<T = unknown> {
  method: string;
  params: T;
}

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
