/**
 * 控制器基类
 * 为所有控制器提供通用功能和管理
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
const { _decorator, Component } = require('cc');
const { GameManager } = require('./GameManager');
const { EventSystem } = require('./EventSystem');
const { AudioController } = require('../components/AudioController');
const { NetworkManager } = require('./NetworkManager');
const { ResourceManager } = require('./ResourceManager');
const { InputManager } = require('./InputManager');
const { UIManager } = require('./UIManager');
const { ccclass, property } = _decorator;
let BaseController = (() => {
    let _classDecorators = [ccclass('BaseController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _debugMode_decorators;
    let _debugMode_initializers = [];
    let _debugMode_extraInitializers = [];
    let _enableLogging_decorators;
    let _enableLogging_initializers = [];
    let _enableLogging_extraInitializers = [];
    var BaseController = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.debugMode = __runInitializers(this, _debugMode_initializers, false);
            this.enableLogging = (__runInitializers(this, _debugMode_extraInitializers), __runInitializers(this, _enableLogging_initializers, true));
            this.gameManager = (__runInitializers(this, _enableLogging_extraInitializers), null);
            this.eventSystem = null;
            this.audioController = null;
            this.networkManager = null;
            this.resourceManager = null;
            this.inputManager = null;
            this.uiManager = null;
            this.isInitialized = false;
            this.isDestroyed = false;
            this.eventListeners = [];
        }
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
        initialize() {
            if (this.isInitialized)
                return;
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
        onControllerStart() {
            if (this.enableLogging) {
                this.log('[BaseController] onControllerStart (should be overridden)');
            }
        }
        /**
         * 清理资源（子类重写）
         */
        cleanup() {
            if (this.enableLogging) {
                this.log('[BaseController] cleanup (should be overridden)');
            }
        }
        /**
         * 注册事件监听器
         */
        on(type, callback, target) {
            if (!this.eventSystem)
                return;
            this.eventSystem.on(type, callback, target || this);
            this.eventListeners.push({ type, callback, target: target || this });
        }
        /**
         * 注册一次性事件监听器
         */
        once(type, callback, target) {
            if (!this.eventSystem)
                return;
            this.eventSystem.once(type, callback, target || this);
        }
        /**
         * 移除事件监听器
         */
        off(type, callback, target) {
            if (!this.eventSystem)
                return;
            this.eventSystem.off(type, callback, target || this);
            if (!callback) {
                this.eventListeners = this.eventListeners.filter(listener => listener.type !== type);
            }
            else {
                this.eventListeners = this.eventListeners.filter(listener => !(listener.type === type && listener.callback === callback));
            }
        }
        /**
         * 触发事件
         */
        emit(type, ...args) {
            if (!this.eventSystem)
                return;
            this.eventSystem.emit(type, ...args);
        }
        /**
         * 移除所有事件监听器
         */
        removeAllEventListeners() {
            if (!this.eventSystem)
                return;
            this.eventListeners.forEach(({ type, callback, target }) => {
                this.eventSystem?.off(type, callback, target);
            });
            this.eventListeners = [];
        }
        /**
         * 安全调用方法（防止已销毁后调用）
         */
        safeCall(callback, ...args) {
            if (this.isDestroyed) {
                this.warn('[BaseController] Attempted to call on destroyed controller');
                return;
            }
            try {
                callback.apply(this, args);
            }
            catch (error) {
                this.error('[BaseController] Error in safeCall:', error);
            }
        }
        /**
         * 延迟执行
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        /**
         * 检查节点是否存在
         */
        isValidNode(node) {
            return node !== null && node !== undefined && node.isValid;
        }
        /**
         * 获取子节点
         */
        getChild(path) {
            if (!this.node)
                return null;
            return this.node.getChildByPath(path);
        }
        /**
         * 日志输出
         */
        log(message, ...args) {
            if (this.debugMode || this.enableLogging) {
                const className = this.constructor.name;
                console.log(`[${className}] ${message}`, ...args);
            }
        }
        /**
         * 警告输出
         */
        warn(message, ...args) {
            const className = this.constructor.name;
            console.warn(`[${className}] ${message}`, ...args);
        }
        /**
         * 错误输出
         */
        error(message, ...args) {
            const className = this.constructor.name;
            console.error(`[${className}] ${message}`, ...args);
        }
        /**
         * 检查是否已初始化
         */
        isReady() {
            return this.isInitialized && !this.isDestroyed;
        }
        /**
         * 检查是否已销毁
         */
        isControllerDestroyed() {
            return this.isDestroyed;
        }
        /**
         * 获取控制器名称
         */
        getControllerName() {
            return this.constructor.name;
        }
        /**
         * 播放音效
         */
        playSFX(clip) {
            if (this.audioController) {
                this.audioController.playSFX(clip);
            }
        }
        /**
         * 播放背景音乐
         */
        playBGM(clip) {
            if (this.audioController) {
                this.audioController.playBGM(clip);
            }
        }
        /**
         * 停止背景音乐
         */
        stopBGM() {
            if (this.audioController) {
                this.audioController.stopBGM();
            }
        }
        /**
         * 播放点击音效
         */
        playClick() {
            if (this.audioController) {
                this.audioController.playClick();
            }
        }
        /**
         * 加载资源
         */
        async loadResource(path, type = null) {
            if (!this.resourceManager) {
                throw new Error('ResourceManager not available');
            }
            return this.resourceManager.load(path, type);
        }
        /**
         * 发送网络请求
         */
        async sendRequest(type, data) {
            if (!this.networkManager) {
                throw new Error('NetworkManager not available');
            }
            return this.networkManager.request(type, data);
        }
        /**
         * 显示UI
         */
        showUI(uiName, nodePath, layerPriority) {
            if (!this.uiManager) {
                this.warn('[BaseController] UIManager not available');
                return null;
            }
            return this.uiManager.showUI(uiName, nodePath, layerPriority);
        }
        /**
         * 隐藏UI
         */
        hideUI(uiName) {
            if (!this.uiManager) {
                this.warn('[BaseController] UIManager not available');
                return;
            }
            this.uiManager.hideUI(uiName);
        }
        /**
         * 获取输入状态
         */
        getInputState() {
            if (!this.inputManager) {
                this.warn('[BaseController] InputManager not available');
                return null;
            }
            return this.inputManager.getInputState();
        }
        /**
         * 获取移动方向
         */
        getMoveDirection() {
            if (!this.inputManager) {
                this.warn('[BaseController] InputManager not available');
                return null;
            }
            return this.inputManager.getMoveDirection();
        }
        /**
         * 获取游戏数据
         */
        getGameData(key) {
            if (!this.gameManager) {
                this.warn('[BaseController] GameManager not available');
                return null;
            }
            return this.gameManager.getGameData(key);
        }
        /**
         * 设置游戏数据
         */
        setGameData(key, value) {
            if (!this.gameManager) {
                this.warn('[BaseController] GameManager not available');
                return;
            }
            this.gameManager.setGameData(key, value);
        }
        /**
         * 清除游戏数据
         */
        clearGameData(key) {
            if (!this.gameManager) {
                this.warn('[BaseController] GameManager not available');
                return;
            }
            this.gameManager.clearGameData(key);
        }
        /**
         * 获取游戏状态
         */
        getGameState() {
            if (!this.gameManager) {
                this.warn('[BaseController] GameManager not available');
                return null;
            }
            return this.gameManager.getState();
        }
        /**
         * 切换游戏状态
         */
        changeGameState(state) {
            if (!this.gameManager) {
                this.warn('[BaseController] GameManager not available');
                return;
            }
            this.gameManager.changeState(state);
        }
    };
    __setFunctionName(_classThis, "BaseController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _debugMode_decorators = [property];
        _enableLogging_decorators = [property];
        __esDecorate(null, null, _debugMode_decorators, { kind: "field", name: "debugMode", static: false, private: false, access: { has: obj => "debugMode" in obj, get: obj => obj.debugMode, set: (obj, value) => { obj.debugMode = value; } }, metadata: _metadata }, _debugMode_initializers, _debugMode_extraInitializers);
        __esDecorate(null, null, _enableLogging_decorators, { kind: "field", name: "enableLogging", static: false, private: false, access: { has: obj => "enableLogging" in obj, get: obj => obj.enableLogging, set: (obj, value) => { obj.enableLogging = value; } }, metadata: _metadata }, _enableLogging_initializers, _enableLogging_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BaseController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BaseController = _classThis;
})();
module.exports = { BaseController };
