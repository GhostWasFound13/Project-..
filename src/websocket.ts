import WebSocket from 'ws';
import { GatewayEventNames, GatewayOpCodes } from './enums';
import { clientError } from './Error';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnecting: boolean = false;

  constructor(apiUrl: string) {
    this.connect(apiUrl);
  }

  private connect(apiUrl: string) {
    this.ws = new WebSocket(apiUrl);

    this.ws.on('open', () => {
      console.log('Connected to gateway');
    });

    this.ws.on('message', (data) => {
      this.handleMessage(data);
    });

    this.ws.on('close', (code, reason) => {
      console.log(`Connection closed with code ${code}: ${reason}`);
      if (!this.reconnecting) {
        this.reconnect(code);
      }
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleMessage(data: WebSocket.Data) {
    const message = JSON.parse(data.toString());

    switch (message.op) {
      case GatewayOpCodes.HELLO:
        this.handleHello(message.d);
        break;
      // Add more cases for other opcodes as needed
    }
  }

  private handleHello(data: any) {
    const interval = data.heartbeat_interval;

    setInterval(() => {
      this.sendHeartbeat();
    }, interval);
  }

  private sendHeartbeat() {
    if (!this.ws) return;

    const payload = {
      op: GatewayOpCodes.HEARTBEAT,
      d: null,
    };

    this.ws.send(JSON.stringify(payload));
  }

  private reconnect(code: number) {
    if (code === 1000 || code === 1001 || code === 1006) {
      this.reconnecting = true;
      setTimeout(() => {
        console.log('Reconnecting...');
        this.connect('wss://gateway.discord.gg/?v=10&encoding=json'); // Adjust URL as needed
        this.reconnecting = false;
      }, 5000); // Wait for 5 seconds before reconnecting
    } else {
      throw clientError.WebSocketError(`WebSocket connection closed with code ${code}`, code);
    }
  }

  public onMessage(callback: (data: any) => void) {
    this.ws?.on('message', (data) => {
      const message = JSON.parse(data.toString());
      callback(message);
    });
  }
}
