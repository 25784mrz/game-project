/**
 * 控制器基类
 * 为所有控制器提供通用功能和管理
 */
import { Component, Node } from 'cc';
import { GameManager } from './GameManager';
import { EventSystem } from './EventSystem';
import { AudioController } from '../components/AudioController';
import { NetworkManager } from './NetworkManager';
import { ResourceManager } from './ResourceManager';
import { InputManager } from './InputManager';
import { UIManager } from './UIManager';
type EventCallback = (...args: any[]) => void;
export interface ControllerConfig {
    debugMode?: boolean;
    enableLogging?: boolean;
}
export declare class BaseController extends Component {
    debugMode: boolean;
    enableLogging: boolean;
    protected gameManager: GameManager | null;
    protected eventSystem: EventSystem | null;
    protected audioController: AudioController | null;
    protected networkManager: NetworkManager | null;
    protected resourceManager: ResourceManager | null;
    protected inputManager: InputManager | null;
    protected uiManager: UIManager | null;
    private isInitialized;
    private isDestroyed;
    private eventListeners;
    onLoad(): void;
    start(): void;
    onDestroy(): void;
    /**
     * 初始化控制器
     */
    protected initialize(): void;
    /**
     * 控制器启动（子类重写）
     */
    protected onControllerStart(): void;
    /**
     * 清理资源（子类重写）
     */
    protected cleanup(): void;
    /**
     * 注册事件监听器
     */
    protected on(type: string, callback: EventCallback, target?: any): void;
    /**
     * 注册一次性事件监听器
     */
    protected once(type: string, callback: EventCallback, target?: any): void;
    /**
     * 移除事件监听器
     */
    protected off(type: string, callback?: EventCallback, target?: any): void;
    /**
     * 触发事件
     */
    protected emit(type: string, ...args: any[]): void;
    /**
     * 移除所有事件监听器
     */
    protected removeAllEventListeners(): void;
    /**
     * 安全调用方法（防止已销毁后调用）
     */
    protected safeCall(callback: EventCallback, ...args: any[]): void;
    /**
     * 延迟执行
     */
    protected delay(ms: number): Promise<void>;
    /**
     * 检查节点是否存在
     */
    protected isValidNode(node: Node | null | undefined): boolean;
    /**
     * 获取子节点
     */
    protected getChild(path: string): Node | null;
    /**
     * 日志输出
     */
    protected log(message: string, ...args: any[]): void;
    /**
     * 警告输出
     */
    protected warn(message: string, ...args: any[]): void;
    /**
     * 错误输出
     */
    protected error(message: string, ...args: any[]): void;
    /**
     * 检查是否已初始化
     */
    protected isReady(): boolean;
    /**
     * 检查是否已销毁
     */
    protected isControllerDestroyed(): boolean;
    /**
     * 获取控制器名称
     */
    protected getControllerName(): string;
    /**
     * 播放音效
     */
    protected playSFX(clip: any): void;
    /**
     * 播放背景音乐
     */
    protected playBGM(clip?: any): void;
    /**
     * 停止背景音乐
     */
    protected stopBGM(): void;
    /**
     * 播放点击音效
     */
    protected playClick(): void;
    /**
     * 加载资源
     */
    protected loadResource<T>(path: string, type?: any): Promise<T>;
    /**
     * 发送网络请求
     */
    protected sendRequest(type: string, data?: any): Promise<any>;
    /**
     * 显示UI
     */
    protected showUI(uiName: string, nodePath: string, layerPriority?: number): Node | null;
    /**
     * 隐藏UI
     */
    protected hideUI(uiName: string): void;
    /**
     * 获取输入状态
     */
    protected getInputState(): any;
    /**
     * 获取移动方向
     */
    protected getMoveDirection(): import("cc").Vec3 | null;
    /**
     * 获取游戏数据
     */
    protected getGameData(key: string): any;
    /**
     * 设置游戏数据
     */
    protected setGameData(key: string, value: any): void;
    /**
     * 清除游戏数据
     */
    protected clearGameData(key?: string): void;
    /**
     * 获取游戏状态
     */
    protected getGameState(): import("./GameManager").GameState | null;
    /**
     * 切换游戏状态
     */
    protected changeGameState(state: any): void;
}
export {};
