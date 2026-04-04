/**
 * 认证模块 - 登录/注册控制器
 */

import { _decorator, Component, Node, Label, EditBox, Button } from 'cc';
import { BaseController } from '../../core/BaseController';
import { GameState } from '../../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('AuthController')
export class AuthController extends BaseController {
    @property(EditBox)
    usernameInput: EditBox | null = null;
    
    @property(EditBox)
    passwordInput: EditBox | null = null;
    
    @property(Node)
    loginButton: Node | null = null;
    
    @property(Node)
    registerButton: Node | null = null;
    
    @property(Label)
    errorLabel: Label | null = null;
    
    @property(Label)
    titleLabel: Label | null = null;
    
    private isLoginMode: boolean = true;
    
    start() {
        this.log('[Auth] Started');
        
        this.bindEvents();
        this.updateUI();
    }
    
    /**
     * 绑定事件
     */
    private bindEvents(): void {
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
    private updateUI(): void {
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
    toggleMode(): void {
        this.isLoginMode = !this.isLoginMode;
        this.updateUI();
        this.audioController?.playClick();
    }
    
    /**
     * 登录按钮点击
     */
    async onLoginClick(): Promise<void> {
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
            } else {
                this.showError(response?.message || '登录失败');
            }
        } catch (err) {
            this.error('[Auth] Login error:', err);
            this.showError('网络连接失败，请检查服务器');
        }
    }
    
    /**
     * 注册按钮点击
     */
    async onRegisterClick(): Promise<void> {
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
            } else {
                this.showError(response?.message || '注册失败');
            }
        } catch (err) {
            this.error('[Auth] Register error:', err);
            this.showError('网络连接失败，请检查服务器');
        }
    }
    
    /**
     * 显示错误
     */
    showError(message: string): void {
        if (this.errorLabel) {
            this.errorLabel.string = message;
            this.errorLabel.node.active = true;
        }
    }
    
    /**
     * 清除错误
     */
    clearError(): void {
        if (this.errorLabel) {
            this.errorLabel.string = '';
            this.errorLabel.node.active = false;
        }
    }
    
    onDestroy(): void {
        if (this.loginButton) {
            this.loginButton.off(Button.EventType.CLICK, this.onLoginClick, this);
        }
        if (this.registerButton) {
            this.registerButton.off(Button.EventType.CLICK, this.onRegisterClick, this);
        }
        this.clearError();
    }
}
