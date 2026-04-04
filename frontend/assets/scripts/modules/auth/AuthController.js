/**
 * 认证模块 - 登录/注册控制器
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
import { _decorator, Node, Label, EditBox, Button } from 'cc';
import { BaseController } from '../../core/BaseController';
import { GameState } from '../../core/GameManager';
const { ccclass, property } = _decorator;
let AuthController = (() => {
    let _classDecorators = [ccclass('AuthController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseController;
    let _usernameInput_decorators;
    let _usernameInput_initializers = [];
    let _usernameInput_extraInitializers = [];
    let _passwordInput_decorators;
    let _passwordInput_initializers = [];
    let _passwordInput_extraInitializers = [];
    let _loginButton_decorators;
    let _loginButton_initializers = [];
    let _loginButton_extraInitializers = [];
    let _registerButton_decorators;
    let _registerButton_initializers = [];
    let _registerButton_extraInitializers = [];
    let _errorLabel_decorators;
    let _errorLabel_initializers = [];
    let _errorLabel_extraInitializers = [];
    let _titleLabel_decorators;
    let _titleLabel_initializers = [];
    let _titleLabel_extraInitializers = [];
    var AuthController = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.usernameInput = __runInitializers(this, _usernameInput_initializers, null);
            this.passwordInput = (__runInitializers(this, _usernameInput_extraInitializers), __runInitializers(this, _passwordInput_initializers, null));
            this.loginButton = (__runInitializers(this, _passwordInput_extraInitializers), __runInitializers(this, _loginButton_initializers, null));
            this.registerButton = (__runInitializers(this, _loginButton_extraInitializers), __runInitializers(this, _registerButton_initializers, null));
            this.errorLabel = (__runInitializers(this, _registerButton_extraInitializers), __runInitializers(this, _errorLabel_initializers, null));
            this.titleLabel = (__runInitializers(this, _errorLabel_extraInitializers), __runInitializers(this, _titleLabel_initializers, null));
            this.isLoginMode = (__runInitializers(this, _titleLabel_extraInitializers), true);
        }
        start() {
            this.log('[Auth] Started');
            this.bindEvents();
            this.updateUI();
        }
        /**
         * 绑定事件
         */
        bindEvents() {
            if (this.loginButton) {
                this.loginButton.on(Button.EventType.CLICK, this.onLoginClick, this);
            }
            if (this.registerButton) {
                this.registerButton.on(Button.EventType.CLICK, this.onRegisterClick, this);
            }
            if (this.titleLabel) {
                this.titleLabel.node.on(Node.EventType.TOUCH_END, this.toggleMode, this);
            }
        }
        /**
         * 更新 UI
         */
        updateUI() {
            if (this.titleLabel) {
                this.titleLabel.string = this.isLoginMode ? '登录' : '注册';
            }
            if (this.loginButton) {
                this.loginButton.active = this.isLoginMode;
            }
            if (this.registerButton) {
                this.registerButton.active = !this.isLoginMode;
            }
            this.clearError();
        }
        /**
         * 切换模式
         */
        toggleMode() {
            this.isLoginMode = !this.isLoginMode;
            this.updateUI();
            this.audioController?.playClick();
        }
        /**
         * 登录按钮点击
         */
        async onLoginClick() {
            console.log('[Auth] Login clicked');
            this.audioController?.playClick();
            const username = this.usernameInput?.string || '';
            const password = this.passwordInput?.string || '';
            if (!username || !password) {
                this.showError('请输入用户名和密码');
                return;
            }
            try {
                const response = await this.sendRequest('auth:login', { username, password });
                if (response?.success) {
                    this.log('[Auth] Login successful');
                    this.setGameData('player', {
                        name: response.data.username,
                        level: response.data.level || 1,
                        token: response.data.token
                    });
                    this.changeGameState(GameState.MAIN_MENU);
                }
                else {
                    this.showError(response?.message || '登录失败');
                }
            }
            catch (err) {
                this.error('[Auth] Login error:', err);
                this.showError('网络连接失败，请检查服务器');
            }
        }
        /**
         * 注册按钮点击
         */
        async onRegisterClick() {
            console.log('[Auth] Register clicked');
            this.audioController?.playClick();
            const username = this.usernameInput?.string || '';
            const password = this.passwordInput?.string || '';
            if (!username || !password) {
                this.showError('请输入用户名和密码');
                return;
            }
            if (username.length < 3) {
                this.showError('用户名至少 3 个字符');
                return;
            }
            if (password.length < 6) {
                this.showError('密码至少 6 个字符');
                return;
            }
            try {
                const response = await this.sendRequest('auth:register', { username, password });
                if (response?.success) {
                    this.log('[Auth] Registration successful');
                    this.showError('注册成功，请登录');
                    this.toggleMode();
                }
                else {
                    this.showError(response?.message || '注册失败');
                }
            }
            catch (err) {
                this.error('[Auth] Register error:', err);
                this.showError('网络连接失败，请检查服务器');
            }
        }
        /**
         * 显示错误
         */
        showError(message) {
            if (this.errorLabel) {
                this.errorLabel.string = message;
                this.errorLabel.node.active = true;
            }
        }
        /**
         * 清除错误
         */
        clearError() {
            if (this.errorLabel) {
                this.errorLabel.string = '';
                this.errorLabel.node.active = false;
            }
        }
        onDestroy() {
            if (this.loginButton) {
                this.loginButton.off(Button.EventType.CLICK, this.onLoginClick, this);
            }
            if (this.registerButton) {
                this.registerButton.off(Button.EventType.CLICK, this.onRegisterClick, this);
            }
            this.clearError();
        }
    };
    __setFunctionName(_classThis, "AuthController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _usernameInput_decorators = [property(EditBox)];
        _passwordInput_decorators = [property(EditBox)];
        _loginButton_decorators = [property(Node)];
        _registerButton_decorators = [property(Node)];
        _errorLabel_decorators = [property(Label)];
        _titleLabel_decorators = [property(Label)];
        __esDecorate(null, null, _usernameInput_decorators, { kind: "field", name: "usernameInput", static: false, private: false, access: { has: obj => "usernameInput" in obj, get: obj => obj.usernameInput, set: (obj, value) => { obj.usernameInput = value; } }, metadata: _metadata }, _usernameInput_initializers, _usernameInput_extraInitializers);
        __esDecorate(null, null, _passwordInput_decorators, { kind: "field", name: "passwordInput", static: false, private: false, access: { has: obj => "passwordInput" in obj, get: obj => obj.passwordInput, set: (obj, value) => { obj.passwordInput = value; } }, metadata: _metadata }, _passwordInput_initializers, _passwordInput_extraInitializers);
        __esDecorate(null, null, _loginButton_decorators, { kind: "field", name: "loginButton", static: false, private: false, access: { has: obj => "loginButton" in obj, get: obj => obj.loginButton, set: (obj, value) => { obj.loginButton = value; } }, metadata: _metadata }, _loginButton_initializers, _loginButton_extraInitializers);
        __esDecorate(null, null, _registerButton_decorators, { kind: "field", name: "registerButton", static: false, private: false, access: { has: obj => "registerButton" in obj, get: obj => obj.registerButton, set: (obj, value) => { obj.registerButton = value; } }, metadata: _metadata }, _registerButton_initializers, _registerButton_extraInitializers);
        __esDecorate(null, null, _errorLabel_decorators, { kind: "field", name: "errorLabel", static: false, private: false, access: { has: obj => "errorLabel" in obj, get: obj => obj.errorLabel, set: (obj, value) => { obj.errorLabel = value; } }, metadata: _metadata }, _errorLabel_initializers, _errorLabel_extraInitializers);
        __esDecorate(null, null, _titleLabel_decorators, { kind: "field", name: "titleLabel", static: false, private: false, access: { has: obj => "titleLabel" in obj, get: obj => obj.titleLabel, set: (obj, value) => { obj.titleLabel = value; } }, metadata: _metadata }, _titleLabel_initializers, _titleLabel_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
})();
export { AuthController };
