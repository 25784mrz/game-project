/**
 * 场景管理器
 * 负责场景加载、切换、预加载
 */
import { Component } from 'cc';
export declare class SceneManager extends Component {
    private static instance;
    defaultScene: string;
    loadingScene: string;
    private sceneQueue;
    private isLoading;
    private preloadCache;
    private scenes;
    static getInstance(): SceneManager;
    onLoad(): void;
    start(): void;
    /**
     * 加载场景
     */
    loadScene(sceneName: string, onProgress?: (progress: number) => void): Promise<void>;
    /**
     * 预加载场景
     */
    preloadScene(sceneName: string): Promise<void>;
    /**
     * 切换场景
     */
    switchToScene(sceneName: string): void;
    /**
     * 处理场景队列
     */
    private processSceneQueue;
    /**
     * 加载单个场景
     */
    private loadSingleScene;
    /**
     * 预加载标记的场景
     */
    private preloadMarkedScenes;
    /**
     * 获取当前场景名
     */
    getCurrentScene(): string;
    /**
     * 注册新场景
     */
    registerScene(name: string, path: string, preload?: boolean): void;
}
