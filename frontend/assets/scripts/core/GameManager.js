/**
 * 游戏管理器 - 单例模式
 * 管理游戏生命周期、状态切换、全局配置
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
import { _decorator, Component, Node, game } from 'cc';
const { ccclass, property } = _decorator;
export var GameState;
(function (GameState) {
    GameState["BOOT"] = "boot";
    GameState["LOGIN"] = "login";
    GameState["MAIN_MENU"] = "main_menu";
    GameState["GAME"] = "game";
    GameState["PAUSE"] = "pause";
    GameState["GAME_OVER"] = "game_over";
})(GameState || (GameState = {}));
let GameManager = (() => {
    let _classDecorators = [ccclass('GameManager')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _debugMode_decorators;
    let _debugMode_initializers = [];
    let _debugMode_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    var GameManager = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.debugMode = __runInitializers(this, _debugMode_initializers, false);
            this.version = (__runInitializers(this, _debugMode_extraInitializers), __runInitializers(this, _version_initializers, '1.0.0'));
            this.currentState = (__runInitializers(this, _version_extraInitializers), GameState.BOOT);
            this.gameData = new Map();
        }
        static getInstance() {
            if (!GameManager.instance) {
                const node = new Node('GameManager');
                GameManager.instance = node.addComponent(GameManager);
                game.addPersistRootNode(node);
            }
            return GameManager.instance;
        }
        onLoad() {
            if (GameManager.instance && GameManager.instance !== this) {
                this.node.destroy();
                return;
            }
            console.log('[GameManager] Initialized, version:', this.version);
        }
        start() {
            this.changeState(GameState.BOOT);
        }
        /**
         * 切换游戏状态
         */
        changeState(newState) {
            const oldState = this.currentState;
            this.currentState = newState;
            console.log(`[GameManager] State changed: ${oldState} -> ${newState}`);
            // 触发状态变更事件
            this.emitStateChange(oldState, newState);
        }
        /**
         * 获取当前状态
         */
        getState() {
            return this.currentState;
        }
        /**
         * 检查是否在指定状态
         */
        isInState(state) {
            return this.currentState === state;
        }
        /**
         * 设置游戏数据
         */
        setGameData(key, value) {
            this.gameData.set(key, value);
        }
        /**
         * 获取游戏数据
         */
        getGameData(key) {
            return this.gameData.get(key);
        }
        /**
         * 清除游戏数据
         */
        clearGameData(key) {
            if (key) {
                this.gameData.delete(key);
            }
            else {
                this.gameData.clear();
            }
        }
        /**
         * 暂停游戏
         */
        pauseGame() {
            if (this.currentState === GameState.GAME) {
                this.changeState(GameState.PAUSE);
                game.pause();
            }
        }
        /**
         * 恢复游戏
         */
        resumeGame() {
            if (this.currentState === GameState.PAUSE) {
                game.resume();
                this.changeState(GameState.GAME);
            }
        }
        /**
         * 重启游戏
         */
        restartGame() {
            this.clearGameData();
            game.restart();
        }
        /**
         * 退出游戏
         */
        quitGame() {
            game.end();
        }
        /**
         * 触发状态变更事件
         */
        emitStateChange(oldState, newState) {
            // 事件系统会在 EventSystem 中处理
            console.log(`[GameManager] Event: state_change ${oldState} -> ${newState}`);
        }
        /**
         * 日志输出 (根据调试模式)
         */
        log(message, ...args) {
            if (this.debugMode) {
                console.log(`[GameManager] ${message}`, ...args);
            }
        }
    };
    __setFunctionName(_classThis, "GameManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _debugMode_decorators = [property];
        _version_decorators = [property];
        __esDecorate(null, null, _debugMode_decorators, { kind: "field", name: "debugMode", static: false, private: false, access: { has: obj => "debugMode" in obj, get: obj => obj.debugMode, set: (obj, value) => { obj.debugMode = value; } }, metadata: _metadata }, _debugMode_initializers, _debugMode_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GameManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameManager = _classThis;
})();
export { GameManager };
