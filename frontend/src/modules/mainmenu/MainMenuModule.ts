/**
 * 主界面模块 - 游戏主菜单和导航
 */

import { Model } from '@mvc/Model';
import { View } from '@mvc/View';
import { ViewModel } from '@mvc/ViewModel';
import { Controller } from '@mvc/Controller';
import { EventSystem } from '@core/EventSystem';
import { NetworkManager } from '@modules/network/NetworkManager';
import { AudioController } from '@modules/audio/AudioController';

// ==================== Model ====================

export interface MainMenuState {
  currentScreen: 'menu' | 'game' | 'settings' | 'profile';
  playerName: string;
  playerLevel: number;
  playerAvatar?: string;
  notifications: number;
}

export class MainMenuModel extends Model {
  constructor() {
    super();
    this.setAll({
      currentScreen: 'menu',
      playerName: '玩家',
      playerLevel: 1,
      playerAvatar: null,
      notifications: 0,
      isLoading: false
    });
  }

  setPlayerInfo(name: string, level: number, avatar?: string): void {
    this.set('playerName', name);
    this.set('playerLevel', level);
    if (avatar) this.set('playerAvatar', avatar);
  }

  navigateTo(screen: MainMenuState['currentScreen']): void {
    this.set('currentScreen', screen);
    this.eventSystem.emit('main:navigate', screen);
  }

  setNotifications(count: number): void {
    this.set('notifications', count);
  }

  setLoading(loading: boolean): void {
    this.set('isLoading', loading);
  }
}

// ==================== View ====================

export class MainMenuView extends View {
  render(): string {
    return `
      <div id="main-menu-view" style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        overflow: hidden;
        position: relative;
      ">
        <!-- 背景动画 -->
        <div class="bg-particles" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        "></div>

        <!-- 顶部栏 -->
        <div id="top-bar" style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          box-sizing: border-box;
          z-index: 100;
        ">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div id="player-avatar" style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
            ">👤</div>
            <div>
              <div id="player-name" style="color: #fff; font-weight: bold;">玩家</div>
              <div id="player-level" style="color: rgba(255,255,255,0.6); font-size: 12px;">Lv.1</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 20px;">
            <button id="btn-notifications" style="
              position: relative;
              background: none;
              border: none;
              color: #fff;
              font-size: 24px;
              cursor: pointer;
              padding: 5px;
            ">
              🔔
              <span id="notification-badge" style="
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff6b6b;
                color: #fff;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">0</span>
            </button>
            <button id="btn-settings" style="
              background: none;
              border: none;
              color: #fff;
              font-size: 24px;
              cursor: pointer;
              padding: 5px;
            ">⚙️</button>
            <button id="btn-logout" style="
              padding: 8px 20px;
              border: 1px solid rgba(255,255,255,0.3);
              border-radius: 20px;
              background: transparent;
              color: rgba(255,255,255,0.8);
              cursor: pointer;
              font-size: 14px;
              transition: all 0.3s;
            ">退出登录</button>
          </div>
        </div>

        <!-- 主菜单内容 -->
        <div id="menu-screen" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 50;
        ">
          <h1 style="
            color: #fff;
            font-size: 64px;
            margin: 0 0 40px;
            text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
            letter-spacing: 5px;
          ">🎮 游戏中心</h1>

          <button id="btn-start-game" class="menu-btn" style="
            width: 300px;
            padding: 20px 40px;
            border: none;
            border-radius: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          ">
            🚀 开始游戏
          </button>

          <button id="btn-continue-game" class="menu-btn" style="
            width: 300px;
            padding: 20px 40px;
            border: none;
            border-radius: 15px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(17, 153, 142, 0.4);
            display: none;
          ">
            ▶️ 继续游戏
          </button>

          <button id="btn-leaderboard" class="menu-btn" style="
            width: 300px;
            padding: 20px 40px;
            border: none;
            border-radius: 15px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4);
          ">
            🏆 排行榜
          </button>

          <button id="btn-profile" class="menu-btn" style="
            width: 300px;
            padding: 20px 40px;
            border: none;
            border-radius: 15px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
          ">
            👤 个人中心
          </button>
        </div>

        <!-- 设置面板 -->
        <div id="settings-screen" style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 200;
        ">
          <div style="
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            padding: 40px;
            width: 500px;
            max-width: 90%;
          ">
            <h2 style="color: #fff; margin: 0 0 30px; text-align: center;">⚙️ 设置</h2>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div>
                <label style="color: rgba(255,255,255,0.8); display: block; margin-bottom: 10px;">🔊 音量</label>
                <input type="range" id="setting-volume" min="0" max="100" value="80" style="width: 100%;" />
              </div>

              <div>
                <label style="color: rgba(255,255,255,0.8); display: block; margin-bottom: 10px;">🎨 画质</label>
                <select id="setting-quality" style="
                  width: 100%;
                  padding: 12px;
                  border-radius: 10px;
                  border: none;
                  background: rgba(255,255,255,0.9);
                  font-size: 16px;
                ">
                  <option value="low">低</option>
                  <option value="medium" selected>中</option>
                  <option value="high">高</option>
                  <option value="ultra">超高</option>
                </select>
              </div>

              <div>
                <label style="color: rgba(255,255,255,0.8); display: block; margin-bottom: 10px;">🎤 语音控制</label>
                <label style="display: flex; align-items: center; gap: 10px; color: #fff;">
                  <input type="checkbox" id="setting-voice" checked />
                  启用语音命令
                </label>
              </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <button id="btn-close-settings" style="
                padding: 15px 40px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                font-size: 18px;
                cursor: pointer;
              ">关闭</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  protected bindEvents(): void {
    // 开始游戏
    const startBtn = this.getElement<HTMLButtonElement>('#btn-start-game');
    startBtn?.addEventListener('click', () => {
      this.eventSystem.emit('main:start game');
    });

    // 继续游戏
    const continueBtn = this.getElement<HTMLButtonElement>('#btn-continue-game');
    continueBtn?.addEventListener('click', () => {
      this.eventSystem.emit('main:continue game');
    });

    // 排行榜
    const leaderboardBtn = this.getElement<HTMLButtonElement>('#btn-leaderboard');
    leaderboardBtn?.addEventListener('click', () => {
      this.eventSystem.emit('main:show leaderboard');
    });

    // 个人中心
    const profileBtn = this.getElement<HTMLButtonElement>('#btn-profile');
    profileBtn?.addEventListener('click', () => {
      this.eventSystem.emit('main:show profile');
    });

    // 设置
    const settingsBtn = this.getElement<HTMLButtonElement>('#btn-settings');
    settingsBtn?.addEventListener('click', () => {
      const settingsScreen = this.getElement<HTMLElement>('#settings-screen');
      if (settingsScreen) {
        settingsScreen.style.display = 'flex';
      }
    });

    // 关闭设置
    const closeSettingsBtn = this.getElement<HTMLButtonElement>('#btn-close-settings');
    closeSettingsBtn?.addEventListener('click', () => {
      const settingsScreen = this.getElement<HTMLElement>('#settings-screen');
      if (settingsScreen) {
        settingsScreen.style.display = 'none';
      }
    });

    // 退出登录
    const logoutBtn = this.getElement<HTMLButtonElement>('#btn-logout');
    logoutBtn?.addEventListener('click', () => {
      if (confirm('确定要退出登录吗？')) {
        this.eventSystem.emit('main:logout');
      }
    });

    // 通知
    const notificationBtn = this.getElement<HTMLButtonElement>('#btn-notifications');
    notificationBtn?.addEventListener('click', () => {
      this.eventSystem.emit('main:show notifications');
    });

    // 音量设置
    const volumeSlider = this.getElement<HTMLInputElement>('#setting-volume');
    volumeSlider?.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value) / 100;
      this.eventSystem.emit('main:volume change', volume);
    });
  }

  updatePlayerInfo(name: string, level: number): void {
    const nameEl = this.getElement<HTMLElement>('#player-name');
    const levelEl = this.getElement<HTMLElement>('#player-level');
    
    if (nameEl) nameEl.textContent = name;
    if (levelEl) levelEl.textContent = `Lv.${level}`;
  }

  setNotifications(count: number): void {
    const badge = this.getElement<HTMLElement>('#notification-badge');
    if (badge) {
      badge.textContent = String(count);
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  showContinueButton(show: boolean): void {
    const btn = this.getElement<HTMLButtonElement>('#btn-continue-game');
    if (btn) {
      btn.style.display = show ? 'block' : 'none';
    }
  }
}

// ==================== ViewModel ====================

export class MainMenuViewModel extends ViewModel<MainMenuModel, MainMenuView> {
  private network: NetworkManager;
  private audio: AudioController;

  constructor(model: MainMenuModel, view: MainMenuView) {
    super(model, view);
    this.network = NetworkManager.getInstance();
    this.audio = AudioController.getInstance();
  }

  protected bindModel(): void {
    // 监听导航
    this.subscribe('main:navigate', (screen) => {
      console.log('[MainMenuVM] Navigate to:', screen);
    });

    // 监听开始游戏
    this.subscribe('main:start game', () => {
      this.audio.speak('游戏开始');
      this.eventSystem.emit('game:start');
    });

    // 监听退出登录
    this.subscribe('main:logout', () => {
      this.eventSystem.emit('auth:logout');
    });

    // 监听音量变化
    this.subscribe('main:volume change', (volume) => {
      this.audio.setVolume(volume);
    });

    // 监听游戏状态
    this.subscribe('game:started', () => {
      this.model.set('currentScreen', 'game');
    });
  }

  protected onInitialize(): void {
    console.log('[MainMenuViewModel] Initialized');
    
    // 更新玩家信息
    const username = this.eventSystem['eventSystem'] ? null : null; // 从 auth 模块获取
    if (username) {
      this.model.setPlayerInfo(username, 1);
    }
  }

  updatePlayerInfo(name: string, level: number): void {
    this.model.setPlayerInfo(name, level);
    if (this.view) {
      this.view.updatePlayerInfo(name, level);
    }
  }

  setNotifications(count: number): void {
    this.model.setNotifications(count);
    if (this.view) {
      this.view.setNotifications(count);
    }
  }
}

// ==================== Controller ====================

export class MainMenuController extends Controller<MainMenuModel, MainMenuView, MainMenuViewModel> {
  constructor(model: MainMenuModel, view: MainMenuView, viewModel: MainMenuViewModel) {
    super(model, view, viewModel);
  }

  protected bindEvents(): void {
    // 监听认证登出
    this.subscribe('auth:logout', () => {
      this.eventSystem.emit('app:navigate', 'auth');
    });

    // 监听游戏结束
    this.subscribe('game:over', (data) => {
      console.log('[MainMenuController] Game over:', data);
      this.model.set('currentScreen', 'menu');
    });
  }

  protected onInitialize(): void {
    console.log('[MainMenuController] Initialized');
  }

  protected onStart(): void {
    console.log('[MainMenuController] Started');
    
    // 检查是否有存档
    const hasSave = false; // TODO: 从服务器获取
    if (this.view) {
      this.view.showContinueButton(hasSave);
    }
  }

  updatePlayerInfo(name: string, level: number): void {
    this.viewModel.updatePlayerInfo(name, level);
  }
}

// ==================== 工厂函数 ====================

export function createMainMenuModule() {
  const model = new MainMenuModel();
  const view = new MainMenuView();
  const viewModel = new MainMenuViewModel(model, view);
  const controller = new MainMenuController(model, view, viewModel);
  
  return {
    model,
    view,
    viewModel,
    controller,
    start: () => controller.initialize(),
    destroy: () => controller.destroy(),
    updatePlayerInfo: (name: string, level: number) => controller.updatePlayerInfo(name, level)
  };
}
