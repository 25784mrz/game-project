/**
 * 资源管理器
 * 异步加载资源 + 引用计数 + 自动释放
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
const { _decorator, Component, ImageAsset, AudioClip, Prefab, Node, resources, game } = require('cc');
const { ccclass, property } = _decorator;
let ResourceManager = (() => {
    let _classDecorators = [ccclass('ResourceManager')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _maxCacheSize_decorators;
    let _maxCacheSize_initializers = [];
    let _maxCacheSize_extraInitializers = [];
    let _autoReleaseThreshold_decorators;
    let _autoReleaseThreshold_initializers = [];
    let _autoReleaseThreshold_extraInitializers = [];
    var ResourceManager = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.maxCacheSize = __runInitializers(this, _maxCacheSize_initializers, 100);
            this.autoReleaseThreshold = (__runInitializers(this, _maxCacheSize_extraInitializers), __runInitializers(this, _autoReleaseThreshold_initializers, 200));
            this.resourceCache = (__runInitializers(this, _autoReleaseThreshold_extraInitializers), new Map());
            this.loadQueue = [];
            this.isProcessing = false;
        }
        static getInstance() {
            if (!ResourceManager.instance) {
                const node = new Node('ResourceManager');
                ResourceManager.instance = node.addComponent(ResourceManager);
                game.addPersistRootNode(node);
            }
            return ResourceManager.instance;
        }
        onLoad() {
            if (ResourceManager.instance && ResourceManager.instance !== this) {
                this.node.destroy();
                return;
            }
            console.log('[ResourceManager] Initialized, max cache:', this.maxCacheSize);
        }
        /**
         * 加载资源
         */
        async load(path, type = 'other') {
            // 检查缓存
            const cached = this.resourceCache.get(path);
            if (cached) {
                cached.count++;
                console.log(`[ResourceManager] Cache hit: ${path} (count: ${cached.count})`);
                return cached.asset;
            }
            // 加入加载队列
            return this.enqueueLoad(path, type);
        }
        /**
         * 批量加载资源
         */
        async loadBatch(paths) {
            const results = new Map();
            const promises = paths.map(async ({ path, type }) => {
                try {
                    const asset = await this.load(path, type);
                    results.set(path, asset);
                }
                catch (err) {
                    console.error(`[ResourceManager] Failed to load: ${path}`, err);
                }
            });
            await Promise.all(promises);
            return results;
        }
        /**
         * 预加载资源
         */
        async preload(paths) {
            console.log(`[ResourceManager] Preloading ${paths.length} resources...`);
            const promises = paths.map(({ path, type }) => this.load(path, type).catch(err => {
                console.warn(`[ResourceManager] Preload warning: ${path}`, err);
            }));
            await Promise.all(promises);
            console.log('[ResourceManager] Preload complete');
        }
        /**
         * 释放资源
         */
        release(path) {
            const ref = this.resourceCache.get(path);
            if (!ref) {
                console.warn(`[ResourceManager] Resource not found: ${path}`);
                return;
            }
            ref.count--;
            console.log(`[ResourceManager] Released: ${path} (count: ${ref.count})`);
            if (ref.count <= 0) {
                this.removeFromCache(path, ref);
            }
            this.checkAutoRelease();
        }
        /**
         * 强制释放资源
         */
        forceRelease(path) {
            const ref = this.resourceCache.get(path);
            if (ref) {
                this.removeFromCache(path, ref);
                console.log(`[ResourceManager] Force released: ${path}`);
            }
        }
        /**
         * 清空所有资源
         */
        clearAll() {
            console.log('[ResourceManager] Clearing all resources...');
            for (const [path, ref] of this.resourceCache.entries()) {
                this.removeFromCache(path, ref);
            }
            this.resourceCache.clear();
            this.loadQueue = [];
            this.isProcessing = false;
        }
        /**
         * 获取缓存数量
         */
        getCacheSize() {
            return this.resourceCache.size;
        }
        /**
         * 获取缓存信息
         */
        getCacheInfo() {
            return Array.from(this.resourceCache.entries()).map(([path, ref]) => ({
                path,
                count: ref.count,
                type: ref.type
            }));
        }
        /**
         * 加入加载队列
         */
        enqueueLoad(path, type) {
            return new Promise((resolve, reject) => {
                this.loadQueue.push({ path, type, resolve, reject });
                this.processQueue();
            });
        }
        /**
         * 处理加载队列
         */
        async processQueue() {
            if (this.isProcessing || this.loadQueue.length === 0) {
                return;
            }
            this.isProcessing = true;
            while (this.loadQueue.length > 0) {
                const { path, type, resolve, reject } = this.loadQueue.shift();
                try {
                    const asset = await this.doLoad(path, type);
                    resolve(asset);
                }
                catch (err) {
                    reject(err);
                }
            }
            this.isProcessing = false;
        }
        /**
         * 执行加载
         */
        doLoad(path, type) {
            return new Promise((resolve, reject) => {
                const assetClass = this.getAssetClass(type);
                resources.load(path, assetClass, (err, asset) => {
                    if (err) {
                        console.error(`[ResourceManager] Load failed: ${path}`, err);
                        reject(err);
                        return;
                    }
                    // 添加到缓存
                    this.addToCache(path, asset, type);
                    resolve(asset);
                });
            });
        }
        /**
         * 获取资源类
         */
        getAssetClass(type) {
            switch (type) {
                case 'image':
                    return ImageAsset;
                case 'audio':
                    return AudioClip;
                case 'prefab':
                    return Prefab;
                default:
                    return null;
            }
        }
        /**
         * 添加到缓存
         */
        addToCache(path, asset, type) {
            this.resourceCache.set(path, {
                asset,
                count: 1,
                type
            });
            console.log(`[ResourceManager] Cached: ${path} (${type})`);
        }
        /**
         * 从缓存移除
         */
        removeFromCache(path, ref) {
            if (ref.asset && typeof ref.asset.destroy === 'function') {
                ref.asset.destroy();
            }
            this.resourceCache.delete(path);
        }
        /**
         * 检查自动释放
         */
        checkAutoRelease() {
            if (this.resourceCache.size > this.autoReleaseThreshold) {
                console.log('[ResourceManager] Auto release triggered');
                // 释放引用计数为 0 的资源
                for (const [path, ref] of this.resourceCache.entries()) {
                    if (ref.count <= 0) {
                        this.removeFromCache(path, ref);
                    }
                }
            }
        }
    };
    __setFunctionName(_classThis, "ResourceManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _maxCacheSize_decorators = [property];
        _autoReleaseThreshold_decorators = [property];
        __esDecorate(null, null, _maxCacheSize_decorators, { kind: "field", name: "maxCacheSize", static: false, private: false, access: { has: obj => "maxCacheSize" in obj, get: obj => obj.maxCacheSize, set: (obj, value) => { obj.maxCacheSize = value; } }, metadata: _metadata }, _maxCacheSize_initializers, _maxCacheSize_extraInitializers);
        __esDecorate(null, null, _autoReleaseThreshold_decorators, { kind: "field", name: "autoReleaseThreshold", static: false, private: false, access: { has: obj => "autoReleaseThreshold" in obj, get: obj => obj.autoReleaseThreshold, set: (obj, value) => { obj.autoReleaseThreshold = value; } }, metadata: _metadata }, _autoReleaseThreshold_initializers, _autoReleaseThreshold_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourceManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourceManager = _classThis;
})();
module.exports = { ResourceManager };
