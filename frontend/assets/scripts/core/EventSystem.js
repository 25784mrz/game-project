/**
 * 事件系统
 * 全局事件总线，模块间松耦合通信
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
import { _decorator, Component, Node, EventTarget, game } from 'cc';
const { ccclass, property } = _decorator;
let EventSystem = (() => {
    let _classDecorators = [ccclass('EventSystem')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _maxHistorySize_decorators;
    let _maxHistorySize_initializers = [];
    let _maxHistorySize_extraInitializers = [];
    let _debugMode_decorators;
    let _debugMode_initializers = [];
    let _debugMode_extraInitializers = [];
    var EventSystem = _classThis = class extends _classSuper {
        static getInstance() {
            if (!EventSystem.instance) {
                const node = new Node('EventSystem');
                EventSystem.instance = node.addComponent(EventSystem);
                game.addPersistRootNode(node);
            }
            return EventSystem.instance;
        }
        constructor() {
            super();
            this.eventHistory = [];
            this.maxHistorySize = __runInitializers(this, _maxHistorySize_initializers, 100);
            this.debugMode = (__runInitializers(this, _maxHistorySize_extraInitializers), __runInitializers(this, _debugMode_initializers, false));
            __runInitializers(this, _debugMode_extraInitializers);
            this.eventTarget = new EventTarget();
        }
        onLoad() {
            if (EventSystem.instance && EventSystem.instance !== this) {
                this.node.destroy();
                return;
            }
            console.log('[EventSystem] Initialized');
        }
        /**
         * 监听事件
         */
        on(type, callback, target) {
            this.eventTarget.on(type, callback, target);
            this.log(`Event registered: ${type}`);
        }
        /**
         * 监听一次事件
         */
        once(type, callback, target) {
            this.eventTarget.once(type, callback, target);
            this.log(`Event registered (once): ${type}`);
        }
        /**
         * 移除监听
         */
        off(type, callback, target) {
            this.eventTarget.off(type, callback, target);
            this.log(`Event removed: ${type}`);
        }
        /**
         * 触发事件
         */
        emit(type, ...args) {
            this.eventTarget.emit(type, ...args);
            this.log(`Event emitted: ${type}`, args);
            // 记录事件历史
            this.recordEvent(type, args);
        }
        /**
         * 触发事件并等待响应
         */
        async emitAsync(type, ...args) {
            return new Promise((resolve) => {
                const results = [];
                const eventMap = this.eventTarget['map'];
                const callbacks = eventMap?.get(type) || [];
                for (const callback of callbacks) {
                    try {
                        const result = callback.callback.apply(callback.target, args);
                        if (result instanceof Promise) {
                            results.push(result);
                        }
                        else {
                            results.push(Promise.resolve(result));
                        }
                    }
                    catch (err) {
                        console.error(`[EventSystem] Callback error for ${type}:`, err);
                    }
                }
                Promise.all(results).then(resolve).catch(() => resolve(results));
            });
        }
        /**
         * 清除所有事件
         */
        clear() {
            this.eventTarget.off();
            this.eventHistory = [];
            console.log('[EventSystem] All events cleared');
        }
        /**
         * 获取事件监听器数量
         */
        getListenerCount(type) {
            const eventMap = this.eventTarget['map'];
            return eventMap?.get(type)?.length || 0;
        }
        /**
         * 检查是否有监听器
         */
        hasListener(type) {
            return this.getListenerCount(type) > 0;
        }
        /**
         * 获取事件历史
         */
        getEventHistory(limit = 10) {
            return this.eventHistory.slice(-limit);
        }
        /**
         * 清空事件历史
         */
        clearHistory() {
            this.eventHistory = [];
        }
        /**
         * 记录事件
         */
        recordEvent(type, args) {
            this.eventHistory.push({
                type,
                timestamp: Date.now(),
                args
            });
            // 限制历史记录大小
            if (this.eventHistory.length > this.maxHistorySize) {
                this.eventHistory.shift();
            }
        }
        /**
         * 日志输出
         */
        log(message, ...args) {
            if (this.debugMode) {
                console.log(`[EventSystem] ${message}`, ...args);
            }
        }
    };
    __setFunctionName(_classThis, "EventSystem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _maxHistorySize_decorators = [property];
        _debugMode_decorators = [property];
        __esDecorate(null, null, _maxHistorySize_decorators, { kind: "field", name: "maxHistorySize", static: false, private: false, access: { has: obj => "maxHistorySize" in obj, get: obj => obj.maxHistorySize, set: (obj, value) => { obj.maxHistorySize = value; } }, metadata: _metadata }, _maxHistorySize_initializers, _maxHistorySize_extraInitializers);
        __esDecorate(null, null, _debugMode_decorators, { kind: "field", name: "debugMode", static: false, private: false, access: { has: obj => "debugMode" in obj, get: obj => obj.debugMode, set: (obj, value) => { obj.debugMode = value; } }, metadata: _metadata }, _debugMode_initializers, _debugMode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventSystem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventSystem = _classThis;
})();
export { EventSystem };
