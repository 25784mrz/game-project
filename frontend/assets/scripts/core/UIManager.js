/**
 * UI 管理器
 * UI 界面管理、多分辨率适配、界面切换
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { _decorator, Component, Node, Canvas, Camera, find, UITransform, game } from 'cc';
import { EventSystem } from './EventSystem';
const { ccclass, property } = _decorator;
let UIManager = (() => {
    let _classDecorators = [ccclass('UIManager')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _designResolution_decorators;
    let _designResolution_initializers = [];
    let _designResolution_extraInitializers = [];
    let _fitWidth_decorators;
    let _fitWidth_initializers = [];
    let _fitWidth_extraInitializers = [];
    let _fitHeight_decorators;
    let _fitHeight_initializers = [];
    let _fitHeight_extraInitializers = [];
    var UIManager = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.designResolution = __runInitializers(this, _designResolution_initializers, { width: 1920, height: 1080 });
            this.fitWidth = (__runInitializers(this, _designResolution_extraInitializers), __runInitializers(this, _fitWidth_initializers, true));
            this.fitHeight = (__runInitializers(this, _fitWidth_extraInitializers), __runInitializers(this, _fitHeight_initializers, false));
            this.canvas = (__runInitializers(this, _fitHeight_extraInitializers), null);
            this.uiLayers = new Map();
            this.activeUIs = new Map();
            this.eventSystem = null;
            // UI 层级定义
            this.LAYER_BACKGROUND = 0;
            this.LAYER_GAME = 10;
            this.LAYER_UI = 20;
            this.LAYER_POPUP = 30;
            this.LAYER_DIALOG = 40;
            this.LAYER_TOAST = 50;
        }
        static getInstance() {
            if (!UIManager.instance) {
                const node = new Node();
                node.name = 'UIManager';
                UIManager.instance = node.addComponent(UIManager);
                game.addPersistRootNode(node);
            }
            return UIManager.instance;
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
        setupCanvas() {
            // 查找或创建 Canvas
            let canvasNode = find('Canvas');
            if (!canvasNode) {
                canvasNode = new Node();
                canvasNode.name = 'Canvas';
                this.canvas = canvasNode.addComponent(Canvas);
                game.addPersistRootNode(canvasNode);
            }
            else {
                this.canvas = canvasNode.getComponent(Canvas);
            }
            if (this.canvas) {
                // 设置设计分辨率
                const cameraNode = find('Canvas/Main Camera');
                if (cameraNode) {
                    const camera = cameraNode.getComponent(Camera);
                    if (camera) {
                        camera.priority = 0;
                    }
                }
            }
        }
        /**
         * 创建 UI 层级
         */
        createUILayers() {
            if (!this.canvas?.node)
                return;
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
                layerNode.parent = this.canvas.node;
                const uiTransform = layerNode.addComponent(UITransform);
                uiTransform.setContentSize(this.designResolution.width, this.designResolution.height);
                this.uiLayers.set(priority, layerNode);
            });
        }
        /**
         * 设置分辨率适配
         */
        setupResolution() {
            if (!this.canvas)
                return;
            // 适配策略
            if (this.fitWidth && this.fitHeight) {
                // 充满屏幕（可能裁剪）
                this.canvas.fitWidth = true;
                this.canvas.fitHeight = true;
            }
            else if (this.fitWidth) {
                // 适配宽度（显示全部，可能有黑边）
                this.canvas.fitWidth = true;
                this.canvas.fitHeight = false;
            }
            else if (this.fitHeight) {
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
        showUI(uiName, nodePath, layerPriority = this.LAYER_UI) {
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
        hideUI(uiName) {
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
        toggleUI(uiName, nodePath, layerPriority) {
            const uiNode = this.activeUIs.get(uiName);
            if (uiNode && uiNode.active) {
                this.hideUI(uiName);
                return null;
            }
            else {
                return this.showUI(uiName, nodePath, layerPriority);
            }
        }
        /**
         * 关闭所有 UI
         */
        closeAllUI() {
            this.activeUIs.forEach((node, name) => {
                node.active = false;
            });
            this.activeUIs.clear();
            console.log('[UIManager] All UI closed');
        }
        /**
         * 获取 UI 节点
         */
        getUI(uiName) {
            return this.activeUIs.get(uiName) || null;
        }
        /**
         * 检查 UI 是否显示
         */
        isUIVisible(uiName) {
            const uiNode = this.activeUIs.get(uiName);
            return uiNode ? uiNode.active : false;
        }
        /**
         * 设置 UI 层级
         */
        setUILayer(uiName, layerPriority) {
            const uiNode = this.activeUIs.get(uiName);
            const targetLayer = this.uiLayers.get(layerPriority);
            if (uiNode && targetLayer) {
                uiNode.parent = targetLayer;
            }
        }
        /**
         * 获取设计分辨率
         */
        getDesignResolution() {
            return this.designResolution;
        }
        /**
         * 获取屏幕适配比例
         */
        getScreenScale() {
            const visibleSize = game.canvasSize;
            return {
                scaleX: visibleSize.width / this.designResolution.width,
                scaleY: visibleSize.height / this.designResolution.height
            };
        }
        /**
         * 将设计坐标转换为屏幕坐标
         */
        designToScreen(designX, designY) {
            const scale = this.getScreenScale();
            return {
                x: designX * scale.scaleX,
                y: designY * scale.scaleY
            };
        }
        /**
         * 将屏幕坐标转换为设计坐标
         */
        screenToDesign(screenX, screenY) {
            const scale = this.getScreenScale();
            return {
                x: screenX / scale.scaleX,
                y: screenY / scale.scaleY
            };
        }
        onDestroy() {
            this.closeAllUI();
            UIManager.instance = null;
        }
    };
    __setFunctionName(_classThis, "UIManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _designResolution_decorators = [property];
        _fitWidth_decorators = [property];
        _fitHeight_decorators = [property];
        __esDecorate(null, null, _designResolution_decorators, { kind: "field", name: "designResolution", static: false, private: false, access: { has: obj => "designResolution" in obj, get: obj => obj.designResolution, set: (obj, value) => { obj.designResolution = value; } }, metadata: _metadata }, _designResolution_initializers, _designResolution_extraInitializers);
        __esDecorate(null, null, _fitWidth_decorators, { kind: "field", name: "fitWidth", static: false, private: false, access: { has: obj => "fitWidth" in obj, get: obj => obj.fitWidth, set: (obj, value) => { obj.fitWidth = value; } }, metadata: _metadata }, _fitWidth_initializers, _fitWidth_extraInitializers);
        __esDecorate(null, null, _fitHeight_decorators, { kind: "field", name: "fitHeight", static: false, private: false, access: { has: obj => "fitHeight" in obj, get: obj => obj.fitHeight, set: (obj, value) => { obj.fitHeight = value; } }, metadata: _metadata }, _fitHeight_initializers, _fitHeight_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UIManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.instance = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UIManager = _classThis;
})();
export { UIManager };
