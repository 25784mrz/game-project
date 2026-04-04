/**
 * 资源管理器
 * 异步加载资源 + 引用计数 + 自动释放
 */
import { Component } from 'cc';
type ResourceType = 'image' | 'audio' | 'prefab' | 'json' | 'other';
export declare class ResourceManager extends Component {
    private static instance;
    maxCacheSize: number;
    autoReleaseThreshold: number;
    private resourceCache;
    private loadQueue;
    private isProcessing;
    static getInstance(): ResourceManager;
    onLoad(): void;
    /**
     * 加载资源
     */
    load<T>(path: string, type?: ResourceType): Promise<T>;
    /**
     * 批量加载资源
     */
    loadBatch(paths: Array<{
        path: string;
        type: ResourceType;
    }>): Promise<Map<string, any>>;
    /**
     * 预加载资源
     */
    preload(paths: Array<{
        path: string;
        type: ResourceType;
    }>): Promise<void>;
    /**
     * 释放资源
     */
    release(path: string): void;
    /**
     * 强制释放资源
     */
    forceRelease(path: string): void;
    /**
     * 清空所有资源
     */
    clearAll(): void;
    /**
     * 获取缓存数量
     */
    getCacheSize(): number;
    /**
     * 获取缓存信息
     */
    getCacheInfo(): Array<{
        path: string;
        count: number;
        type: string;
    }>;
    /**
     * 加入加载队列
     */
    private enqueueLoad;
    /**
     * 处理加载队列
     */
    private processQueue;
    /**
     * 执行加载
     */
    private doLoad;
    /**
     * 获取资源类
     */
    private getAssetClass;
    /**
     * 添加到缓存
     */
    private addToCache;
    /**
     * 从缓存移除
     */
    private removeFromCache;
    /**
     * 检查自动释放
     */
    private checkAutoRelease;
}
export {};
