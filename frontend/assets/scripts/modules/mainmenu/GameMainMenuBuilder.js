/**
 * 游戏主界面 UI 生成器
 * 用于在 Cocos Creator 编辑器中创建完整的游戏主界面
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
import { _decorator, Component, Node, Label, Button, Sprite, UITransform, Widget, Color, Vec3 } from 'cc';
import { MainMenuController } from './MainMenuController';
import { TweenUtils } from '../../utils/TweenUtils';
const { ccclass, property } = _decorator;
let GameMainMenuBuilder = (() => {
    let _classDecorators = [ccclass('GameMainMenuBuilder')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _designWidth_decorators;
    let _designWidth_initializers = [];
    let _designWidth_extraInitializers = [];
    let _designHeight_decorators;
    let _designHeight_initializers = [];
    let _designHeight_extraInitializers = [];
    var GameMainMenuBuilder = _classThis = class extends _classSuper {
        /**
         * 构建游戏主菜单界面
         */
        buildMainMenu() {
            const rootNode = new Node();
            rootNode.name = 'MainMenuUI';
            const rootTransform = rootNode.addComponent(UITransform);
            rootTransform.setContentSize(this.designWidth, this.designHeight);
            const rootWidget = rootNode.addComponent(Widget);
            rootWidget.isAlignLeft = true;
            rootWidget.isAlignRight = true;
            rootWidget.isAlignTop = true;
            rootWidget.isAlignBottom = true;
            // 1. 背景层
            const background = this.createBackground();
            background.parent = rootNode;
            // 2. 游戏标题
            const gameTitle = this.createGameTitle();
            gameTitle.parent = rootNode;
            // 3. 玩家信息面板
            const playerInfo = this.createPlayerInfo();
            playerInfo.parent = rootNode;
            // 4. 主菜单按钮容器
            const menuContainer = this.createMenuContainer();
            menuContainer.parent = rootNode;
            // 5. 开始游戏按钮
            const playButton = this.createPlayButton();
            playButton.parent = menuContainer;
            // 6. 商店按钮
            const shopButton = this.createShopButton();
            shopButton.parent = menuContainer;
            // 7. 设置按钮
            const settingsButton = this.createSettingsButton();
            settingsButton.parent = menuContainer;
            // 8. 退出/登出按钮
            const logoutButton = this.createLogoutButton();
            logoutButton.parent = menuContainer;
            // 9. 版权信息
            const copyright = this.createCopyright();
            copyright.parent = rootNode;
            // 10. 添加控制器
            const controller = rootNode.addComponent(MainMenuController);
            // 11. 绑定引用
            this.bindControllerReferences(controller, {
                playButton,
                settingsButton,
                shopButton,
                logoutButton,
                playerNameLabel: playerInfo.getChildByName('NameLabel')?.getComponent(Label) || null,
                playerLevelLabel: playerInfo.getChildByName('LevelLabel')?.getComponent(Label) || null
            });
            console.log('[GameMainMenuBuilder] Main menu created successfully');
            return rootNode;
        }
        /**
         * 创建背景
         */
        createBackground() {
            const bgNode = new Node();
            bgNode.name = 'Background';
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(this.designWidth, this.designHeight);
            const bgSprite = bgNode.addComponent(Sprite);
            const bgWidget = bgNode.addComponent(Widget);
            bgWidget.isAlignLeft = true;
            bgWidget.isAlignRight = true;
            bgWidget.isAlignTop = true;
            bgWidget.isAlignBottom = true;
            return bgNode;
        }
        /**
         * 创建游戏标题
         */
        createGameTitle() {
            const titleNode = new Node();
            titleNode.name = 'GameTitle';
            const titleTransform = titleNode.addComponent(UITransform);
            titleTransform.setContentSize(1000, 200);
            const titleLabel = titleNode.addComponent(Label);
            titleLabel.string = '我的游戏';
            titleLabel.fontSize = 96;
            titleLabel.fontWeight = Label.FontWeight.BOLD;
            titleLabel.color = new Color(255, 215, 0, 255);
            const shadowNode = new Node();
            shadowNode.name = 'Shadow';
            shadowNode.parent = titleNode;
            const shadowTransform = shadowNode.addComponent(UITransform);
            shadowTransform.setContentSize(1000, 200);
            const shadowLabel = shadowNode.addComponent(Label);
            shadowLabel.string = '我的游戏';
            shadowLabel.fontSize = 96;
            shadowLabel.fontWeight = Label.FontWeight.BOLD;
            shadowLabel.color = new Color(0, 0, 0, 100);
            titleNode.setPosition(new Vec3(0, this.designHeight / 2 - 150, 0));
            const titleWidget = titleNode.addComponent(Widget);
            titleWidget.isAlignTop = true;
            titleWidget.isAlignHorizontalCenter = true;
            titleWidget.top = 100;
            return titleNode;
        }
        /**
         * 创建玩家信息面板
         */
        createPlayerInfo() {
            const infoNode = new Node();
            infoNode.name = 'PlayerInfo';
            const infoTransform = infoNode.addComponent(UITransform);
            infoTransform.setContentSize(400, 120);
            const bgNode = new Node();
            bgNode.name = 'Background';
            bgNode.parent = infoNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(400, 120);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(0, 0, 0, 150);
            const nameNode = new Node();
            nameNode.name = 'NameLabel';
            nameNode.parent = infoNode;
            const nameTransform = nameNode.addComponent(UITransform);
            nameTransform.setContentSize(300, 50);
            const nameLabel = nameNode.addComponent(Label);
            nameLabel.string = '玩家名称';
            nameLabel.fontSize = 36;
            nameLabel.color = new Color(255, 255, 255, 255);
            nameLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
            nameNode.setPosition(new Vec3(-150, 20, 0));
            const levelNode = new Node();
            levelNode.name = 'LevelLabel';
            levelNode.parent = infoNode;
            const levelTransform = levelNode.addComponent(UITransform);
            levelTransform.setContentSize(200, 40);
            const levelLabel = levelNode.addComponent(Label);
            levelLabel.string = 'Lv.1';
            levelLabel.fontSize = 32;
            levelLabel.color = new Color(255, 215, 0, 255);
            levelLabel.horizontalAlign = Label.HorizontalAlign.RIGHT;
            levelNode.setPosition(new Vec3(100, -30, 0));
            infoNode.setPosition(new Vec3(this.designWidth / 2 - 250, this.designHeight / 2 - 100, 0));
            const infoWidget = infoNode.addComponent(Widget);
            infoWidget.isAlignRight = true;
            infoWidget.isAlignTop = true;
            infoWidget.right = 200;
            infoWidget.top = 50;
            return infoNode;
        }
        /**
         * 创建菜单容器
         */
        createMenuContainer() {
            const containerNode = new Node();
            containerNode.name = 'MenuContainer';
            const containerTransform = containerNode.addComponent(UITransform);
            containerTransform.setContentSize(500, 600);
            containerNode.setPosition(new Vec3(0, -50, 0));
            const containerWidget = containerNode.addComponent(Widget);
            containerWidget.isAlignHorizontalCenter = true;
            containerWidget.isAlignVerticalCenter = true;
            return containerNode;
        }
        /**
         * 创建开始游戏按钮
         */
        createPlayButton() {
            const buttonNode = new Node();
            buttonNode.name = 'PlayButton';
            const buttonTransform = buttonNode.addComponent(UITransform);
            buttonTransform.setContentSize(450, 100);
            const bgNode = new Node();
            bgNode.name = 'Background';
            bgNode.parent = buttonNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(450, 100);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(220, 20, 60, 255);
            buttonNode.addComponent(Button);
            const labelNode = new Node();
            labelNode.name = 'Label';
            labelNode.parent = buttonNode;
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(450, 100);
            const label = labelNode.addComponent(Label);
            label.string = '开始游戏';
            label.fontSize = 48;
            label.fontWeight = Label.FontWeight.BOLD;
            label.color = new Color(255, 255, 255, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            const labelWidget = labelNode.addComponent(Widget);
            labelWidget.isAlignLeft = true;
            labelWidget.isAlignRight = true;
            labelWidget.isAlignTop = true;
            labelWidget.isAlignBottom = true;
            return buttonNode;
        }
        /**
         * 创建商店按钮
         */
        createShopButton() {
            const buttonNode = new Node();
            buttonNode.name = 'ShopButton';
            const buttonTransform = buttonNode.addComponent(UITransform);
            buttonTransform.setContentSize(450, 100);
            const bgNode = new Node();
            bgNode.name = 'Background';
            bgNode.parent = buttonNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(450, 100);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(255, 140, 0, 255);
            buttonNode.addComponent(Button);
            const labelNode = new Node();
            labelNode.name = 'Label';
            labelNode.parent = buttonNode;
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(450, 100);
            const label = labelNode.addComponent(Label);
            label.string = '商店';
            label.fontSize = 48;
            label.fontWeight = Label.FontWeight.BOLD;
            label.color = new Color(255, 255, 255, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            const labelWidget = labelNode.addComponent(Widget);
            labelWidget.isAlignLeft = true;
            labelWidget.isAlignRight = true;
            labelWidget.isAlignTop = true;
            labelWidget.isAlignBottom = true;
            return buttonNode;
        }
        /**
         * 创建设置按钮
         */
        createSettingsButton() {
            const buttonNode = new Node();
            buttonNode.name = 'SettingsButton';
            const buttonTransform = buttonNode.addComponent(UITransform);
            buttonTransform.setContentSize(450, 100);
            const bgNode = new Node();
            bgNode.name = 'Background';
            bgNode.parent = buttonNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(450, 100);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(70, 130, 180, 255);
            buttonNode.addComponent(Button);
            const labelNode = new Node();
            labelNode.name = 'Label';
            labelNode.parent = buttonNode;
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(450, 100);
            const label = labelNode.addComponent(Label);
            label.string = '设置';
            label.fontSize = 48;
            label.fontWeight = Label.FontWeight.BOLD;
            label.color = new Color(255, 255, 255, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            const labelWidget = labelNode.addComponent(Widget);
            labelWidget.isAlignLeft = true;
            labelWidget.isAlignRight = true;
            labelWidget.isAlignTop = true;
            labelWidget.isAlignBottom = true;
            return buttonNode;
        }
        /**
         * 创建退出/登出按钮
         */
        createLogoutButton() {
            const buttonNode = new Node();
            buttonNode.name = 'LogoutButton';
            const buttonTransform = buttonNode.addComponent(UITransform);
            buttonTransform.setContentSize(450, 100);
            const bgNode = new Node();
            bgNode.name = 'Background';
            bgNode.parent = buttonNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(450, 100);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(128, 128, 128, 255);
            buttonNode.addComponent(Button);
            const labelNode = new Node();
            labelNode.name = 'Label';
            labelNode.parent = buttonNode;
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(450, 100);
            const label = labelNode.addComponent(Label);
            label.string = '登出';
            label.fontSize = 48;
            label.fontWeight = Label.FontWeight.BOLD;
            label.color = new Color(255, 255, 255, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            const labelWidget = labelNode.addComponent(Widget);
            labelWidget.isAlignLeft = true;
            labelWidget.isAlignRight = true;
            labelWidget.isAlignTop = true;
            labelWidget.isAlignBottom = true;
            return buttonNode;
        }
        /**
         * 创建版权信息
         */
        createCopyright() {
            const labelNode = new Node();
            labelNode.name = 'Copyright';
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(600, 40);
            const label = labelNode.addComponent(Label);
            label.string = '© 2024 My Game. All rights reserved.';
            label.fontSize = 24;
            label.color = new Color(150, 150, 150, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            labelNode.setPosition(new Vec3(0, -this.designHeight / 2 + 50, 0));
            const labelWidget = labelNode.addComponent(Widget);
            labelWidget.isAlignBottom = true;
            labelWidget.isAlignHorizontalCenter = true;
            labelWidget.bottom = 30;
            return labelNode;
        }
        /**
         * 绑定控制器引用
         */
        bindControllerReferences(controller, refs) {
            controller.playButton = refs.playButton;
            controller.settingsButton = refs.settingsButton;
            controller.shopButton = refs.shopButton;
            controller.logoutButton = refs.logoutButton;
            controller.playerNameLabel = refs.playerNameLabel;
            controller.playerLevelLabel = refs.playerLevelLabel;
        }
        /**
         * 播放入场动画
         */
        playEnterAnimation(rootNode) {
            // 标题缩放动画
            const title = rootNode.getChildByName('GameTitle');
            if (title) {
                title.scale = new Vec3(0, 0, 0);
                TweenUtils.popupUI(title);
            }
            // 玩家信息淡入
            const playerInfo = rootNode.getChildByName('PlayerInfo');
            if (playerInfo) {
                playerInfo.opacity = 0;
                TweenUtils.fadeIn(playerInfo, 0.5);
            }
            // 菜单按钮依次出现
            const menuContainer = rootNode.getChildByName('MenuContainer');
            if (menuContainer) {
                const buttons = menuContainer.children;
                buttons.forEach((button, index) => {
                    button.scale = new Vec3(0, 0, 0);
                    setTimeout(() => {
                        TweenUtils.pulse(button, 0.3, 1.0);
                    }, index * 100);
                });
            }
        }
        constructor() {
            super(...arguments);
            this.designWidth = __runInitializers(this, _designWidth_initializers, 1920);
            this.designHeight = (__runInitializers(this, _designWidth_extraInitializers), __runInitializers(this, _designHeight_initializers, 1080));
            __runInitializers(this, _designHeight_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GameMainMenuBuilder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _designWidth_decorators = [property];
        _designHeight_decorators = [property];
        __esDecorate(null, null, _designWidth_decorators, { kind: "field", name: "designWidth", static: false, private: false, access: { has: obj => "designWidth" in obj, get: obj => obj.designWidth, set: (obj, value) => { obj.designWidth = value; } }, metadata: _metadata }, _designWidth_initializers, _designWidth_extraInitializers);
        __esDecorate(null, null, _designHeight_decorators, { kind: "field", name: "designHeight", static: false, private: false, access: { has: obj => "designHeight" in obj, get: obj => obj.designHeight, set: (obj, value) => { obj.designHeight = value; } }, metadata: _metadata }, _designHeight_initializers, _designHeight_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GameMainMenuBuilder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameMainMenuBuilder = _classThis;
})();
export { GameMainMenuBuilder };
