/**
 * 登录界面 UI 生成器
 * 用于在 Cocos Creator 编辑器中创建完整的登录界面
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
import { _decorator, Component, Node, Label, EditBox, Button, Sprite, UITransform, Layout, Widget, Color, Vec3 } from 'cc';
import { AuthController } from './AuthController';
import { TweenUtils } from '../../utils/TweenUtils';
const { ccclass, property } = _decorator;
let LoginUIBuilder = (() => {
    let _classDecorators = [ccclass('LoginUIBuilder')];
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
    var LoginUIBuilder = _classThis = class extends _classSuper {
        /**
         * 构建登录界面（在编辑器中调用）
         */
        buildLoginUI() {
            // 创建根节点
            const rootNode = new Node('LoginUI');
            const rootTransform = rootNode.addComponent(UITransform);
            rootTransform.setContentSize(this.designWidth, this.designHeight);
            // 添加 Widget 保持全屏
            const rootWidget = rootNode.addComponent(Widget);
            rootWidget.isAlignLeft = true;
            rootWidget.isAlignRight = true;
            rootWidget.isAlignTop = true;
            rootWidget.isAlignBottom = true;
            rootWidget.left = 0;
            rootWidget.right = 0;
            rootWidget.top = 0;
            rootWidget.bottom = 0;
            // 1. 背景层
            const background = this.createBackground();
            background.parent = rootNode;
            // 2. 标题
            const title = this.createTitle();
            title.parent = rootNode;
            // 3. 登录表单容器
            const formContainer = this.createFormContainer();
            formContainer.parent = rootNode;
            // 4. 用户名输入框
            const usernameInput = this.createUsernameInput();
            usernameInput.parent = formContainer;
            // 5. 密码输入框
            const passwordInput = this.createPasswordInput();
            passwordInput.parent = formContainer;
            // 6. 登录按钮
            const loginButton = this.createLoginButton();
            loginButton.parent = formContainer;
            // 7. 注册按钮
            const registerButton = this.createRegisterButton();
            registerButton.parent = formContainer;
            // 8. 切换提示文本
            const toggleLabel = this.createToggleLabel();
            toggleLabel.parent = formContainer;
            // 9. 错误提示标签
            const errorLabel = this.createErrorLabel();
            errorLabel.parent = formContainer;
            // 10. 添加 AuthController
            const authController = rootNode.addComponent(AuthController);
            // 11. 绑定引用到 AuthController
            this.bindControllerReferences(authController, {
                usernameInput: usernameInput.getComponent(EditBox),
                passwordInput: passwordInput.getComponent(EditBox),
                loginButton,
                registerButton,
                errorLabel: errorLabel.getComponent(Label),
                titleLabel: title.getComponent(Label)
            });
            console.log('[LoginUIBuilder] Login UI created successfully');
            return rootNode;
        }
        /**
         * 创建背景
         */
        createBackground() {
            const bgNode = new Node('Background');
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(this.designWidth, this.designHeight);
            const bgSprite = bgNode.addComponent(Sprite);
            // TODO: 设置背景图片
            // 添加 Widget
            const bgWidget = bgNode.addComponent(Widget);
            bgWidget.isAlignLeft = true;
            bgWidget.isAlignRight = true;
            bgWidget.isAlignTop = true;
            bgWidget.isAlignBottom = true;
            return bgNode;
        }
        /**
         * 创建标题
         */
        createTitle() {
            const titleNode = new Node('Title');
            const titleTransform = titleNode.addComponent(UITransform);
            titleTransform.setContentSize(800, 120);
            const titleLabel = titleNode.addComponent(Label);
            titleLabel.string = '游戏登录';
            titleLabel.fontSize = 72;
            titleLabel.fontWeight = Label.FontWeight.BOLD;
            titleLabel.color = new Color(255, 255, 255, 255);
            titleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
            // 位置：顶部居中
            titleNode.setPosition(new Vec3(0, this.designHeight / 2 - 200, 0));
            // 添加 Widget
            const titleWidget = titleNode.addComponent(Widget);
            titleWidget.isAlignTop = true;
            titleWidget.isAlignHorizontalCenter = true;
            titleWidget.top = 150;
            return titleNode;
        }
        /**
         * 创建表单容器
         */
        createFormContainer() {
            const containerNode = new Node('FormContainer');
            const containerTransform = containerNode.addComponent(UITransform);
            containerTransform.setContentSize(600, 500);
            // 添加 Layout 自动排版
            const layout = containerNode.addComponent(Layout);
            layout.type = Layout.Type.VERTICAL;
            layout.spacingY = 30;
            layout.paddingTop = 50;
            layout.paddingBottom = 50;
            layout.paddingLeft = 50;
            layout.paddingRight = 50;
            layout.resizeMode = Layout.ResizeMode.CONTAINER;
            // 位置：屏幕居中
            containerNode.setPosition(new Vec3(0, 0, 0));
            // 添加 Widget
            const containerWidget = containerNode.addComponent(Widget);
            containerWidget.isAlignHorizontalCenter = true;
            containerWidget.isAlignVerticalCenter = true;
            return containerNode;
        }
        /**
         * 创建用户名输入框
         */
        createUsernameInput() {
            const inputNode = new Node('UsernameInput');
            const inputTransform = inputNode.addComponent(UITransform);
            inputTransform.setContentSize(500, 80);
            // 背景框
            const bgNode = new Node('Background');
            bgNode.parent = inputNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(500, 80);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(40, 40, 40, 200);
            // 输入框组件
            const editBox = inputNode.addComponent(EditBox);
            editBox.placeholder = '请输入用户名';
            editBox.string = '';
            editBox.fontSize = 32;
            editBox.fontColor = new Color(255, 255, 255, 255);
            editBox.returnType = EditBox.KeyboardReturnType.DONE;
            editBox.editingDidBegan = () => console.log('[LoginUI] Username editing began');
            return inputNode;
        }
        /**
         * 创建密码输入框
         */
        createPasswordInput() {
            const inputNode = new Node('PasswordInput');
            const inputTransform = inputNode.addComponent(UITransform);
            inputTransform.setContentSize(500, 80);
            // 背景框
            const bgNode = new Node('Background');
            bgNode.parent = inputNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(500, 80);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(40, 40, 40, 200);
            // 输入框组件
            const editBox = inputNode.addComponent(EditBox);
            editBox.placeholder = '请输入密码';
            editBox.string = '';
            editBox.fontSize = 32;
            editBox.fontColor = new Color(255, 255, 255, 255);
            editBox.inputFlag = EditBox.InputFlag.PASSWORD;
            editBox.returnType = EditBox.KeyboardReturnType.DONE;
            return inputNode;
        }
        /**
         * 创建登录按钮
         */
        createLoginButton() {
            const buttonNode = new Node('LoginButton');
            const buttonTransform = buttonNode.addComponent(UITransform);
            buttonTransform.setContentSize(500, 90);
            // 背景
            const bgNode = new Node('Background');
            bgNode.parent = buttonNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(500, 90);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(65, 105, 225, 255); // 皇家蓝
            // 按钮组件
            buttonNode.addComponent(Button);
            // 按钮文本
            const labelNode = new Node('Label');
            labelNode.parent = buttonNode;
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(500, 90);
            const label = labelNode.addComponent(Label);
            label.string = '登 录';
            label.fontSize = 40;
            label.fontWeight = Label.FontWeight.BOLD;
            label.color = new Color(255, 255, 255, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            // 添加 Widget 保持文本居中
            const labelWidget = labelNode.addComponent(Widget);
            labelWidget.isAlignLeft = true;
            labelWidget.isAlignRight = true;
            labelWidget.isAlignTop = true;
            labelWidget.isAlignBottom = true;
            return buttonNode;
        }
        /**
         * 创建注册按钮
         */
        createRegisterButton() {
            const buttonNode = new Node('RegisterButton');
            const buttonTransform = buttonNode.addComponent(UITransform);
            buttonTransform.setContentSize(500, 90);
            // 背景
            const bgNode = new Node('Background');
            bgNode.parent = buttonNode;
            const bgTransform = bgNode.addComponent(UITransform);
            bgTransform.setContentSize(500, 90);
            const bgSprite = bgNode.addComponent(Sprite);
            bgSprite.color = new Color(46, 139, 87, 255); // 海洋绿
            // 按钮组件
            buttonNode.addComponent(Button);
            // 按钮文本
            const labelNode = new Node('Label');
            labelNode.parent = buttonNode;
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(500, 90);
            const label = labelNode.addComponent(Label);
            label.string = '注 册';
            label.fontSize = 40;
            label.fontWeight = Label.FontWeight.BOLD;
            label.color = new Color(255, 255, 255, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            // 添加 Widget
            const labelWidget = labelNode.addComponent(Widget);
            labelWidget.isAlignLeft = true;
            labelWidget.isAlignRight = true;
            labelWidget.isAlignTop = true;
            labelWidget.isAlignBottom = true;
            return buttonNode;
        }
        /**
         * 创建切换提示文本
         */
        createToggleLabel() {
            const labelNode = new Node('ToggleLabel');
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(400, 50);
            const label = labelNode.addComponent(Label);
            label.string = '没有账号？点击切换';
            label.fontSize = 28;
            label.color = new Color(200, 200, 200, 255);
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            return labelNode;
        }
        /**
         * 创建错误提示标签
         */
        createErrorLabel() {
            const labelNode = new Node('ErrorLabel');
            const labelTransform = labelNode.addComponent(UITransform);
            labelTransform.setContentSize(500, 40);
            const label = labelNode.addComponent(Label);
            label.string = '';
            label.fontSize = 24;
            label.color = new Color(255, 69, 0, 255); // 红色
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            // 默认隐藏
            labelNode.active = false;
            return labelNode;
        }
        /**
         * 绑定控制器引用
         */
        bindControllerReferences(controller, refs) {
            controller.usernameInput = refs.usernameInput;
            controller.passwordInput = refs.passwordInput;
            controller.loginButton = refs.loginButton;
            controller.registerButton = refs.registerButton;
            controller.errorLabel = refs.errorLabel;
            controller.titleLabel = refs.titleLabel;
        }
        /**
         * 播放入场动画
         */
        playEnterAnimation(rootNode) {
            // 标题从上方落下
            const title = rootNode.getChildByName('Title');
            if (title) {
                title.scale = new Vec3(0, 0, 0);
                TweenUtils.popupUI(title);
            }
            // 表单容器淡入
            const form = rootNode.getChildByName('FormContainer');
            if (form) {
                form.opacity = 0;
                TweenUtils.fadeIn(form, 0.5);
            }
        }
        constructor() {
            super(...arguments);
            this.designWidth = __runInitializers(this, _designWidth_initializers, 1920);
            this.designHeight = (__runInitializers(this, _designWidth_extraInitializers), __runInitializers(this, _designHeight_initializers, 1080));
            __runInitializers(this, _designHeight_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LoginUIBuilder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _designWidth_decorators = [property];
        _designHeight_decorators = [property];
        __esDecorate(null, null, _designWidth_decorators, { kind: "field", name: "designWidth", static: false, private: false, access: { has: obj => "designWidth" in obj, get: obj => obj.designWidth, set: (obj, value) => { obj.designWidth = value; } }, metadata: _metadata }, _designWidth_initializers, _designWidth_extraInitializers);
        __esDecorate(null, null, _designHeight_decorators, { kind: "field", name: "designHeight", static: false, private: false, access: { has: obj => "designHeight" in obj, get: obj => obj.designHeight, set: (obj, value) => { obj.designHeight = value; } }, metadata: _metadata }, _designHeight_initializers, _designHeight_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoginUIBuilder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoginUIBuilder = _classThis;
})();
export { LoginUIBuilder };
