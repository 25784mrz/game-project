/**
 * 事件系统
 * 全局事件总线，模块间松耦合通信
 */

import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

type EventCallback = (...args: any[]) => void;

@ccclass('EventSystem')
export class EventSystem extends Component {
    private static instance: EventSystem;
    
    private eventTarget: EventTarget;
    private eventHistory: Array<{
        type: string;
        timestamp: number;
        args: any[];
    }> = [];
    
    @property
    maxHistorySize: number = 100;
    
    @property
    debugMode: boolean = false;
    
    static getInstance(): EventSystem {
        if (!EventSystem.instance) {
            const node = new Node('EventSystem');
            EventSystem.instance = node.addComponent(EventSystem);
            game.addPersistRootNode(node);
        }
        return EventSystem.instance;
    }
    
    constructor() {
        super();
        this.eventTarget = new EventTarget();
    }
    
    onLoad() {
        if (EventSystem.instance && EventSystem.instance !== this) {
            this.node.destroy();
            return;
        }
        console.log('[EventSystem] Initialized');
    }
    
    /**
     * 监听事件
     */
    on(type: string, callback: EventCallback, target?: any): void {
        this.eventTarget.on(type, callback, target);
        this.log(`Event registered: ${type}`);
    }
    
    /**
     * 监听一次事件
     */
    once(type: string, callback: EventCallback, target?: any): void {
        this.eventTarget.once(type, callback, target);
        this.log(`Event registered (once): ${type}`);
    }
    
    /**
     * 移除监听
     */
    off(type: string, callback?: EventCallback, target?: any): void {
        this.eventTarget.off(type, callback, target);
        this.log(`Event removed: ${type}`);
    }
    
    /**
     * 触发事件
     */
    emit(type: string, ...args: any[]): void {
        this.eventTarget.emit(type, ...args);
        this.log(`Event emitted: ${type}`, args);
        
        // 记录事件历史
        this.recordEvent(type, args);
    }
    
    /**
     * 触发事件并等待响应
     */
    async emitAsync(type: string, ...args: any[]): Promise<any[]> {
        return new Promise((resolve) => {
            const results: any[] = [];
            const callbacks = this.eventTarget['map']?.get(type) || [];
            
            for (const callback of callbacks) {
                try {
                    const result = callback.callback.apply(callback.target, args);
                    if (result instanceof Promise) {
                        results.push(result);
                    } else {
                        results.push(Promise.resolve(result));
                    }
                } catch (err) {
                    console.error(`[EventSystem] Callback error for ${type}:`, err);
                }
            }
            
            Promise.all(results).then(resolve).catch(() => resolve(results));
        });
    }
    
    /**
     * 清除所有事件
     */
    clear(): void {
        this.eventTarget.off();
        this.eventHistory = [];
        console.log('[EventSystem] All events cleared');
    }
    
    /**
     * 获取事件监听器数量
     */
    getListenerCount(type: string): number {
        return this.eventTarget['map']?.get(type)?.length || 0;
    }
    
    /**
     * 检查是否有监听器
     */
    hasListener(type: string): boolean {
        return this.getListenerCount(type) > 0;
    }
    
    /**
     * 获取事件历史
     */
    getEventHistory(limit: number = 10): Array<{ type: string; timestamp: number; args: any[] }> {
        return this.eventHistory.slice(-limit);
    }
    
    /**
     * 清空事件历史
     */
    clearHistory(): void {
        this.eventHistory = [];
    }
    
    /**
     * 记录事件
     */
    private recordEvent(type: string, args: any[]): void {
        this.eventHistory.push({
            type,
            timestamp: Date.now(),
            args
        });
        
        // 限制历史记录大小
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }
    
    /**
     * 日志输出
     */
    private log(message: string, ...args: any[]): void {
        if (this.debugMode) {
            console.log(`[EventSystem] ${message}`, ...args);
        }
    }
}
