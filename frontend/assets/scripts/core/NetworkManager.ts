/**
 * 网络管理器
 * WebSocket 连接管理、消息序列化、自动重连
 */

import { _decorator, Component, Node, game } from 'cc';
const { ccclass, property } = _decorator;

interface Message {
    type: string;
    data?: any;
    id?: string;
    timestamp?: number;
}

interface PendingRequest {
    id: string;
    resolve: (data: any) => void;
    reject: (err: Error) => void;
    timeout: NodeJS.Timeout;
}

enum ConnectionState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting'
}

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    private static instance: NetworkManager;
    
    @property
    serverUrl: string = 'ws://localhost:8080';
    
    @property
    autoReconnect: boolean = true;
    
    @property
    reconnectDelay: number = 3000;
    
    @property
    maxReconnectAttempts: number = 5;
    
    @property
    requestTimeout: number = 10000;
    
    @property
    debugMode: boolean = false;
    
    private ws: WebSocket | null = null;
    private state: ConnectionState = ConnectionState.DISCONNECTED;
    private reconnectAttempts: number = 0;
    private messageQueue: Message[] = [];
    private pendingRequests: Map<string, PendingRequest> = new Map();
    private eventListeners: Map<string, Array<(data: any) => void>> = new Map();
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private heartbeatInterval: number = 30000;
    
    static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            const node = new Node('NetworkManager');
            NetworkManager.instance = node.addComponent(NetworkManager);
            game.addPersistRootNode(node);
        }
        return NetworkManager.instance;
    }
    
    onLoad() {
        if (NetworkManager.instance && NetworkManager.instance !== this) {
            this.node.destroy();
            return;
        }
        console.log('[NetworkManager] Initialized');
    }
    
    onDestroy() {
        this.disconnect();
    }
    
    /**
     * 连接服务器
     */
    async connect(url?: string): Promise<void> {
        if (url) {
            this.serverUrl = url;
        }
        
        if (this.state === ConnectionState.CONNECTED || this.state === ConnectionState.CONNECTING) {
            this.log('Already connected or connecting');
            return;
        }
        
        this.updateState(ConnectionState.CONNECTING);
        
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.serverUrl);
                
                this.ws.onopen = () => {
                    this.log('Connected to server');
                    this.reconnectAttempts = 0;
                    this.updateState(ConnectionState.CONNECTED);
                    this.startHeartbeat();
                    this.flushMessageQueue();
                    resolve();
                };
                
                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };
                
                this.ws.onclose = () => {
                    this.log('Connection closed');
                    this.updateState(ConnectionState.DISCONNECTED);
                    this.stopHeartbeat();
                    
                    if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.scheduleReconnect();
                    }
                };
                
                this.ws.onerror = (error) => {
                    console.error('[NetworkManager] WebSocket error:', error);
                    reject(new Error('WebSocket connection failed'));
                };
            } catch (err) {
                this.updateState(ConnectionState.DISCONNECTED);
                reject(err as Error);
            }
        });
    }
    
    /**
     * 断开连接
     */
    disconnect(): void {
        this.autoReconnect = false;
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.updateState(ConnectionState.DISCONNECTED);
        this.pendingRequests.forEach((request) => {
            clearTimeout(request.timeout);
            request.reject(new Error('Disconnected'));
        });
        this.pendingRequests.clear();
        
        this.log('Disconnected');
    }
    
    /**
     * 发送消息
     */
    send(type: string, data?: any): void {
        const message: Message = {
            type,
            data,
            timestamp: Date.now()
        };
        
        if (this.state === ConnectionState.CONNECTED && this.ws) {
            this.ws.send(JSON.stringify(message));
            this.log('Sent:', message);
        } else {
            this.messageQueue.push(message);
            this.log('Queued:', message);
        }
    }
    
    /**
     * 发送请求并等待响应
     */
    request(type: string, data?: any): Promise<any> {
        const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pendingRequests.delete(id);
                reject(new Error(`Request timeout: ${type}`));
            }, this.requestTimeout);
            
            this.pendingRequests.set(id, { id, resolve, reject, timeout });
            
            const message: Message = {
                type,
                data,
                id,
                timestamp: Date.now()
            };
            
            if (this.state === ConnectionState.CONNECTED && this.ws) {
                this.ws.send(JSON.stringify(message));
            } else {
                this.messageQueue.push(message);
            }
        });
    }
    
    /**
     * 监听事件
     */
    on(type: string, callback: (data: any) => void): void {
        if (!this.eventListeners.has(type)) {
            this.eventListeners.set(type, []);
        }
        this.eventListeners.get(type)!.push(callback);
    }
    
    /**
     * 移除监听
     */
    off(type: string, callback?: (data: any) => void): void {
        const listeners = this.eventListeners.get(type);
        if (!listeners) return;
        
        if (callback) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        } else {
            this.eventListeners.delete(type);
        }
    }
    
    /**
     * 获取连接状态
     */
    getState(): ConnectionState {
        return this.state;
    }
    
    /**
     * 检查是否已连接
     */
    isConnected(): boolean {
        return this.state === ConnectionState.CONNECTED;
    }
    
    /**
     * 处理接收到的消息
     */
    private handleMessage(rawData: string): void {
        try {
            const message: Message = JSON.parse(rawData);
            this.log('Received:', message);
            
            // 检查是否是请求响应
            if (message.id && this.pendingRequests.has(message.id)) {
                const request = this.pendingRequests.get(message.id)!;
                clearTimeout(request.timeout);
                this.pendingRequests.delete(message.id);
                request.resolve(message.data);
                return;
            }
            
            // 触发事件监听器
            const listeners = this.eventListeners.get(message.type);
            if (listeners) {
                listeners.forEach(callback => callback(message.data));
            }
        } catch (err) {
            console.error('[NetworkManager] Failed to parse message:', err);
        }
    }
    
    /**
     * 刷新消息队列
     */
    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0 && this.ws) {
            const message = this.messageQueue.shift()!;
            this.ws.send(JSON.stringify(message));
            this.log('Flushed:', message);
        }
    }
    
    /**
     * 计划重连
     */
    private scheduleReconnect(): void {
        this.reconnectAttempts++;
        this.updateState(ConnectionState.RECONNECTING);
        
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            this.connect().catch(() => {});
        }, delay);
    }
    
    /**
     * 更新状态
     */
    private updateState(newState: ConnectionState): void {
        const oldState = this.state;
        this.state = newState;
        this.log(`State: ${oldState} -> ${newState}`);
    }
    
    /**
     * 启动心跳
     */
    private startHeartbeat(): void {
        this.stopHeartbeat();
        
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected()) {
                this.send('heartbeat', { timestamp: Date.now() });
            }
        }, this.heartbeatInterval);
    }
    
    /**
     * 停止心跳
     */
    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    
    /**
     * 日志输出
     */
    private log(message: string, ...args: any[]): void {
        if (this.debugMode) {
            console.log(`[NetworkManager] ${message}`, ...args);
        }
    }
}
