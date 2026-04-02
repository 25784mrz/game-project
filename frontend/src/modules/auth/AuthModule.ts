/**
 * 认证模块 - 用户登录/注册/登出
 */

import { Model } from '@mvc/Model';
import { View } from '@mvc/View';
import { ViewModel } from '@mvc/ViewModel';
import { Controller } from '@mvc/Controller';
import { EventSystem } from '@core/EventSystem';
import { NetworkManager, MessageType } from '@modules/network/NetworkManager';
import { storage } from '@utils/helpers';

// ==================== Model ====================

export interface UserData {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  token: string;
  isLoggedIn: boolean;
}

export class AuthModel extends Model {
  constructor() {
    super();
    this.setAll({
      isLoggedIn: false,
      user: null as UserData | null,
      isLoading: false,
      error: null as string | null
    });

    // 检查本地存储的登录状态
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const stored = storage.get<UserData>('auth_user');
    if (stored?.token) {
      this.set('user', stored);
      this.set('isLoggedIn', true);
      console.log('[AuthModel] Restored session for:', stored.username);
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    this.set('isLoading', true);
    this.set('error', null);

    const network = NetworkManager.getInstance();

    try {
      const response = await network.request({
        type: MessageType.AUTH_LOGIN,
        data: { username, password }
      }, 10000);

      if (response.success) {
        const user: UserData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          avatar: response.user.avatar,
          token: response.token,
          isLoggedIn: true
        };

        this.set('user', user);
        this.set('isLoggedIn', true);
        storage.set('auth_user', user);

        this.eventSystem.emit('auth:login success', user);
        return true;
      } else {
        this.set('error', response.message || '登录失败');
        this.eventSystem.emit('auth:login failed', response.message);
        return false;
      }
    } catch (err) {
      this.set('error', '网络连接失败');
      this.eventSystem.emit('auth:error', err);
      return false;
    } finally {
      this.set('isLoading', false);
    }
  }

  async register(username: string, email: string, password: string): Promise<boolean> {
    this.set('isLoading', true);
    this.set('error', null);

    const network = NetworkManager.getInstance();

    try {
      const response = await network.request({
        type: MessageType.AUTH_REGISTER,
        data: { username, email, password }
      }, 10000);

      if (response.success) {
        this.eventSystem.emit('auth:register success');
        return true;
      } else {
        this.set('error', response.message || '注册失败');
        this.eventSystem.emit('auth:register failed', response.message);
        return false;
      }
    } catch (err) {
      this.set('error', '网络连接失败');
      this.eventSystem.emit('auth:error', err);
      return false;
    } finally {
      this.set('isLoading', false);
    }
  }

  logout(): void {
    const user = this.get<UserData>('user');
    
    // 通知服务器
    const network = NetworkManager.getInstance();
    if (network.isConnected() && user?.token) {
      network.send({
        type: MessageType.AUTH_LOGOUT,
        data: { token: user.token }
      });
    }

    // 清除本地数据
    this.set('user', null);
    this.set('isLoggedIn', false);
    storage.remove('auth_user');

    this.eventSystem.emit('auth:logout');
    console.log('[AuthModel] User logged out');
  }

  getToken(): string | null {
    const user = this.get<UserData>('user');
    return user?.token || null;
  }

  getUsername(): string | null {
    const user = this.get<UserData>('user');
    return user?.username || null;
  }
}

// ==================== View ====================

export class AuthView extends View {
  private mode: 'login' | 'register' = 'login';

  render(): string {
    return `
      <div id="auth-view" style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      ">
        <div id="auth-container" style="
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          width: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        ">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; font-size: 32px; margin: 0 0 10px;">🎮 游戏中心</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 0;">${this.mode === 'login' ? '欢迎回来' : '创建新账号'}</p>
          </div>

          <form id="auth-form" style="display: flex; flex-direction: column; gap: 20px;">
            ${this.mode === 'register' ? `
              <div>
                <input 
                  type="text" 
                  id="auth-username" 
                  placeholder="用户名" 
                  required
                  style="
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.9);
                    font-size: 16px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <input 
                  type="email" 
                  id="auth-email" 
                  placeholder="邮箱（选填）" 
                  style="
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.9);
                    font-size: 16px;
                    box-sizing: border-box;
                  "
                />
              </div>
            ` : `
              <div>
                <input 
                  type="text" 
                  id="auth-username" 
                  placeholder="用户名" 
                  required
                  style="
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.9);
                    font-size: 16px;
                    box-sizing: border-box;
                  "
                />
              </div>
            `}

            <div>
              <input 
                type="password" 
                id="auth-password" 
                placeholder="密码" 
                required
                style="
                  width: 100%;
                  padding: 15px;
                  border: none;
                  border-radius: 10px;
                  background: rgba(255,255,255,0.9);
                  font-size: 16px;
                  box-sizing: border-box;
                "
              />
            </div>

            <div id="auth-error" style="
              color: #ff6b6b;
              text-align: center;
              min-height: 20px;
              font-size: 14px;
            "></div>

            <button 
              type="submit" 
              id="auth-submit"
              style="
                padding: 15px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s;
              "
            >
              ${this.mode === 'login' ? '登 录' : '注 册'}
            </button>
          </form>

          <div style="
            text-align: center;
            margin-top: 25px;
            color: rgba(255,255,255,0.7);
            font-size: 14px;
          ">
            ${this.mode === 'login' 
              ? '还没有账号？<a href="#" id="auth-switch" style="color: #667eea; text-decoration: none;">立即注册</a>'
              : '已有账号？<a href="#" id="auth-switch" style="color: #667eea; text-decoration: none;">返回登录</a>'
            }
          </div>

          <div style="
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
          ">
            <button id="auth-guest" style="
              padding: 10px 30px;
              border: 1px solid rgba(255,255,255,0.3);
              border-radius: 20px;
              background: transparent;
              color: rgba(255,255,255,0.8);
              cursor: pointer;
              font-size: 14px;
            ">
              游客模式
            </button>
          </div>
        </div>
      </div>
    `;
  }

  protected bindEvents(): void {
    const form = this.getElement<HTMLFormElement>('#auth-form');
    const switchBtn = this.getElement<HTMLAnchorElement>('#auth-switch');
    const guestBtn = this.getElement<HTMLButtonElement>('#auth-guest');
    const errorEl = this.getElement<HTMLElement>('#auth-error');
    const submitBtn = this.getElement<HTMLButtonElement>('#auth-submit');

    // 切换登录/注册
    switchBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.mode = this.mode === 'login' ? 'register' : 'login';
      this.eventSystem.emit('auth:switch mode', this.mode);
    });

    // 游客模式
    guestBtn?.addEventListener('click', () => {
      this.eventSystem.emit('auth:guest login');
    });

    // 表单提交
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = this.getElement<HTMLInputElement>('#auth-username')?.value;
      const password = this.getElement<HTMLInputElement>('#auth-password')?.value;
      const email = this.getElement<HTMLInputElement>('#auth-email')?.value;

      if (!username || !password) {
        if (errorEl) errorEl.textContent = '请填写用户名和密码';
        return;
      }

      // 禁用按钮
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '处理中...';
      }

      if (this.mode === 'login') {
        this.eventSystem.emit('auth:login request', { username, password });
      } else {
        this.eventSystem.emit('auth:register request', { username, email, password });
      }
    });
  }

  showError(message: string): void {
    const errorEl = this.getElement<HTMLElement>('#auth-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  setLoading(loading: boolean): void {
    const submitBtn = this.getElement<HTMLButtonElement>('#auth-submit');
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? '处理中...' : (this.mode === 'login' ? '登 录' : '注 册');
    }
  }
}

// ==================== ViewModel ====================

export class AuthViewModel extends ViewModel<AuthModel, AuthView> {
  private network: NetworkManager;

  constructor(model: AuthModel, view: AuthView) {
    super(model, view);
    this.network = NetworkManager.getInstance();
  }

  protected bindModel(): void {
    // 监听登录请求
    this.subscribe('auth:login request', async (data) => {
      if (data) {
        const success = await this.model.login(data.username, data.password);
        if (success) {
          this.eventSystem.emit('app:navigate', 'main');
        } else {
          const error = this.model.get<string>('error');
          if (error && this.view) {
            (this.view as AuthView).showError(error);
          }
        }
      }
    });

    // 监听注册请求
    this.subscribe('auth:register request', async (data) => {
      if (data) {
        const success = await this.model.register(data.username, data.email, data.password);
        if (success) {
          alert('注册成功！请登录');
          this.eventSystem.emit('auth:switch mode', 'login');
        } else {
          const error = this.model.get<string>('error');
          if (error && this.view) {
            (this.view as AuthView).showError(error);
          }
        }
      }
    });

    // 监听游客登录
    this.subscribe('auth:guest login', () => {
      this.eventSystem.emit('app:navigate', 'main');
    });

    // 监听模式切换
    this.subscribe('auth:switch mode', () => {
      // 重新渲染视图
      if (this.view) {
        this.view.unmount();
        this.view.mount();
      }
    });

    // 监听网络错误
    this.subscribe('network:error', () => {
      this.model.set('error', '网络连接失败，请检查网络');
    });
  }

  protected onInitialize(): void {
    console.log('[AuthViewModel] Initialized');
    
    // 如果已登录，直接跳转到主界面
    if (this.model.get<boolean>('isLoggedIn')) {
      this.eventSystem.emit('app:navigate', 'main');
    }
  }
}

// ==================== Controller ====================

export class AuthController extends Controller<AuthModel, AuthView, AuthViewModel> {
  constructor(model: AuthModel, view: AuthView, viewModel: AuthViewModel) {
    super(model, view, viewModel);
  }

  protected bindEvents(): void {
    // 监听网络消息
    this.subscribe(`network:${MessageType.AUTH_LOGIN}`, (data) => {
      console.log('[AuthController] Login response:', data);
    });
  }

  protected onInitialize(): void {
    console.log('[AuthController] Initialized');
  }

  protected onStart(): void {
    console.log('[AuthController] Started');
  }

  isLoggedIn(): boolean {
    return this.model.get<boolean>('isLoggedIn') || false;
  }

  getToken(): string | null {
    return this.model.getToken();
  }

  getUsername(): string | null {
    return this.model.getUsername();
  }
}

// ==================== 工厂函数 ====================

export function createAuthModule() {
  const model = new AuthModel();
  const view = new AuthView();
  const viewModel = new AuthViewModel(model, view);
  const controller = new AuthController(model, view, viewModel);
  
  return {
    model,
    view,
    viewModel,
    controller,
    start: () => controller.initialize(),
    destroy: () => controller.destroy()
  };
}
