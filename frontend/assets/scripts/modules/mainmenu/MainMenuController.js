/**
 * 认证模块 - 主菜单场景控制器
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
import { _decorator, Node, Label, Button } from 'cc';
import { BaseController } from '../../core/BaseController';
import { GameState } from '../../core/GameManager';
const { ccclass, property } = _decorator;
let MainMenuController = (() => {
    let _classDecorators = [ccclass('MainMenuController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseController;
    let _playButton_decorators;
    let _playButton_initializers = [];
    let _playButton_extraInitializers = [];
    let _settingsButton_decorators;
    let _settingsButton_initializers = [];
    let _settingsButton_extraInitializers = [];
    let _shopButton_decorators;
    let _shopButton_initializers = [];
    let _shopButton_extraInitializers = [];
    let _logoutButton_decorators;
    let _logoutButton_initializers = [];
    let _logoutButton_extraInitializers = [];
    let _playerNameLabel_decorators;
    let _playerNameLabel_initializers = [];
    let _playerNameLabel_extraInitializers = [];
    let _playerLevelLabel_decorators;
    let _playerLevelLabel_initializers = [];
    let _playerLevelLabel_extraInitializers = [];
    var MainMenuController = _classThis = class extends _classSuper {
        start() {
            super.start();
        }
        onControllerStart() {
            this.bindEvents();
            this.updatePlayerInfo();
            // 播放主菜单 BGM
            this.playBGM();
            this.log('[MainMenu] Started');
        }
        /**
         * 绑定事件
         */
        bindEvents() {
            if (this.playButton) {
                this.playButton.on(Button.EventType.CLICK, this.onPlayClick, this);
            }
            if (this.settingsButton) {
                this.settingsButton.on(Button.EventType.CLICK, this.onSettingsClick, this);
            }
            if (this.shopButton) {
                this.shopButton.on(Button.EventType.CLICK, this.onShopClick, this);
            }
            if (this.logoutButton) {
                this.logoutButton.on(Button.EventType.CLICK, this.onLogoutClick, this);
            }
        }
        /**
         * 更新玩家信息
         */
        updatePlayerInfo() {
            const playerData = this.getGameData('player');
            if (this.playerNameLabel && playerData?.name) {
                this.playerNameLabel.string = playerData.name;
            }
            if (this.playerLevelLabel && playerData?.level) {
                this.playerLevelLabel.string = `Lv.${playerData.level}`;
            }
        }
        /**
         * 开始游戏按钮点击
         */
        onPlayClick() {
            this.log('[MainMenu] Play button clicked');
            this.playClick();
            // 切换到游戏场景
            this.changeGameState(GameState.GAME);
            // TODO: 加载游戏场景
            // SceneManager.getInstance().loadScene('game');
        }
        /**
         * 设置按钮点击
         */
        onSettingsClick() {
            this.log('[MainMenu] Settings button clicked');
            this.playClick();
            // TODO: 打开设置面板
        }
        /**
         * 商店按钮点击
         */
        onShopClick() {
            this.log('[MainMenu] Shop button clicked');
            this.playClick();
            // TODO: 打开商店面板
        }
        /**
         * 登出按钮点击
         */
        onLogoutClick() {
            this.log('[MainMenu] Logout button clicked');
            this.playClick();
            // 清除玩家数据
            this.clearGameData('player');
            // 返回登录场景
            this.changeGameState(GameState.LOGIN);
            // TODO: 加载登录场景
            // SceneManager.getInstance().loadScene('auth');
        }
        cleanup() {
            if (this.isValidNode(this.playButton)) {
                this.playButton.off('click', this.onPlayClick, this);
            }
            if (this.isValidNode(this.settingsButton)) {
                this.settingsButton.off('click', this.onSettingsClick, this);
            }
            if (this.isValidNode(this.shopButton)) {
                this.shopButton.off('click', this.onShopClick, this);
            }
            if (this.isValidNode(this.logoutButton)) {
                this.logoutButton.off('click', this.onLogoutClick, this);
            }
        }
        constructor() {
            super(...arguments);
            this.playButton = __runInitializers(this, _playButton_initializers, null);
            this.settingsButton = (__runInitializers(this, _playButton_extraInitializers), __runInitializers(this, _settingsButton_initializers, null));
            this.shopButton = (__runInitializers(this, _settingsButton_extraInitializers), __runInitializers(this, _shopButton_initializers, null));
            this.logoutButton = (__runInitializers(this, _shopButton_extraInitializers), __runInitializers(this, _logoutButton_initializers, null));
            this.playerNameLabel = (__runInitializers(this, _logoutButton_extraInitializers), __runInitializers(this, _playerNameLabel_initializers, null));
            this.playerLevelLabel = (__runInitializers(this, _playerNameLabel_extraInitializers), __runInitializers(this, _playerLevelLabel_initializers, null));
            __runInitializers(this, _playerLevelLabel_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MainMenuController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _playButton_decorators = [property(Node)];
        _settingsButton_decorators = [property(Node)];
        _shopButton_decorators = [property(Node)];
        _logoutButton_decorators = [property(Node)];
        _playerNameLabel_decorators = [property(Label)];
        _playerLevelLabel_decorators = [property(Label)];
        __esDecorate(null, null, _playButton_decorators, { kind: "field", name: "playButton", static: false, private: false, access: { has: obj => "playButton" in obj, get: obj => obj.playButton, set: (obj, value) => { obj.playButton = value; } }, metadata: _metadata }, _playButton_initializers, _playButton_extraInitializers);
        __esDecorate(null, null, _settingsButton_decorators, { kind: "field", name: "settingsButton", static: false, private: false, access: { has: obj => "settingsButton" in obj, get: obj => obj.settingsButton, set: (obj, value) => { obj.settingsButton = value; } }, metadata: _metadata }, _settingsButton_initializers, _settingsButton_extraInitializers);
        __esDecorate(null, null, _shopButton_decorators, { kind: "field", name: "shopButton", static: false, private: false, access: { has: obj => "shopButton" in obj, get: obj => obj.shopButton, set: (obj, value) => { obj.shopButton = value; } }, metadata: _metadata }, _shopButton_initializers, _shopButton_extraInitializers);
        __esDecorate(null, null, _logoutButton_decorators, { kind: "field", name: "logoutButton", static: false, private: false, access: { has: obj => "logoutButton" in obj, get: obj => obj.logoutButton, set: (obj, value) => { obj.logoutButton = value; } }, metadata: _metadata }, _logoutButton_initializers, _logoutButton_extraInitializers);
        __esDecorate(null, null, _playerNameLabel_decorators, { kind: "field", name: "playerNameLabel", static: false, private: false, access: { has: obj => "playerNameLabel" in obj, get: obj => obj.playerNameLabel, set: (obj, value) => { obj.playerNameLabel = value; } }, metadata: _metadata }, _playerNameLabel_initializers, _playerNameLabel_extraInitializers);
        __esDecorate(null, null, _playerLevelLabel_decorators, { kind: "field", name: "playerLevelLabel", static: false, private: false, access: { has: obj => "playerLevelLabel" in obj, get: obj => obj.playerLevelLabel, set: (obj, value) => { obj.playerLevelLabel = value; } }, metadata: _metadata }, _playerLevelLabel_initializers, _playerLevelLabel_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MainMenuController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MainMenuController = _classThis;
})();
export { MainMenuController };
