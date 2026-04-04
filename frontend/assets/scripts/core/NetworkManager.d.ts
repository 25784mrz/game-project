/**
 * 网络管理器
 * WebSocket 连接管理、消息序列化、自动重连
 */
import { Component } from 'cc';
declare enum ConnectionState {
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    RECONNECTING = "reconnecting"
}
export declare class NetworkManager extends Component {
    private static instance;
    serverUrl: string;
    autoReconnect: boolean;
    reconnectDelay: number;
    maxReconnectAttempts: number;
    requestTimeout: number;
    debugMode: boolean;
    private ws;
    private state;
    private reconnectAttempts;
    private messageQueue;
    private pendingRequests;
    private eventListeners;
    private heartbeatTimer;
    private heartbeatInterval;
    static getInstance(): NetworkManager;
    onLoad(): void;
    onDestroy(): void;
    /**
     * 连接服务器
     */
    connect(url?: string): Promise<void>;
    /**
     * 断开连接
     */
    disconnect(): void;
    /**
     * 发送消息
     */
    send(type: string, data?: any): void;
    /**
     * 发送请求并等待响应
     */
    request(type: string, data?: any): Promise<any>;
    /**
     * 监听事件
     */
    on(type: string, callback: (data: any) => void): void;
    /**
     * 移除监听
     */
    off(type: string, callback?: (data: any) => void): void;
    /**
     * 获取连接状态
     */
    getState(): ConnectionState;
    /**
     * 检查是否已连接
     */
    isConnected(): boolean;
    /**
     * 处理接收到的消息
     */
    private handleMessage;
    /**
     * 刷新消息队列
     */
    private flushMessageQueue;
    /**
     * 计划重连
     */
    private scheduleReconnect;
    /**
     * 更新状态
     */
    private updateState;
    /**
     * 启动心跳
     */
    private startHeartbeat;
    /**
     * 停止心跳
     */
    private stopHeartbeat;
    /**
     * 日志输出
     */
    private log;
}
export {};
