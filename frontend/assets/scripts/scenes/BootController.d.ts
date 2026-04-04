/**
 * Boot 场景启动脚本
 * 负责初始化游戏和预加载资源
 */
import { ProgressBar, Label, Node } from 'cc';
import { BaseController } from '../core/BaseController';
export declare class BootController extends BaseController {
    progressBar: ProgressBar | null;
    loadingText: Label | null;
    loadingUI: Node | null;
    private sceneManager;
    start(): void;
    /**
     * 初始化全局管理器
     */
    private initManagers;
    /**
     * 开始加载流程
     */
    private startLoading;
    /**
     * 更新进度条
     */
    private updateProgress;
    /**
     * 更新文本
     */
    private updateText;
    /**
     * 显示登录界面（可选）
     */
    private showLoginUI;
}
