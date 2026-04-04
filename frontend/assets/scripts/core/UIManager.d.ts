/**
 * UI 管理器
 * UI 界面管理、多分辨率适配、界面切换
 */
import { Component, Node } from 'cc';
export declare class UIManager extends Component {
    private static instance;
    designResolution: {
        width: number;
        height: number;
    };
    fitWidth: boolean;
    fitHeight: boolean;
    private canvas;
    private uiLayers;
    private activeUIs;
    private eventSystem;
    private readonly LAYER_BACKGROUND;
    private readonly LAYER_GAME;
    private readonly LAYER_UI;
    private readonly LAYER_POPUP;
    private readonly LAYER_DIALOG;
    private readonly LAYER_TOAST;
    static getInstance(): UIManager;
    onLoad(): void;
    start(): void;
    /**
     * 设置 Canvas
     */
    private setupCanvas;
    /**
     * 创建 UI 层级
     */
    private createUILayers;
    /**
     * 设置分辨率适配
     */
    private setupResolution;
    /**
     * 显示 UI
     */
    showUI(uiName: string, nodePath: string, layerPriority?: number): Node | null;
    /**
     * 隐藏 UI
     */
    hideUI(uiName: string): void;
    /**
     * 切换 UI
     */
    toggleUI(uiName: string, nodePath: string, layerPriority?: number): Node | null;
    /**
     * 关闭所有 UI
     */
    closeAllUI(): void;
    /**
     * 获取 UI 节点
     */
    getUI(uiName: string): Node | null;
    /**
     * 检查 UI 是否显示
     */
    isUIVisible(uiName: string): boolean;
    /**
     * 设置 UI 层级
     */
    setUILayer(uiName: string, layerPriority: number): void;
    /**
     * 获取设计分辨率
     */
    getDesignResolution(): {
        width: number;
        height: number;
    };
    /**
     * 获取屏幕适配比例
     */
    getScreenScale(): {
        scaleX: number;
        scaleY: number;
    };
    /**
     * 将设计坐标转换为屏幕坐标
     */
    designToScreen(designX: number, designY: number): {
        x: number;
        y: number;
    };
    /**
     * 将屏幕坐标转换为设计坐标
     */
    screenToDesign(screenX: number, screenY: number): {
        x: number;
        y: number;
    };
    onDestroy(): void;
}
