/**
 * 资源管理器
 * 异步加载资源 + 引用计数 + 自动释放
 */

import { _decorator, Component, AssetManager, ImageAsset, SpriteFrame, AudioClip, Prefab, Node, resources } from 'cc';
const { ccclass, property } = _decorator;

interface ResourceRef {
    asset: any;
    count: number;
    type: 'image' | 'audio' | 'prefab' | 'json' | 'other';
}

type ResourceType = 'image' | 'audio' | 'prefab' | 'json' | 'other';

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static instance: ResourceManager;
    
    @property
    maxCacheSize: number = 100;
    
    @property
    autoReleaseThreshold: number = 200;
    
    private resourceCache: Map<string, ResourceRef> = new Map();
    private loadQueue: Array<{
        path: string;
        type: ResourceType;
        resolve: (asset: any) => void;
        reject: (err: Error) => void;
    }> = [];
    private isProcessing: boolean = false;
    
    static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            const node = new Node('ResourceManager');
            ResourceManager.instance = node.addComponent(ResourceManager);
            game.addPersistRootNode(node);
        }
        return ResourceManager.instance;
    }
    
    onLoad() {
        if (ResourceManager.instance && ResourceManager.instance !== this) {
            this.node.destroy();
            return;
        }
        console.log('[ResourceManager] Initialized, max cache:', this.maxCacheSize);
    }
    
    /**
     * 加载资源
     */
    async load<T>(path: string, type: ResourceType = 'other'): Promise<T> {
        // 检查缓存
        const cached = this.resourceCache.get(path);
        if (cached) {
            cached.count++;
            console.log(`[ResourceManager] Cache hit: ${path} (count: ${cached.count})`);
            return cached.asset as T;
        }
        
        // 加入加载队列
        return this.enqueueLoad(path, type);
    }
    
    /**
     * 批量加载资源
     */
    async loadBatch(paths: Array<{ path: string; type: ResourceType }>): Promise<Map<string, any>> {
        const results = new Map<string, any>();
        const promises = paths.map(async ({ path, type }) => {
            try {
                const asset = await this.load(path, type);
                results.set(path, asset);
            } catch (err) {
                console.error(`[ResourceManager] Failed to load: ${path}`, err);
            }
        });
        
        await Promise.all(promises);
        return results;
    }
    
    /**
     * 预加载资源
     */
    async preload(paths: Array<{ path: string; type: ResourceType }>): Promise<void> {
        console.log(`[ResourceManager] Preloading ${paths.length} resources...`);
        
        const promises = paths.map(({ path, type }) => 
            this.load(path, type).catch(err => {
                console.warn(`[ResourceManager] Preload warning: ${path}`, err);
            })
        );
        
        await Promise.all(promises);
        console.log('[ResourceManager] Preload complete');
    }
    
    /**
     * 释放资源
     */
    release(path: string): void {
        const ref = this.resourceCache.get(path);
        if (!ref) {
            console.warn(`[ResourceManager] Resource not found: ${path}`);
            return;
        }
        
        ref.count--;
        console.log(`[ResourceManager] Released: ${path} (count: ${ref.count})`);
        
        if (ref.count <= 0) {
            this.removeFromCache(path, ref);
        }
        
        this.checkAutoRelease();
    }
    
    /**
     * 强制释放资源
     */
    forceRelease(path: string): void {
        const ref = this.resourceCache.get(path);
        if (ref) {
            this.removeFromCache(path, ref);
            console.log(`[ResourceManager] Force released: ${path}`);
        }
    }
    
    /**
     * 清空所有资源
     */
    clearAll(): void {
        console.log('[ResourceManager] Clearing all resources...');
        
        for (const [path, ref] of this.resourceCache.entries()) {
            this.removeFromCache(path, ref);
        }
        
        this.resourceCache.clear();
        this.loadQueue = [];
        this.isProcessing = false;
    }
    
    /**
     * 获取缓存数量
     */
    getCacheSize(): number {
        return this.resourceCache.size;
    }
    
    /**
     * 获取缓存信息
     */
    getCacheInfo(): Array<{ path: string; count: number; type: string }> {
        return Array.from(this.resourceCache.entries()).map(([path, ref]) => ({
            path,
            count: ref.count,
            type: ref.type
        }));
    }
    
    /**
     * 加入加载队列
     */
    private enqueueLoad(path: string, type: ResourceType): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loadQueue.push({ path, type, resolve, reject });
            this.processQueue();
        });
    }
    
    /**
     * 处理加载队列
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.loadQueue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        
        while (this.loadQueue.length > 0) {
            const { path, type, resolve, reject } = this.loadQueue.shift()!;
            
            try {
                const asset = await this.doLoad(path, type);
                resolve(asset);
            } catch (err) {
                reject(err as Error);
            }
        }
        
        this.isProcessing = false;
    }
    
    /**
     * 执行加载
     */
    private doLoad(path: string, type: ResourceType): Promise<any> {
        return new Promise((resolve, reject) => {
            const assetClass = this.getAssetClass(type);
            
            resources.load(path, assetClass, (err: Error | null, asset: any) => {
                if (err) {
                    console.error(`[ResourceManager] Load failed: ${path}`, err);
                    reject(err);
                    return;
                }
                
                // 添加到缓存
                this.addToCache(path, asset, type);
                resolve(asset);
            });
        });
    }
    
    /**
     * 获取资源类
     */
    private getAssetClass(type: ResourceType): any {
        switch (type) {
            case 'image':
                return ImageAsset;
            case 'audio':
                return AudioClip;
            case 'prefab':
                return Prefab;
            default:
                return null;
        }
    }
    
    /**
     * 添加到缓存
     */
    private addToCache(path: string, asset: any, type: ResourceType): void {
        this.resourceCache.set(path, {
            asset,
            count: 1,
            type
        });
        console.log(`[ResourceManager] Cached: ${path} (${type})`);
    }
    
    /**
     * 从缓存移除
     */
    private removeFromCache(path: string, ref: ResourceRef): void {
        if (ref.asset && typeof ref.asset.destroy === 'function') {
            ref.asset.destroy();
        }
        this.resourceCache.delete(path);
    }
    
    /**
     * 检查自动释放
     */
    private checkAutoRelease(): void {
        if (this.resourceCache.size > this.autoReleaseThreshold) {
            console.log('[ResourceManager] Auto release triggered');
            
            // 释放引用计数为 0 的资源
            for (const [path, ref] of this.resourceCache.entries()) {
                if (ref.count <= 0) {
                    this.removeFromCache(path, ref);
                }
            }
        }
    }
}
