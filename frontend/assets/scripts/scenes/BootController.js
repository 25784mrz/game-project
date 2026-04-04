/**
 * Boot 场景启动脚本
 * 负责初始化游戏和预加载资源
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
import { _decorator, ProgressBar, Label, Node, director } from 'cc';
import { BaseController } from '../core/BaseController';
import { SceneManager } from '../core/SceneManager';
import { UIManager } from '../core/UIManager';
import { InputManager } from '../core/InputManager';
import { AudioController } from '../components/AudioController';
import { LoginUIBuilder } from '../modules/auth/LoginUIBuilder';
import { TweenUtils } from '../utils/TweenUtils';
const { ccclass, property } = _decorator;
let BootController = (() => {
    let _classDecorators = [ccclass('BootController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseController;
    let _progressBar_decorators;
    let _progressBar_initializers = [];
    let _progressBar_extraInitializers = [];
    let _loadingText_decorators;
    let _loadingText_initializers = [];
    let _loadingText_extraInitializers = [];
    let _loadingUI_decorators;
    let _loadingUI_initializers = [];
    let _loadingUI_extraInitializers = [];
    var BootController = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.progressBar = __runInitializers(this, _progressBar_initializers, null);
            this.loadingText = (__runInitializers(this, _progressBar_extraInitializers), __runInitializers(this, _loadingText_initializers, null));
            this.loadingUI = (__runInitializers(this, _loadingText_extraInitializers), __runInitializers(this, _loadingUI_initializers, null));
            this.sceneManager = (__runInitializers(this, _loadingUI_extraInitializers), null);
        }
        start() {
            this.log('[Boot] Starting');
            this.sceneManager = SceneManager.getInstance();
            this.initManagers();
            this.startLoading();
        }
        /**
         * 初始化全局管理器
         */
        initManagers() {
            console.log('[Boot] Initializing managers...');
            // 创建持久化节点
            const uiManagerNode = new Node('UIManager');
            uiManagerNode.addComponent(UIManager);
            director.addPersistRootNode(uiManagerNode);
            const inputManagerNode = new Node('InputManager');
            inputManagerNode.addComponent(InputManager);
            director.addPersistRootNode(inputManagerNode);
            const audioManagerNode = new Node('AudioManager');
            audioManagerNode.addComponent(AudioController);
            director.addPersistRootNode(audioManagerNode);
            console.log('[Boot] Managers initialized');
        }
        /**
         * 开始加载流程
         */
        async startLoading() {
            this.log('[Boot] Starting loading...');
            // 预加载资源列表
            const resources = [
                { path: 'textures/common', type: 'image', weight: 0.3 },
                { path: 'audio/bgm', type: 'audio', weight: 0.2 },
                { path: 'audio/click', type: 'audio', weight: 0.1 },
                { path: 'prefabs/LoginUI', type: 'prefab', weight: 0.2 },
                { path: 'prefabs/MainMenuUI', type: 'prefab', weight: 0.2 }
            ];
            let loadedCount = 0;
            const totalCount = resources.length;
            // 逐个加载资源
            for (const resource of resources) {
                try {
                    await this.loadResource(resource.path, resource.type);
                    loadedCount++;
                    this.updateProgress(loadedCount / totalCount);
                    this.log(`[Boot] Loaded: ${resource.path}`);
                }
                catch (error) {
                    this.warn(`[Boot] Failed to load ${resource.path}:`, error);
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
        updateProgress(progress) {
            if (this.progressBar) {
                this.progressBar.progress = Math.min(progress, 1);
            }
            const percent = Math.floor(progress * 100);
            this.updateText(`加载中... ${percent}%`);
        }
        /**
         * 更新文本
         */
        updateText(text) {
            if (this.loadingText) {
                this.loadingText.string = text;
            }
        }
        /**
         * 显示登录界面（可选）
         */
        showLoginUI() {
            if (!this.loadingUI)
                return;
            // 隐藏加载 UI
            if (this.loadingUI) {
                TweenUtils.fadeOut(this.loadingUI, 0.3, () => {
                    this.loadingUI.active = false;
                });
            }
            // 创建并显示登录 UI
            const loginUINode = new Node('LoginUI');
            loginUINode.parent = this.loadingUI;
            const builder = loginUINode.addComponent(LoginUIBuilder);
            const uiRoot = builder.buildLoginUI();
            uiRoot.parent = loginUINode;
            // 播放入场动画
            builder.playEnterAnimation(uiRoot);
        }
    };
    __setFunctionName(_classThis, "BootController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _progressBar_decorators = [property(ProgressBar)];
        _loadingText_decorators = [property(Label)];
        _loadingUI_decorators = [property(Node)];
        __esDecorate(null, null, _progressBar_decorators, { kind: "field", name: "progressBar", static: false, private: false, access: { has: obj => "progressBar" in obj, get: obj => obj.progressBar, set: (obj, value) => { obj.progressBar = value; } }, metadata: _metadata }, _progressBar_initializers, _progressBar_extraInitializers);
        __esDecorate(null, null, _loadingText_decorators, { kind: "field", name: "loadingText", static: false, private: false, access: { has: obj => "loadingText" in obj, get: obj => obj.loadingText, set: (obj, value) => { obj.loadingText = value; } }, metadata: _metadata }, _loadingText_initializers, _loadingText_extraInitializers);
        __esDecorate(null, null, _loadingUI_decorators, { kind: "field", name: "loadingUI", static: false, private: false, access: { has: obj => "loadingUI" in obj, get: obj => obj.loadingUI, set: (obj, value) => { obj.loadingUI = value; } }, metadata: _metadata }, _loadingUI_initializers, _loadingUI_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BootController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BootController = _classThis;
})();
export { BootController };
