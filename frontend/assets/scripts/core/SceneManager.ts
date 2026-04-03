/**
 * 场景管理器
 * 负责场景加载、切换、预加载
 */

import { _decorator, Component, Node, director, Scene, AssetManager, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

interface SceneConfig {
    name: string;
    path: string;
    preload?: boolean;
}

@ccclass('SceneManager')
export class SceneManager extends Component {
    private static instance: SceneManager;
    
    @property
    defaultScene: string = 'boot';
    
    @property
    loadingScene: string = 'loading';
    
    private sceneQueue: string[] = [];
    private isLoading: boolean = false;
    private preloadCache: Map<string, Scene> = new Map();
    
    // 场景配置
    private scenes: Map<string, SceneConfig> = new Map([
        ['boot', { name: 'boot', path: 'scenes/boot', preload: true }],
        ['main-menu', { name: 'main-menu', path: 'scenes/main-menu' }],
        ['game', { name: 'game', path: 'scenes/game' }]
    ]);
    
    static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            const node = new Node('SceneManager');
            SceneManager.instance = node.addComponent(SceneManager);
            game.addPersistRootNode(node);
        }
        return SceneManager.instance;
    }
    
    onLoad() {
        if (SceneManager.instance && SceneManager.instance !== this) {
            this.node.destroy();
            return;
        }
        console.log('[SceneManager] Initialized');
    }
    
    start() {
        // 预加载标记的场景
        this.preloadMarkedScenes();
    }
    
    /**
     * 加载场景
     */
    async loadScene(sceneName: string, onProgress?: (progress: number) => void): Promise<void> {
        const sceneConfig = this.scenes.get(sceneName);
        if (!sceneConfig) {
            console.error(`[SceneManager] Scene not found: ${sceneName}`);
            return;
        }
        
        // 如果已在缓存中，直接切换
        if (this.preloadCache.has(sceneName)) {
            console.log(`[SceneManager] Loading from cache: ${sceneName}`);
            this.switchToScene(sceneName);
            return;
        }
        
        // 加入队列
        this.sceneQueue.push(sceneName);
        
        if (this.isLoading) {
            return;
        }
        
        await this.processSceneQueue(onProgress);
    }
    
    /**
     * 预加载场景
     */
    async preloadScene(sceneName: string): Promise<void> {
        const sceneConfig = this.scenes.get(sceneName);
        if (!sceneConfig) {
            console.error(`[SceneManager] Scene not found: ${sceneName}`);
            return;
        }
        
        if (this.preloadCache.has(sceneName)) {
            console.log(`[SceneManager] Already preloaded: ${sceneName}`);
            return;
        }
        
        return new Promise((resolve, reject) => {
            director.preloadScene(sceneConfig.path, (err: Error | null) => {
                if (err) {
                    console.error(`[SceneManager] Preload failed: ${sceneName}`, err);
                    reject(err);
                } else {
                    console.log(`[SceneManager] Preloaded: ${sceneName}`);
                    resolve();
                }
            });
        });
    }
    
    /**
     * 切换场景
     */
    switchToScene(sceneName: string): void {
        const sceneConfig = this.scenes.get(sceneName);
        if (!sceneConfig) {
            console.error(`[SceneManager] Scene not found: ${sceneName}`);
            return;
        }
        
        console.log(`[SceneManager] Switching to: ${sceneName}`);
        
        director.loadScene(sceneConfig.path, (err: Error | null, scene: Scene) => {
            if (err) {
                console.error(`[SceneManager] Load failed: ${sceneName}`, err);
                return;
            }
            director.runScene(scene);
        });
    }
    
    /**
     * 处理场景队列
     */
    private async processSceneQueue(onProgress?: (progress: number) => void): Promise<void> {
        while (this.sceneQueue.length > 0) {
            this.isLoading = true;
            const sceneName = this.sceneQueue.shift()!;
            
            try {
                await this.loadSingleScene(sceneName, onProgress);
            } catch (err) {
                console.error(`[SceneManager] Failed to load ${sceneName}:`, err);
            }
            
            this.isLoading = false;
        }
    }
    
    /**
     * 加载单个场景
     */
    private loadSingleScene(sceneName: string, onProgress?: (progress: number) => void): Promise<void> {
        const sceneConfig = this.scenes.get(sceneName);
        if (!sceneConfig) {
            return Promise.reject(new Error(`Scene not found: ${sceneName}`));
        }
        
        return new Promise((resolve, reject) => {
            director.loadScene(sceneConfig.path, (err: Error | null, scene: Scene) => {
                if (err) {
                    reject(err);
                } else {
                    director.runScene(scene);
                    resolve();
                }
            }, onProgress);
        });
    }
    
    /**
     * 预加载标记的场景
     */
    private async preloadMarkedScenes(): Promise<void> {
        for (const [name, config] of this.scenes.entries()) {
            if (config.preload) {
                await this.preloadScene(name);
            }
        }
    }
    
    /**
     * 获取当前场景名
     */
    getCurrentScene(): string {
        return director.getScene()?.name || '';
    }
    
    /**
     * 注册新场景
     */
    registerScene(name: string, path: string, preload: boolean = false): void {
        this.scenes.set(name, { name, path, preload });
        console.log(`[SceneManager] Registered scene: ${name}`);
    }
}
