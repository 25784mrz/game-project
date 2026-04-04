/**
 * 主菜单场景启动脚本
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
import { _decorator, Node, find, Label } from 'cc';
import { BaseController } from '../core/BaseController';
import { GameState } from '../core/GameManager';
import { GameMainMenuBuilder } from '../modules/mainmenu/GameMainMenuBuilder';
import { TweenUtils } from '../utils/TweenUtils';
const { ccclass, property } = _decorator;
let MainMenuController = (() => {
    let _classDecorators = [ccclass('MainMenuController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseController;
    let _mainMenuUI_decorators;
    let _mainMenuUI_initializers = [];
    let _mainMenuUI_extraInitializers = [];
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
            this.log('[MainMenu] Scene started');
            if (!this.mainMenuUI) {
                this.createMainMenuUI();
            }
            this.updatePlayerInfo();
            this.playBGM();
        }
        /**
         * 创建主菜单 UI
         */
        createMainMenuUI() {
            const uiNode = new Node();
            uiNode.name = 'MainMenuUI';
            uiNode.parent = this.node;
            const builder = new GameMainMenuBuilder();
            const uiRoot = builder.buildMainMenu();
            uiRoot.parent = uiNode;
            this.mainMenuUI = uiNode;
            this.log('[MainMenu] Main menu UI created');
        }
        /**
         * 更新玩家信息
         */
        updatePlayerInfo() {
            const playerData = this.getGameData('player');
            if (playerData) {
                this.log('[MainMenu] Player data:', playerData);
                const nameNode = find('MainMenuUI/PlayerInfo/NameLabel');
                const levelNode = find('MainMenuUI/PlayerInfo/LevelLabel');
                if (nameNode) {
                    const label = nameNode.getComponent(Label);
                    if (label) {
                        label.string = playerData.name || '玩家';
                    }
                }
                if (levelNode) {
                    const label = levelNode.getComponent(Label);
                    if (label) {
                        label.string = `Lv.${playerData.level || 1}`;
                    }
                }
            }
            else {
                this.log('[MainMenu] No player data, redirecting to login');
                this.changeGameState(GameState.LOGIN);
            }
        }
        /**
         * 播放背景音乐
         */
        playBGM() {
            super.playBGM();
        }
        /**
         * 开始游戏
         */
        onStartGame() {
            console.log('[MainMenu] Start game clicked');
            this.audioController?.playClick();
            // 淡出主菜单
            if (this.mainMenuUI) {
                TweenUtils.fadeOut(this.mainMenuUI, 0.3, () => {
                    // 切换到游戏场景
                    this.gameManager?.changeState(GameState.GAME);
                    // SceneManager.getInstance().loadScene('game');
                });
            }
        }
        /**
         * 打开设置
         */
        onSettings() {
            console.log('[MainMenu] Settings clicked');
            this.audioController?.playClick();
            // TODO: 打开设置面板
        }
        /**
         * 打开商店
         */
        onShop() {
            console.log('[MainMenu] Shop clicked');
            this.audioController?.playClick();
            // TODO: 打开商店面板
        }
        /**
         * 登出
         */
        onLogout() {
            console.log('[MainMenu] Logout clicked');
            this.audioController?.playClick();
            // 清除玩家数据
            this.gameManager?.clearGameData('player');
            // 返回登录状态
            this.gameManager?.changeState(GameState.LOGIN);
            // TODO: 切换到登录场景
            // SceneManager.getInstance().loadScene('auth');
        }
        constructor() {
            super(...arguments);
            this.mainMenuUI = __runInitializers(this, _mainMenuUI_initializers, null);
            this.playButton = (__runInitializers(this, _mainMenuUI_extraInitializers), __runInitializers(this, _playButton_initializers, null));
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
        _mainMenuUI_decorators = [property(Node)];
        _playButton_decorators = [property(Node)];
        _settingsButton_decorators = [property(Node)];
        _shopButton_decorators = [property(Node)];
        _logoutButton_decorators = [property(Node)];
        _playerNameLabel_decorators = [property(Label)];
        _playerLevelLabel_decorators = [property(Label)];
        __esDecorate(null, null, _mainMenuUI_decorators, { kind: "field", name: "mainMenuUI", static: false, private: false, access: { has: obj => "mainMenuUI" in obj, get: obj => obj.mainMenuUI, set: (obj, value) => { obj.mainMenuUI = value; } }, metadata: _metadata }, _mainMenuUI_initializers, _mainMenuUI_extraInitializers);
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
