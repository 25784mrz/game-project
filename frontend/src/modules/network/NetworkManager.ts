/**
 * 网络通信模块 - WebSocket 客户端
 * 处理与服务器的双向通信
 */

import { EventSystem } from '@core/EventSystem';

export enum MessageType {
  // 连接相关
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  
  // 认证相关
  AUTH_LOGIN = 'auth_login',
  AUTH_REGISTER = 'auth_register',
  AUTH_LOGOUT = 'auth_logout',
  AUTH_TOKEN = 'auth_token',
  
  // 游戏相关
  GAME_ACTION = 'game_action',
  GAME_STATE = 'game_state',
  GAME_EVENT = 'game_event',
  
  // 语音相关
  AUDIO_REQUEST = 'audio_request',
  AUDIO_RESPONSE = 'audio_response',
  AUDIO_STREAM = 'audio_stream',
  
  // 资源相关
  RESOURCE_REQUEST = 'resource_request',
  RESOURCE_RESPONSE = 'resource_response',
  
  // 错误
  ERROR = 'error'
}

export interface NetworkMessage {
  type: MessageType;
  data?: any;
  requestId?: string;
  timestamp?: number;
}

export class NetworkManager {
  private static instance: NetworkManager;
  private ws: WebSocket | null = null;
  private url: string;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private messageQueue: NetworkMessage[] = [];
  private eventSystem: EventSystem;

  private constructor(url: string = 'ws://localhost:8080') {
    this.url = url;
    this.eventSystem = EventSystem.getInstance();
  }

  static getInstance(url?: string): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager(url);
    }
    return NetworkManager.instance;
  }

  /**
   * 连接服务器
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          console.log('[Network] Connected to server');
          this.eventSystem.emit('network:connected');
          
          // 发送积压的消息
          this.flushMessageQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: NetworkMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (err) {
            console.error('[Network] Failed to parse message:', err);
          }
        };

        this.ws.onclose = () => {
          this.connected = false;
          console.log('[Network] Disconnected from server');
          this.eventSystem.emit('network:disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[Network] WebSocket error:', error);
          this.eventSystem.emit('network:error', error);
          reject(error);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }

  /**
   * 发送消息
   */
  send(message: NetworkMessage): void {
    message.timestamp = Date.now();
    
    if (this.connected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // 加入队列
      this.messageQueue.push(message);
    }
  }

  /**
   * 发送请求并等待响应
   */
  request(message: NetworkMessage, timeout: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = message.requestId || `req_${Date.now()}_${Math.random()}`;
      message.requestId = requestId;

      const handler = (response: NetworkMessage) => {
        if (response.requestId === requestId) {
          this.eventSystem.off('network:message', handler);
          resolve(response.data);
        }
      };

      this.eventSystem.on('network:message', handler);
      this.send(message);

      // 超时处理
      setTimeout(() => {
        this.eventSystem.off('network:message', handler);
        reject(new Error('Request timeout'));
      }, timeout);
    });
  }

  private handleMessage(message: NetworkMessage): void {
    console.log('[Network] Received:', message);
    this.eventSystem.emit('network:message', message);
    this.eventSystem.emit(`network:${message.type}`, message.data);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.connected) {
      const message = this.messageQueue.shift()!;
      this.send(message);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Network] Max reconnect attempts reached');
      this.eventSystem.emit('network:failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[Network] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.eventSystem.emit('network:reconnecting', this.reconnectAttempts);
      this.connect().catch(console.error);
    }, delay);
  }

  isConnected(): boolean {
    return this.connected;
  }
}
