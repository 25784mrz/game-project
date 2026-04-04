/**
 * 事件系统
 * 全局事件总线，模块间松耦合通信
 */
import { Component } from 'cc';
type EventCallback = (...args: any[]) => void;
export declare class EventSystem extends Component {
    private static instance;
    private eventTarget;
    private eventHistory;
    maxHistorySize: number;
    debugMode: boolean;
    static getInstance(): EventSystem;
    constructor();
    onLoad(): void;
    /**
     * 监听事件
     */
    on(type: string, callback: EventCallback, target?: any): void;
    /**
     * 监听一次事件
     */
    once(type: string, callback: EventCallback, target?: any): void;
    /**
     * 移除监听
     */
    off(type: string, callback?: EventCallback, target?: any): void;
    /**
     * 触发事件
     */
    emit(type: string, ...args: any[]): void;
    /**
     * 触发事件并等待响应
     */
    emitAsync(type: string, ...args: any[]): Promise<any[]>;
    /**
     * 清除所有事件
     */
    clear(): void;
    /**
     * 获取事件监听器数量
     */
    getListenerCount(type: string): number;
    /**
     * 检查是否有监听器
     */
    hasListener(type: string): boolean;
    /**
     * 获取事件历史
     */
    getEventHistory(limit?: number): Array<{
        type: string;
        timestamp: number;
        args: any[];
    }>;
    /**
     * 清空事件历史
     */
    clearHistory(): void;
    /**
     * 记录事件
     */
    private recordEvent;
    /**
     * 日志输出
     */
    private log;
}
export {};
