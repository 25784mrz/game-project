/**
 * UI 管理器
 * UI 界面管理、多分辨率适配、界面切换
 */

import { _decorator, Component, Node, Canvas, Widget, Camera, find, UITransform, Vec3, game } from 'cc';
import { EventSystem } from './EventSystem';

const { ccclass, property } = _decorator;

interface UIConfig {
    name: string;
    nodePath: string;
    priority: number;
}

@ccclass('UIManager')
export class UIManager extends Component {
    private static instance: UIManager | null = null;
    
    @property
    designResolution: { width: number; height: number } = { width: 1920, height: 1080 };
    
    @property
    fitWidth: boolean = true;
    
    @property
    fitHeight: boolean = false;
    
    private canvas: Canvas | null = null;
    private uiLayers: Map<number, Node> = new Map();
    private activeUIs: Map<string, Node> = new Map();
    private eventSystem: EventSystem | null = null;
    
    // UI 层级定义
    private readonly LAYER_BACKGROUND = 0;
    private readonly LAYER_GAME = 10;
    private readonly LAYER_UI = 20;
    private readonly LAYER_POPUP = 30;
    private readonly LAYER_DIALOG = 40;
    private readonly LAYER_TOAST = 50;
    
    static getInstance(): UIManager {
        if (!UIManager.instance) {
            const node = new Node();
            node.name = 'UIManager';
            UIManager.instance = node.addComponent(UIManager) as UIManager;
            game.addPersistRootNode(node);
        }
        return UIManager.instance!;
    }
    
    onLoad() {
        if (UIManager.instance && UIManager.instance !== this) {
            this.node.destroy();
            return;
        }
        UIManager.instance = this;
        this.eventSystem = EventSystem.getInstance();
        console.log('[UIManager] Initialized');
    }
    
    start() {
        this.setupCanvas();
        this.createUILayers();
        this.setupResolution();
    }
    
    /**
     * 设置 Canvas
     */
    private setupCanvas(): void {
        // 查找或创建 Canvas
        let canvasNode = find('Canvas');
        
        if (!canvasNode) {
            canvasNode = new Node();
            canvasNode.name = 'Canvas';
            this.canvas = canvasNode.addComponent(Canvas) as Canvas;
            game.addPersistRootNode(canvasNode);
        } else {
            this.canvas = canvasNode.getComponent(Canvas) as Canvas;
        }
        
        if (this.canvas) {
            // 设置设计分辨率
            const cameraNode = find('Canvas/Main Camera');
            if (cameraNode) {
                const camera = cameraNode.getComponent(Camera) as Camera;
                if (camera) {
                    (camera as any).priority = 0;
                }
            }
        }
    }
    
    /**
     * 创建 UI 层级
     */
    private createUILayers(): void {
        if (!this.canvas?.node) return;
        
        const layers = [
            { name: 'Background', priority: this.LAYER_BACKGROUND },
            { name: 'Game', priority: this.LAYER_GAME },
            { name: 'UI', priority: this.LAYER_UI },
            { name: 'Popup', priority: this.LAYER_POPUP },
            { name: 'Dialog', priority: this.LAYER_DIALOG },
            { name: 'Toast', priority: this.LAYER_TOAST }
        ];
        
        layers.forEach(({ name, priority }) => {
            const layerNode = new Node();
            layerNode.name = name;
            layerNode.parent = this.canvas!.node;
            
            const uiTransform = layerNode.addComponent(UITransform) as UITransform;
            (uiTransform as any).setContentSize(this.designResolution.width, this.designResolution.height);
            
            this.uiLayers.set(priority, layerNode);
        });
    }
    
    /**
     * 设置分辨率适配
     */
    private setupResolution(): void {
        if (!this.canvas) return;
        
        // 适配策略
        if (this.fitWidth && this.fitHeight) {
            // 充满屏幕（可能裁剪）
            this.canvas.fitWidth = true;
            this.canvas.fitHeight = true;
        } else if (this.fitWidth) {
            // 适配宽度（显示全部，可能有黑边）
            this.canvas.fitWidth = true;
            this.canvas.fitHeight = false;
        } else if (this.fitHeight) {
            // 适配高度
            this.canvas.fitWidth = false;
            this.canvas.fitHeight = true;
        }
        
        console.log('[UIManager] Resolution setup:', {
            design: this.designResolution,
            fitWidth: this.fitWidth,
            fitHeight: this.fitHeight
        });
    }
    
    /**
     * 显示 UI
     */
    showUI(uiName: string, nodePath: string, layerPriority: number = this.LAYER_UI): Node | null {
        // 检查是否已存在
        if (this.activeUIs.has(uiName)) {
            const existingUI = this.activeUIs.get(uiName);
            if (existingUI) {
                existingUI.active = true;
                return existingUI;
            }
        }
        
        // 查找节点
        const uiNode = find(nodePath);
        if (!uiNode) {
            console.error(`[UIManager] UI not found: ${nodePath}`);
            return null;
        }
        
        // 获取目标层级
        const targetLayer = this.uiLayers.get(layerPriority);
        if (targetLayer && uiNode.parent !== targetLayer) {
            uiNode.parent = targetLayer;
        }
        
        // 添加到活动列表
        this.activeUIs.set(uiName, uiNode);
        uiNode.active = true;
        
        console.log(`[UIManager] Show UI: ${uiName}`);
        this.eventSystem?.emit('ui:show', uiName);
        
        return uiNode;
    }
    
    /**
     * 隐藏 UI
     */
    hideUI(uiName: string): void {
        const uiNode = this.activeUIs.get(uiName);
        if (uiNode) {
            uiNode.active = false;
            console.log(`[UIManager] Hide UI: ${uiName}`);
            this.eventSystem?.emit('ui:hide', uiName);
        }
    }
    
    /**
     * 切换 UI
     */
    toggleUI(uiName: string, nodePath: string, layerPriority?: number): Node | null {
        const uiNode = this.activeUIs.get(uiName);
        
        if (uiNode && uiNode.active) {
            this.hideUI(uiName);
            return null;
        } else {
            return this.showUI(uiName, nodePath, layerPriority);
        }
    }
    
    /**
     * 关闭所有 UI
     */
    closeAllUI(): void {
        this.activeUIs.forEach((node, name) => {
            node.active = false;
        });
        this.activeUIs.clear();
        console.log('[UIManager] All UI closed');
    }
    
    /**
     * 获取 UI 节点
     */
    getUI(uiName: string): Node | null {
        return this.activeUIs.get(uiName) || null;
    }
    
    /**
     * 检查 UI 是否显示
     */
    isUIVisible(uiName: string): boolean {
        const uiNode = this.activeUIs.get(uiName);
        return uiNode ? uiNode.active : false;
    }
    
    /**
     * 设置 UI 层级
     */
    setUILayer(uiName: string, layerPriority: number): void {
        const uiNode = this.activeUIs.get(uiName);
        const targetLayer = this.uiLayers.get(layerPriority);
        
        if (uiNode && targetLayer) {
            uiNode.parent = targetLayer;
        }
    }
    
    /**
     * 获取设计分辨率
     */
    getDesignResolution(): { width: number; height: number } {
        return this.designResolution;
    }
    
    /**
     * 获取屏幕适配比例
     */
    getScreenScale(): { scaleX: number; scaleY: number } {
        const visibleSize = game.canvasSize;
        return {
            scaleX: visibleSize.width / this.designResolution.width,
            scaleY: visibleSize.height / this.designResolution.height
        };
    }
    
    /**
     * 将设计坐标转换为屏幕坐标
     */
    designToScreen(designX: number, designY: number): { x: number; y: number } {
        const scale = this.getScreenScale();
        return {
            x: designX * scale.scaleX,
            y: designY * scale.scaleY
        };
    }
    
    /**
     * 将屏幕坐标转换为设计坐标
     */
    screenToDesign(screenX: number, screenY: number): { x: number; y: number } {
        const scale = this.getScreenScale();
        return {
            x: screenX / scale.scaleX,
            y: screenY / scale.scaleY
        };
    }
    
    onDestroy(): void {
        this.closeAllUI();
        UIManager.instance = null;
    }
}
