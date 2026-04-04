/**
 * 场景管理器
 * 负责场景加载、切换、预加载
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
import { _decorator, Component, Node, director, game } from 'cc';
const { ccclass, property } = _decorator;
let SceneManager = (() => {
    let _classDecorators = [ccclass('SceneManager')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _defaultScene_decorators;
    let _defaultScene_initializers = [];
    let _defaultScene_extraInitializers = [];
    let _loadingScene_decorators;
    let _loadingScene_initializers = [];
    let _loadingScene_extraInitializers = [];
    var SceneManager = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.defaultScene = __runInitializers(this, _defaultScene_initializers, 'boot');
            this.loadingScene = (__runInitializers(this, _defaultScene_extraInitializers), __runInitializers(this, _loadingScene_initializers, 'loading'));
            this.sceneQueue = (__runInitializers(this, _loadingScene_extraInitializers), []);
            this.isLoading = false;
            this.preloadCache = new Map();
            // 场景配置
            this.scenes = new Map([
                ['boot', { name: 'boot', path: 'scenes/boot', preload: true }],
                ['main-menu', { name: 'main-menu', path: 'scenes/main-menu' }],
                ['game', { name: 'game', path: 'scenes/game' }]
            ]);
        }
        static getInstance() {
            if (!SceneManager.instance) {
                const node = new Node('SceneManager');
                SceneManager.instance = node.addComponent(SceneManager);
                game.addPersistRootNode(node);
            }
            return SceneManager.instance;
        }
        onLoad() {
            if (SceneManager.instance && SceneManager.instance !== this) {
                this.node.destroy();
                return;
            }
            console.log('[SceneManager] Initialized');
        }
        start() {
            // 预加载标记的场景
            this.preloadMarkedScenes();
        }
        /**
         * 加载场景
         */
        async loadScene(sceneName, onProgress) {
            const sceneConfig = this.scenes.get(sceneName);
            if (!sceneConfig) {
                console.error(`[SceneManager] Scene not found: ${sceneName}`);
                return;
            }
            // 如果已在缓存中，直接切换
            if (this.preloadCache.has(sceneName)) {
                console.log(`[SceneManager] Loading from cache: ${sceneName}`);
                this.switchToScene(sceneName);
                return;
            }
            // 加入队列
            this.sceneQueue.push(sceneName);
            if (this.isLoading) {
                return;
            }
            await this.processSceneQueue(onProgress);
        }
        /**
         * 预加载场景
         */
        async preloadScene(sceneName) {
            const sceneConfig = this.scenes.get(sceneName);
            if (!sceneConfig) {
                console.error(`[SceneManager] Scene not found: ${sceneName}`);
                return;
            }
            if (this.preloadCache.has(sceneName)) {
                console.log(`[SceneManager] Already preloaded: ${sceneName}`);
                return;
            }
            return new Promise((resolve, reject) => {
                director.preloadScene(sceneConfig.path, (err) => {
                    if (err) {
                        console.error(`[SceneManager] Preload failed: ${sceneName}`, err);
                        reject(err);
                    }
                    else {
                        console.log(`[SceneManager] Preloaded: ${sceneName}`);
                        resolve();
                    }
                });
            });
        }
        /**
         * 切换场景
         */
        switchToScene(sceneName) {
            const sceneConfig = this.scenes.get(sceneName);
            if (!sceneConfig) {
                console.error(`[SceneManager] Scene not found: ${sceneName}`);
                return;
            }
            console.log(`[SceneManager] Switching to: ${sceneName}`);
            director.loadScene(sceneConfig.path).then(() => {
                console.log(`[SceneManager] Loaded: ${sceneName}`);
            }).catch((err) => {
                console.error(`[SceneManager] Load failed: ${sceneName}`, err);
            });
        }
        /**
         * 处理场景队列
         */
        async processSceneQueue(onProgress) {
            while (this.sceneQueue.length > 0) {
                this.isLoading = true;
                const sceneName = this.sceneQueue.shift();
                try {
                    await this.loadSingleScene(sceneName, onProgress);
                }
                catch (err) {
                    console.error(`[SceneManager] Failed to load ${sceneName}:`, err);
                }
                this.isLoading = false;
            }
        }
        /**
         * 加载单个场景
         */
        loadSingleScene(sceneName, onProgress) {
            const sceneConfig = this.scenes.get(sceneName);
            if (!sceneConfig) {
                return Promise.reject(new Error(`Scene not found: ${sceneName}`));
            }
            return director.loadScene(sceneConfig.path);
        }
        /**
         * 预加载标记的场景
         */
        async preloadMarkedScenes() {
            for (const [name, config] of this.scenes.entries()) {
                if (config.preload) {
                    await this.preloadScene(name);
                }
            }
        }
        /**
         * 获取当前场景名
         */
        getCurrentScene() {
            return director.getScene()?.name || '';
        }
        /**
         * 注册新场景
         */
        registerScene(name, path, preload = false) {
            this.scenes.set(name, { name, path, preload });
            console.log(`[SceneManager] Registered scene: ${name}`);
        }
    };
    __setFunctionName(_classThis, "SceneManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _defaultScene_decorators = [property];
        _loadingScene_decorators = [property];
        __esDecorate(null, null, _defaultScene_decorators, { kind: "field", name: "defaultScene", static: false, private: false, access: { has: obj => "defaultScene" in obj, get: obj => obj.defaultScene, set: (obj, value) => { obj.defaultScene = value; } }, metadata: _metadata }, _defaultScene_initializers, _defaultScene_extraInitializers);
        __esDecorate(null, null, _loadingScene_decorators, { kind: "field", name: "loadingScene", static: false, private: false, access: { has: obj => "loadingScene" in obj, get: obj => obj.loadingScene, set: (obj, value) => { obj.loadingScene = value; } }, metadata: _metadata }, _loadingScene_initializers, _loadingScene_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SceneManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SceneManager = _classThis;
})();
export { SceneManager };
