/**
 * 控制器基类
 * 为所有控制器提供通用功能和管理
 */

import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
import { EventSystem } from './EventSystem';
import { AudioController } from '../components/AudioController';
import { NetworkManager } from './NetworkManager';
import { ResourceManager } from './ResourceManager';
import { InputManager } from './InputManager';
import { UIManager } from './UIManager';

const { ccclass, property } = _decorator;

type EventCallback = (...args: any[]) => void;

export interface ControllerConfig {
    debugMode?: boolean;
    enableLogging?: boolean;
}

@ccclass('BaseController')
export class BaseController extends Component {
    @property
    debugMode: boolean = false;
    
    @property
    enableLogging: boolean = true;
    
    protected gameManager: GameManager | null = null;
    protected eventSystem: EventSystem | null = null;
    protected audioController: AudioController | null = null;
    protected networkManager: NetworkManager | null = null;
    protected resourceManager: ResourceManager | null = null;
    protected inputManager: InputManager | null = null;
    protected uiManager: UIManager | null = null;
    
    private isInitialized: boolean = false;
    private isDestroyed: boolean = false;
    private eventListeners: Array<{
        type: string;
        callback: EventCallback;
        target: any;
    }> = [];
    
    onLoad() {
        if (this.enableLogging) {
            this.log('[BaseController] onLoad called');
        }
        this.initialize();
    }
    
    start() {
        if (this.enableLogging) {
            this.log('[BaseController] start called');
        }
        if (!this.isInitialized) {
            this.initialize();
        }
        this.onControllerStart();
    }
    
    onDestroy() {
        if (this.enableLogging) {
            this.log('[BaseController] onDestroy called');
        }
        this.isDestroyed = true;
        this.cleanup();
        this.removeAllEventListeners();
    }
    
    /**
     * 初始化控制器
     */
    protected initialize(): void {
        if (this.isInitialized) return;
        
        this.gameManager = GameManager.getInstance();
        this.eventSystem = EventSystem.getInstance();
        this.audioController = AudioController.getInstance();
        this.networkManager = NetworkManager.getInstance();
        this.resourceManager = ResourceManager.getInstance();
        this.inputManager = InputManager.getInstance();
        this.uiManager = UIManager.getInstance();
        
        this.isInitialized = true;
        
        if (this.enableLogging) {
            this.log('[BaseController] Initialized');
        }
    }
    
    /**
     * 控制器启动（子类重写）
     */
    protected onControllerStart(): void {
        if (this.enableLogging) {
            this.log('[BaseController] onControllerStart (should be overridden)');
        }
    }
    
    /**
     * 清理资源（子类重写）
     */
    protected cleanup(): void {
        if (this.enableLogging) {
            this.log('[BaseController] cleanup (should be overridden)');
        }
    }
    
    /**
     * 注册事件监听器
     */
    protected on(type: string, callback: EventCallback, target?: any): void {
        if (!this.eventSystem) return;
        
        this.eventSystem.on(type, callback, target || this);
        this.eventListeners.push({ type, callback, target: target || this });
    }
    
    /**
     * 注册一次性事件监听器
     */
    protected once(type: string, callback: EventCallback, target?: any): void {
        if (!this.eventSystem) return;
        
        this.eventSystem.once(type, callback, target || this);
    }
    
    /**
     * 移除事件监听器
     */
    protected off(type: string, callback?: EventCallback, target?: any): void {
        if (!this.eventSystem) return;
        
        this.eventSystem.off(type, callback, target || this);
        
        if (!callback) {
            this.eventListeners = this.eventListeners.filter(
                listener => listener.type !== type
            );
        } else {
            this.eventListeners = this.eventListeners.filter(
                listener => !(listener.type === type && listener.callback === callback)
            );
        }
    }
    
    /**
     * 触发事件
     */
    protected emit(type: string, ...args: any[]): void {
        if (!this.eventSystem) return;
        
        this.eventSystem.emit(type, ...args);
    }
    
    /**
     * 移除所有事件监听器
     */
    protected removeAllEventListeners(): void {
        if (!this.eventSystem) return;
        
        this.eventListeners.forEach(({ type, callback, target }) => {
            this.eventSystem?.off(type, callback, target);
        });
        
        this.eventListeners = [];
    }
    
    /**
     * 安全调用方法（防止已销毁后调用）
     */
    protected safeCall(callback: EventCallback, ...args: any[]): void {
        if (this.isDestroyed) {
            this.warn('[BaseController] Attempted to call on destroyed controller');
            return;
        }
        
        try {
            callback.apply(this, args);
        } catch (error) {
            this.error('[BaseController] Error in safeCall:', error);
        }
    }
    
    /**
     * 延迟执行
     */
    protected delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * 检查节点是否存在
     */
    protected isValidNode(node: Node | null | undefined): boolean {
        return node !== null && node !== undefined && node.isValid;
    }
    
    /**
     * 获取子节点
     */
    protected getChild(path: string): Node | null {
        if (!this.node) return null;
        
        return this.node.getChildByPath(path);
    }
    
    /**
     * 日志输出
     */
    protected log(message: string, ...args: any[]): void {
        if (this.debugMode || this.enableLogging) {
            const className = this.constructor.name;
            console.log(`[${className}] ${message}`, ...args);
        }
    }
    
    /**
     * 警告输出
     */
    protected warn(message: string, ...args: any[]): void {
        const className = this.constructor.name;
        console.warn(`[${className}] ${message}`, ...args);
    }
    
    /**
     * 错误输出
     */
    protected error(message: string, ...args: any[]): void {
        const className = this.constructor.name;
        console.error(`[${className}] ${message}`, ...args);
    }
    
    /**
     * 检查是否已初始化
     */
    protected isReady(): boolean {
        return this.isInitialized && !this.isDestroyed;
    }
    
    /**
     * 检查是否已销毁
     */
    protected isControllerDestroyed(): boolean {
        return this.isDestroyed;
    }
    
    /**
     * 获取控制器名称
     */
    protected getControllerName(): string {
        return this.constructor.name;
    }
    
    /**
     * 播放音效
     */
    protected playSFX(clip: any): void {
        if (this.audioController) {
            this.audioController.playSFX(clip);
        }
    }
    
    /**
     * 播放背景音乐
     */
    protected playBGM(clip?: any): void {
        if (this.audioController) {
            this.audioController.playBGM(clip);
        }
    }
    
    /**
     * 停止背景音乐
     */
    protected stopBGM(): void {
        if (this.audioController) {
            this.audioController.stopBGM();
        }
    }
    
    /**
     * 播放点击音效
     */
    protected playClick(): void {
        if (this.audioController) {
            this.audioController.playClick();
        }
    }
    
    /**
     * 加载资源
     */
    protected async loadResource<T>(path: string, type: any = null): Promise<T> {
        if (!this.resourceManager) {
            throw new Error('ResourceManager not available');
        }
        
        return this.resourceManager.load<T>(path, type);
    }
    
    /**
     * 发送网络请求
     */
    protected async sendRequest(type: string, data?: any): Promise<any> {
        if (!this.networkManager) {
            throw new Error('NetworkManager not available');
        }
        
        return this.networkManager.request(type, data);
    }
    
    /**
     * 显示UI
     */
    protected showUI(uiName: string, nodePath: string, layerPriority?: number): Node | null {
        if (!this.uiManager) {
            this.warn('[BaseController] UIManager not available');
            return null;
        }
        
        return this.uiManager.showUI(uiName, nodePath, layerPriority);
    }
    
    /**
     * 隐藏UI
     */
    protected hideUI(uiName: string): void {
        if (!this.uiManager) {
            this.warn('[BaseController] UIManager not available');
            return;
        }
        
        this.uiManager.hideUI(uiName);
    }
    
    /**
     * 获取输入状态
     */
    protected getInputState(): any {
        if (!this.inputManager) {
            this.warn('[BaseController] InputManager not available');
            return null;
        }
        
        return this.inputManager.getInputState();
    }
    
    /**
     * 获取移动方向
     */
    protected getMoveDirection() {
        if (!this.inputManager) {
            this.warn('[BaseController] InputManager not available');
            return null;
        }
        
        return this.inputManager.getMoveDirection();
    }
    
    /**
     * 获取游戏数据
     */
    protected getGameData(key: string): any {
        if (!this.gameManager) {
            this.warn('[BaseController] GameManager not available');
            return null;
        }
        
        return this.gameManager.getGameData(key);
    }
    
    /**
     * 设置游戏数据
     */
    protected setGameData(key: string, value: any): void {
        if (!this.gameManager) {
            this.warn('[BaseController] GameManager not available');
            return;
        }
        
        this.gameManager.setGameData(key, value);
    }
    
    /**
     * 清除游戏数据
     */
    protected clearGameData(key?: string): void {
        if (!this.gameManager) {
            this.warn('[BaseController] GameManager not available');
            return;
        }
        
        this.gameManager.clearGameData(key);
    }
    
    /**
     * 获取游戏状态
     */
    protected getGameState() {
        if (!this.gameManager) {
            this.warn('[BaseController] GameManager not available');
            return null;
        }
        
        return this.gameManager.getState();
    }
    
    /**
     * 切换游戏状态
     */
    protected changeGameState(state: any): void {
        if (!this.gameManager) {
            this.warn('[BaseController] GameManager not available');
            return;
        }
        
        this.gameManager.changeState(state);
    }
}