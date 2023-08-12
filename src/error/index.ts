class StarcordError extends Error {
  constructor(message: string, code?: number, method?: string, url?: string) {
    super(message);
    this.name = 'StarcordError';
    this.code = code;
    this.method = method;
    this.url = url;
  }

  code?: number;
  method?: string;
  url?: string;
}

class ApiError extends StarcordError {
  constructor(message: string, code?: number, method?: string, url?: string) {
    super(message, code, method, url);
    this.name = 'ApiError';
  }
}

class WebsocketError extends StarcordError {
  constructor(message: string, code?: number, method?: string, url?: string) {
    super(message, code, method, url);
    this.name = 'WebsocketError';
  }
}

export { StarcordError, ApiError, WebsocketError };
