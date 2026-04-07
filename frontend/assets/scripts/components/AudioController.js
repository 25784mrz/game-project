/**
 * 音频控制器组件
 * 管理背景音乐、音效播放
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
const { _decorator, Component, Node, AudioClip, AudioSource, resources, game } = require('cc');
const { ccclass, property } = _decorator;
let AudioController = (() => {
    let _classDecorators = [ccclass('AudioController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _bgmClip_decorators;
    let _bgmClip_initializers = [];
    let _bgmClip_extraInitializers = [];
    let _clickClip_decorators;
    let _clickClip_initializers = [];
    let _clickClip_extraInitializers = [];
    let _bgmVolume_decorators;
    let _bgmVolume_initializers = [];
    let _bgmVolume_extraInitializers = [];
    let _sfxVolume_decorators;
    let _sfxVolume_initializers = [];
    let _sfxVolume_extraInitializers = [];
    let _maxAudioSources_decorators;
    let _maxAudioSources_initializers = [];
    let _maxAudioSources_extraInitializers = [];
    var AudioController = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.bgmClip = __runInitializers(this, _bgmClip_initializers, null);
            this.clickClip = (__runInitializers(this, _bgmClip_extraInitializers), __runInitializers(this, _clickClip_initializers, null));
            this.bgmVolume = (__runInitializers(this, _clickClip_extraInitializers), __runInitializers(this, _bgmVolume_initializers, 0.5));
            this.sfxVolume = (__runInitializers(this, _bgmVolume_extraInitializers), __runInitializers(this, _sfxVolume_initializers, 0.8));
            this.maxAudioSources = (__runInitializers(this, _sfxVolume_extraInitializers), __runInitializers(this, _maxAudioSources_initializers, 10));
            this.bgmSource = (__runInitializers(this, _maxAudioSources_extraInitializers), null);
            this.sfxPool = [];
            this.currentSfxIndex = 0;
        }
        static getInstance() {
            if (!AudioController.instance) {
                const node = new Node('AudioController');
                AudioController.instance = node.addComponent(AudioController);
                game.addPersistRootNode(node);
            }
            return AudioController.instance;
        }
        onLoad() {
            if (AudioController.instance && AudioController.instance !== this) {
                this.node.destroy();
                return;
            }
            AudioController.instance = this;
            // 初始化 BGM 音源
            this.bgmSource = this.node.addComponent(AudioSource);
            if (this.bgmSource) {
                this.bgmSource.loop = true;
                this.bgmSource.volume = this.bgmVolume;
                if (this.bgmClip) {
                    this.bgmSource.clip = this.bgmClip;
                }
            }
            // 初始化音效池
            for (let i = 0; i < this.maxAudioSources; i++) {
                const source = this.node.addComponent(AudioSource);
                if (source) {
                    source.volume = this.sfxVolume;
                }
                this.sfxPool.push(source);
            }
            console.log('[AudioController] Initialized');
        }
        onDestroy() {
            AudioController.instance = null;
        }
        /**
         * 播放背景音乐
         */
        playBGM(clip) {
            if (!this.bgmSource)
                return;
            if (clip) {
                this.bgmSource.clip = clip;
            }
            if (this.bgmSource.clip && !this.bgmSource.playing) {
                this.bgmSource.play();
                console.log('[AudioController] Playing BGM');
            }
        }
        /**
         * 停止背景音乐
         */
        stopBGM() {
            if (this.bgmSource && this.bgmSource.playing) {
                this.bgmSource.stop();
                console.log('[AudioController] Stopped BGM');
            }
        }
        /**
         * 暂停背景音乐
         */
        pauseBGM() {
            if (this.bgmSource && this.bgmSource.playing) {
                this.bgmSource.pause();
            }
        }
        /**
         * 恢复背景音乐
         */
        resumeBGM() {
            if (this.bgmSource && this.bgmSource.paused) {
                this.bgmSource.play();
            }
        }
        /**
         * 播放音效
         */
        playSFX(clip) {
            if (!clip)
                return;
            const source = this.sfxPool[this.currentSfxIndex];
            source.clip = clip;
            source.play();
            // 循环使用音效池
            this.currentSfxIndex = (this.currentSfxIndex + 1) % this.maxAudioSources;
        }
        /**
         * 播放点击音效
         */
        playClick() {
            if (this.clickClip) {
                this.playSFX(this.clickClip);
            }
        }
        /**
         * 设置 BGM 音量
         */
        setBGMVolume(volume) {
            this.bgmVolume = Math.max(0, Math.min(1, volume));
            if (this.bgmSource) {
                this.bgmSource.volume = this.bgmVolume;
            }
        }
        /**
         * 设置音效音量
         */
        setSFXVolume(volume) {
            this.sfxVolume = Math.max(0, Math.min(1, volume));
            this.sfxPool.forEach(source => {
                source.volume = this.sfxVolume;
            });
        }
        /**
         * 静音所有音频
         */
        muteAll() {
            if (this.bgmSource) {
                this.bgmSource.volume = 0;
            }
            this.sfxPool.forEach(source => {
                source.volume = 0;
            });
        }
        /**
         * 取消静音
         */
        unmuteAll() {
            if (this.bgmSource) {
                this.bgmSource.volume = this.bgmVolume;
            }
            this.sfxPool.forEach(source => {
                source.volume = this.sfxVolume;
            });
        }
        /**
         * 从资源加载音频
         */
        async loadAudio(path) {
            return new Promise((resolve) => {
                resources.load(path, AudioClip, (err, clip) => {
                    if (err) {
                        console.error('[AudioController] Failed to load audio:', path, err);
                        resolve(null);
                    }
                    else {
                        console.log('[AudioController] Loaded audio:', path);
                        resolve(clip);
                    }
                });
            });
        }
    };
    __setFunctionName(_classThis, "AudioController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _bgmClip_decorators = [property(AudioClip)];
        _clickClip_decorators = [property(AudioClip)];
        _bgmVolume_decorators = [property];
        _sfxVolume_decorators = [property];
        _maxAudioSources_decorators = [property];
        __esDecorate(null, null, _bgmClip_decorators, { kind: "field", name: "bgmClip", static: false, private: false, access: { has: obj => "bgmClip" in obj, get: obj => obj.bgmClip, set: (obj, value) => { obj.bgmClip = value; } }, metadata: _metadata }, _bgmClip_initializers, _bgmClip_extraInitializers);
        __esDecorate(null, null, _clickClip_decorators, { kind: "field", name: "clickClip", static: false, private: false, access: { has: obj => "clickClip" in obj, get: obj => obj.clickClip, set: (obj, value) => { obj.clickClip = value; } }, metadata: _metadata }, _clickClip_initializers, _clickClip_extraInitializers);
        __esDecorate(null, null, _bgmVolume_decorators, { kind: "field", name: "bgmVolume", static: false, private: false, access: { has: obj => "bgmVolume" in obj, get: obj => obj.bgmVolume, set: (obj, value) => { obj.bgmVolume = value; } }, metadata: _metadata }, _bgmVolume_initializers, _bgmVolume_extraInitializers);
        __esDecorate(null, null, _sfxVolume_decorators, { kind: "field", name: "sfxVolume", static: false, private: false, access: { has: obj => "sfxVolume" in obj, get: obj => obj.sfxVolume, set: (obj, value) => { obj.sfxVolume = value; } }, metadata: _metadata }, _sfxVolume_initializers, _sfxVolume_extraInitializers);
        __esDecorate(null, null, _maxAudioSources_decorators, { kind: "field", name: "maxAudioSources", static: false, private: false, access: { has: obj => "maxAudioSources" in obj, get: obj => obj.maxAudioSources, set: (obj, value) => { obj.maxAudioSources = value; } }, metadata: _metadata }, _maxAudioSources_initializers, _maxAudioSources_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AudioController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.instance = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AudioController = _classThis;
})();
module.exports = { AudioController };
