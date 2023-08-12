export class clientError {
  static apiError(msg: string, url: string, route: string, status: number, method: string) {
    const error = new Error(msg);
    error.name = 'clientError -> [DiscordError]';
    error.url = url;
    error.route = route;
    error.code = status;
    error.method = method;
    throw error;
  }

  static WebSocketError(msg: string, code: number) {
    const error = new Error(msg);
    error.name = 'clientError -> [WebSocketError]';
    error.code = code;
    throw error;
  }
}
