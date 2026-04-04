/**
 * 认证模块 - 登录/注册控制器
 */
import { Node, Label, EditBox } from 'cc';
import { BaseController } from '../../core/BaseController';
export declare class AuthController extends BaseController {
    usernameInput: EditBox | null;
    passwordInput: EditBox | null;
    loginButton: Node | null;
    registerButton: Node | null;
    errorLabel: Label | null;
    titleLabel: Label | null;
    private isLoginMode;
    start(): void;
    /**
     * 绑定事件
     */
    private bindEvents;
    /**
     * 更新 UI
     */
    private updateUI;
    /**
     * 切换模式
     */
    toggleMode(): void;
    /**
     * 登录按钮点击
     */
    onLoginClick(): Promise<void>;
    /**
     * 注册按钮点击
     */
    onRegisterClick(): Promise<void>;
    /**
     * 显示错误
     */
    showError(message: string): void;
    /**
     * 清除错误
     */
    clearError(): void;
    onDestroy(): void;
}
