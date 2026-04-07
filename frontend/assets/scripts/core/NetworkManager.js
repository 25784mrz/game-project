/**
 * 网络管理器
 * WebSocket 连接管理、消息序列化、自动重连
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
const { _decorator, Component, Node, game } = require('cc');
const { ccclass, property } = _decorator;
var ConnectionState;
(function (ConnectionState) {
    ConnectionState["DISCONNECTED"] = "disconnected";
    ConnectionState["CONNECTING"] = "connecting";
    ConnectionState["CONNECTED"] = "connected";
    ConnectionState["RECONNECTING"] = "reconnecting";
})(ConnectionState || (ConnectionState = {}));
let NetworkManager = (() => {
    let _classDecorators = [ccclass('NetworkManager')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _serverUrl_decorators;
    let _serverUrl_initializers = [];
    let _serverUrl_extraInitializers = [];
    let _autoReconnect_decorators;
    let _autoReconnect_initializers = [];
    let _autoReconnect_extraInitializers = [];
    let _reconnectDelay_decorators;
    let _reconnectDelay_initializers = [];
    let _reconnectDelay_extraInitializers = [];
    let _maxReconnectAttempts_decorators;
    let _maxReconnectAttempts_initializers = [];
    let _maxReconnectAttempts_extraInitializers = [];
    let _requestTimeout_decorators;
    let _requestTimeout_initializers = [];
    let _requestTimeout_extraInitializers = [];
    let _debugMode_decorators;
    let _debugMode_initializers = [];
    let _debugMode_extraInitializers = [];
    var NetworkManager = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.serverUrl = __runInitializers(this, _serverUrl_initializers, 'ws://localhost:8080');
            this.autoReconnect = (__runInitializers(this, _serverUrl_extraInitializers), __runInitializers(this, _autoReconnect_initializers, true));
            this.reconnectDelay = (__runInitializers(this, _autoReconnect_extraInitializers), __runInitializers(this, _reconnectDelay_initializers, 3000));
            this.maxReconnectAttempts = (__runInitializers(this, _reconnectDelay_extraInitializers), __runInitializers(this, _maxReconnectAttempts_initializers, 5));
            this.requestTimeout = (__runInitializers(this, _maxReconnectAttempts_extraInitializers), __runInitializers(this, _requestTimeout_initializers, 10000));
            this.debugMode = (__runInitializers(this, _requestTimeout_extraInitializers), __runInitializers(this, _debugMode_initializers, false));
            this.ws = (__runInitializers(this, _debugMode_extraInitializers), null);
            this.state = ConnectionState.DISCONNECTED;
            this.reconnectAttempts = 0;
            this.messageQueue = [];
            this.pendingRequests = new Map();
            this.eventListeners = new Map();
            this.heartbeatTimer = null;
            this.heartbeatInterval = 30000;
        }
        static getInstance() {
            if (!NetworkManager.instance) {
                const node = new Node('NetworkManager');
                NetworkManager.instance = node.addComponent(NetworkManager);
                game.addPersistRootNode(node);
            }
            return NetworkManager.instance;
        }
        onLoad() {
            if (NetworkManager.instance && NetworkManager.instance !== this) {
                this.node.destroy();
                return;
            }
            console.log('[NetworkManager] Initialized');
        }
        onDestroy() {
            this.disconnect();
        }
        /**
         * 连接服务器
         */
        async connect(url) {
            if (url) {
                this.serverUrl = url;
            }
            if (this.state === ConnectionState.CONNECTED || this.state === ConnectionState.CONNECTING) {
                this.log('Already connected or connecting');
                return;
            }
            this.updateState(ConnectionState.CONNECTING);
            return new Promise((resolve, reject) => {
                try {
                    this.ws = new WebSocket(this.serverUrl);
                    this.ws.onopen = () => {
                        this.log('Connected to server');
                        this.reconnectAttempts = 0;
                        this.updateState(ConnectionState.CONNECTED);
                        this.startHeartbeat();
                        this.flushMessageQueue();
                        resolve();
                    };
                    this.ws.onmessage = (event) => {
                        this.handleMessage(event.data);
                    };
                    this.ws.onclose = () => {
                        this.log('Connection closed');
                        this.updateState(ConnectionState.DISCONNECTED);
                        this.stopHeartbeat();
                        if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                            this.scheduleReconnect();
                        }
                    };
                    this.ws.onerror = (error) => {
                        console.error('[NetworkManager] WebSocket error:', error);
                        reject(new Error('WebSocket connection failed'));
                    };
                }
                catch (err) {
                    this.updateState(ConnectionState.DISCONNECTED);
                    reject(err);
                }
            });
        }
        /**
         * 断开连接
         */
        disconnect() {
            this.autoReconnect = false;
            this.stopHeartbeat();
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
            this.updateState(ConnectionState.DISCONNECTED);
            this.pendingRequests.forEach((request) => {
                clearTimeout(request.timeout);
                request.reject(new Error('Disconnected'));
            });
            this.pendingRequests.clear();
            this.log('Disconnected');
        }
        /**
         * 发送消息
         */
        send(type, data) {
            const message = {
                type,
                data,
                timestamp: Date.now()
            };
            if (this.state === ConnectionState.CONNECTED && this.ws) {
                this.ws.send(JSON.stringify(message));
                this.log('Sent:', message);
            }
            else {
                this.messageQueue.push(message);
                this.log('Queued:', message);
            }
        }
        /**
         * 发送请求并等待响应
         */
        request(type, data) {
            const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.pendingRequests.delete(id);
                    reject(new Error(`Request timeout: ${type}`));
                }, this.requestTimeout);
                this.pendingRequests.set(id, { id, resolve, reject, timeout });
                const message = {
                    type,
                    data,
                    id,
                    timestamp: Date.now()
                };
                if (this.state === ConnectionState.CONNECTED && this.ws) {
                    this.ws.send(JSON.stringify(message));
                }
                else {
                    this.messageQueue.push(message);
                }
            });
        }
        /**
         * 监听事件
         */
        on(type, callback) {
            if (!this.eventListeners.has(type)) {
                this.eventListeners.set(type, []);
            }
            this.eventListeners.get(type).push(callback);
        }
        /**
         * 移除监听
         */
        off(type, callback) {
            const listeners = this.eventListeners.get(type);
            if (!listeners)
                return;
            if (callback) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
            else {
                this.eventListeners.delete(type);
            }
        }
        /**
         * 获取连接状态
         */
        getState() {
            return this.state;
        }
        /**
         * 检查是否已连接
         */
        isConnected() {
            return this.state === ConnectionState.CONNECTED;
        }
        /**
         * 处理接收到的消息
         */
        handleMessage(rawData) {
            try {
                const message = JSON.parse(rawData);
                this.log('Received:', message);
                // 检查是否是请求响应
                if (message.id && this.pendingRequests.has(message.id)) {
                    const request = this.pendingRequests.get(message.id);
                    clearTimeout(request.timeout);
                    this.pendingRequests.delete(message.id);
                    request.resolve(message.data);
                    return;
                }
                // 触发事件监听器
                const listeners = this.eventListeners.get(message.type);
                if (listeners) {
                    listeners.forEach(callback => callback(message.data));
                }
            }
            catch (err) {
                console.error('[NetworkManager] Failed to parse message:', err);
            }
        }
        /**
         * 刷新消息队列
         */
        flushMessageQueue() {
            while (this.messageQueue.length > 0 && this.ws) {
                const message = this.messageQueue.shift();
                this.ws.send(JSON.stringify(message));
                this.log('Flushed:', message);
            }
        }
        /**
         * 计划重连
         */
        scheduleReconnect() {
            this.reconnectAttempts++;
            this.updateState(ConnectionState.RECONNECTING);
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
            this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect().catch(() => { });
            }, delay);
        }
        /**
         * 更新状态
         */
        updateState(newState) {
            const oldState = this.state;
            this.state = newState;
            this.log(`State: ${oldState} -> ${newState}`);
        }
        /**
         * 启动心跳
         */
        startHeartbeat() {
            this.stopHeartbeat();
            this.heartbeatTimer = setInterval(() => {
                if (this.isConnected()) {
                    this.send('heartbeat', { timestamp: Date.now() });
                }
            }, this.heartbeatInterval);
        }
        /**
         * 停止心跳
         */
        stopHeartbeat() {
            if (this.heartbeatTimer) {
                clearInterval(this.heartbeatTimer);
                this.heartbeatTimer = null;
            }
        }
        /**
         * 日志输出
         */
        log(message, ...args) {
            if (this.debugMode) {
                console.log(`[NetworkManager] ${message}`, ...args);
            }
        }
    };
    __setFunctionName(_classThis, "NetworkManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _serverUrl_decorators = [property];
        _autoReconnect_decorators = [property];
        _reconnectDelay_decorators = [property];
        _maxReconnectAttempts_decorators = [property];
        _requestTimeout_decorators = [property];
        _debugMode_decorators = [property];
        __esDecorate(null, null, _serverUrl_decorators, { kind: "field", name: "serverUrl", static: false, private: false, access: { has: obj => "serverUrl" in obj, get: obj => obj.serverUrl, set: (obj, value) => { obj.serverUrl = value; } }, metadata: _metadata }, _serverUrl_initializers, _serverUrl_extraInitializers);
        __esDecorate(null, null, _autoReconnect_decorators, { kind: "field", name: "autoReconnect", static: false, private: false, access: { has: obj => "autoReconnect" in obj, get: obj => obj.autoReconnect, set: (obj, value) => { obj.autoReconnect = value; } }, metadata: _metadata }, _autoReconnect_initializers, _autoReconnect_extraInitializers);
        __esDecorate(null, null, _reconnectDelay_decorators, { kind: "field", name: "reconnectDelay", static: false, private: false, access: { has: obj => "reconnectDelay" in obj, get: obj => obj.reconnectDelay, set: (obj, value) => { obj.reconnectDelay = value; } }, metadata: _metadata }, _reconnectDelay_initializers, _reconnectDelay_extraInitializers);
        __esDecorate(null, null, _maxReconnectAttempts_decorators, { kind: "field", name: "maxReconnectAttempts", static: false, private: false, access: { has: obj => "maxReconnectAttempts" in obj, get: obj => obj.maxReconnectAttempts, set: (obj, value) => { obj.maxReconnectAttempts = value; } }, metadata: _metadata }, _maxReconnectAttempts_initializers, _maxReconnectAttempts_extraInitializers);
        __esDecorate(null, null, _requestTimeout_decorators, { kind: "field", name: "requestTimeout", static: false, private: false, access: { has: obj => "requestTimeout" in obj, get: obj => obj.requestTimeout, set: (obj, value) => { obj.requestTimeout = value; } }, metadata: _metadata }, _requestTimeout_initializers, _requestTimeout_extraInitializers);
        __esDecorate(null, null, _debugMode_decorators, { kind: "field", name: "debugMode", static: false, private: false, access: { has: obj => "debugMode" in obj, get: obj => obj.debugMode, set: (obj, value) => { obj.debugMode = value; } }, metadata: _metadata }, _debugMode_initializers, _debugMode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NetworkManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NetworkManager = _classThis;
})();
module.exports = { NetworkManager, ConnectionState };
