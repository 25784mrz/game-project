/**
 * Boot 场景启动脚本
 * 负责初始化游戏和预加载资源
 */

import { _decorator, Component, ProgressBar, Label, Node } from 'cc';
import { GameManager, GameState } from '../core/GameManager';
import { SceneManager } from '../core/SceneManager';
import { ResourceManager } from '../core/ResourceManager';
import { EventSystem } from '../core/EventSystem';
import { UIManager } from '../core/UIManager';
import { InputManager } from '../core/InputManager';
import { AudioController } from '../components/AudioController';
import { LoginUIBuilder } from '../modules/auth/LoginUIBuilder';
import { TweenUtils } from '../../utils/TweenUtils';

const { ccclass, property } = _decorator;

@ccclass('BootController')
export class BootController extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar | null = null;
    
    @property(Label)
    loadingText: Label | null = null;
    
    @property(Node)
    loadingUI: Node | null = null;
    
    private gameManager: GameManager | null = null;
    private sceneManager: SceneManager | null = null;
    private resourceManager: ResourceManager | null = null;
    
    start() {
        // 获取管理器实例
        this.gameManager = GameManager.getInstance();
        this.sceneManager = SceneManager.getInstance();
        this.resourceManager = ResourceManager.getInstance();
        
        // 初始化全局管理器
        this.initManagers();
        
        // 开始加载流程
        this.startLoading();
    }
    
    /**
     * 初始化全局管理器
     */
    private initManagers(): void {
        console.log('[Boot] Initializing managers...');
        
        // 创建持久化节点
        const uiManagerNode = new Node('UIManager');
        uiManagerNode.addComponent(UIManager);
        game.addPersistRootNode(uiManagerNode);
        
        const inputManagerNode = new Node('InputManager');
        inputManagerNode.addComponent(InputManager);
        game.addPersistRootNode(inputManagerNode);
        
        const audioManagerNode = new Node('AudioManager');
        audioManagerNode.addComponent(AudioController);
        game.addPersistRootNode(audioManagerNode);
        
        console.log('[Boot] Managers initialized');
    }
    
    /**
     * 开始加载流程
     */
    private async startLoading(): Promise<void> {
        console.log('[Boot] Starting loading...');
        
        // 预加载资源列表
        const resources = [
            { path: 'textures/common', type: 'image' as const, weight: 0.3 },
            { path: 'audio/bgm', type: 'audio' as const, weight: 0.2 },
            { path: 'audio/click', type: 'audio' as const, weight: 0.1 },
            { path: 'prefabs/LoginUI', type: 'prefab' as const, weight: 0.2 },
            { path: 'prefabs/MainMenuUI', type: 'prefab' as const, weight: 0.2 }
        ];
        
        let loadedCount = 0;
        const totalCount = resources.length;
        
        // 逐个加载资源
        for (const resource of resources) {
            try {
                await this.resourceManager?.load(resource.path, resource.type);
                loadedCount++;
                this.updateProgress(loadedCount / totalCount);
                console.log(`[Boot] Loaded: ${resource.path}`);
            } catch (error) {
                console.warn(`[Boot] Failed to load ${resource.path}:`, error);
            }
        }
        
        // 延迟一下，确保进度条显示完成
        await this.delay(500);
        
        // 加载主菜单场景
        this.updateText('准备进入主菜单...');
        await this.delay(300);
        
        // 切换到主菜单场景
        await this.sceneManager?.loadScene('main-menu');
    }
    
    /**
     * 更新进度条
     */
    private updateProgress(progress: number): void {
        if (this.progressBar) {
            this.progressBar.progress = Math.min(progress, 1);
        }
        
        const percent = Math.floor(progress * 100);
        this.updateText(`加载中... ${percent}%`);
    }
    
    /**
     * 更新文本
     */
    private updateText(text: string): void {
        if (this.loadingText) {
            this.loadingText.string = text;
        }
    }
    
    /**
     * 延迟函数
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * 显示登录界面（可选）
     */
    private showLoginUI(): void {
        if (!this.loadingUI) return;
        
        // 隐藏加载 UI
        if (this.loadingUI) {
            TweenUtils.fadeOut(this.loadingUI, 0.3, () => {
                this.loadingUI!.active = false;
            });
        }
        
        // 创建并显示登录 UI
        const loginUINode = new Node('LoginUI');
        loginUINode.parent = this.node;
        
        const builder = loginUINode.addComponent(LoginUIBuilder);
        const uiRoot = builder.buildLoginUI();
        uiRoot.parent = loginUINode;
        
        // 播放入场动画
        builder.playEnterAnimation(uiRoot);
    }
}
