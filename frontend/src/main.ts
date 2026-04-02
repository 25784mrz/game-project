/**
 * 应用入口 - 初始化并启动应用
 */

import { EventSystem } from '@core/EventSystem';
import { ResourceManager } from '@core/ResourceManager';
import { ModuleLoader } from '@core/ModuleLoader';
import { NetworkManager } from '@modules/network/NetworkManager';
import { AudioController } from '@modules/audio/AudioController';
import { createGameModule } from '@modules/game/GameModule';
import { createAuthModule } from '@modules/auth/AuthModule';
import { createMainMenuModule } from '@modules/mainmenu/MainMenuModule';

export type Screen = 'auth' | 'main' | 'game';

export class Application {
  private static instance: Application;
  private eventSystem: EventSystem;
  private resourceManager: ResourceManager;
  private moduleLoader: ModuleLoader;
  private network: NetworkManager;
  private audio: AudioController;
  
  // 模块实例
  private authModule: any = null;
  private mainMenuModule: any = null;
  private gameModule: any = null;
  
  // 当前屏幕
  private currentScreen: Screen = 'auth';
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.resourceManager = ResourceManager.getInstance();
    this.moduleLoader = ModuleLoader.getInstance();
    this.network = NetworkManager.getInstance();
    this.audio = AudioController.getInstance();
  }

  static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }
    return Application.instance;
  }

  /**
   * 初始化应用
   */
  async initialize(config?: { serverUrl?: string; containerId?: string }): Promise<void> {
    if (this.isInitialized) {
      console.log('[App] Already initialized');
      return;
    }

    console.log('[App] Initializing...');

    // 设置容器
    const containerId = config?.containerId || 'app';
    this.container = document.getElementById(containerId);
    if (!this.container) {
      // 创建容器
      this.container = document.createElement('div');
      this.container.id = 'app';
      this.container.style.width = '100%';
      this.container.style.height = '100%';
      document.body.appendChild(this.container);
      document.body.style.margin = '0';
      document.body.style.overflow = 'hidden';
    }

    // 注册模块
    this.registerModules();

    // 连接服务器
    const serverUrl = config?.serverUrl || 'ws://localhost:8080';
    try {
      await this.network.connect();
      console.log('[App] Connected to server:', serverUrl);
    } catch (err) {
      console.warn('[App] Failed to connect to server, will retry:', err);
    }

    // 预加载资源
    await this.preloadResources();

    // 加载自动模块
    await this.moduleLoader.loadAutoModules();

    // 绑定导航事件
    this.bindNavigation();

    this.isInitialized = true;
    this.eventSystem.emit('app:initialized');
    console.log('[App] Initialization complete');

    // 显示认证界面
    this.navigateTo('auth');
  }

  /**
   * 注册模块
   */
  private registerModules(): void {
    this.moduleLoader.registerAll([
      {
        name: 'auth',
        path: '@modules/auth/AuthModule',
        dependencies: ['network'],
        autoLoad: false
      },
      {
        name: 'mainmenu',
        path: '@modules/mainmenu/MainMenuModule',
        dependencies: ['network', 'audio'],
        autoLoad: false
      },
      {
        name: 'game',
        path: '@modules/game/GameModule',
        dependencies: ['network', 'audio'],
        autoLoad: false
      },
      {
        name: 'network',
        path: '@modules/network/NetworkManager',
        autoLoad: true
      },
      {
        name: 'audio',
        path: '@modules/audio/AudioController',
        autoLoad: true
      }
    ]);
  }

  /**
   * 预加载资源
   */
  private async preloadResources(): Promise<void> {
    const resources = [
      { id: 'config', url: '/assets/config.json', type: 'json' as const },
      { id: 'bgm', url: '/assets/audio/bgm.mp3', type: 'audio' as const },
      { id: 'click', url: '/assets/audio/click.mp3', type: 'audio' as const }
    ];

    try {
      await this.resourceManager.preload(resources);
      console.log('[App] Resources preloaded');
    } catch (err) {
      console.warn('[App] Some resources failed to load:', err);
    }
  }

  /**
   * 绑定导航事件
   */
  private bindNavigation(): void {
    this.eventSystem.on('app:navigate', (screen: Screen) => {
      this.navigateTo(screen);
    });
  }

  /**
   * 导航到指定屏幕
   */
  navigateTo(screen: Screen): void {
    console.log('[App] Navigate to:', screen);

    // 清理当前屏幕
    this.cleanupCurrentScreen();

    this.currentScreen = screen;

    switch (screen) {
      case 'auth':
        this.showAuthScreen();
        break;
      case 'main':
        this.showMainMenuScreen();
        break;
      case 'game':
        this.showGameScreen();
        break;
    }

    this.eventSystem.emit('app:screen changed', screen);
  }

  private cleanupCurrentScreen(): void {
    if (this.authModule) {
      this.authModule.destroy();
      this.authModule = null;
    }
    if (this.mainMenuModule) {
      this.mainMenuModule.destroy();
      this.mainMenuModule = null;
    }
    if (this.gameModule) {
      this.stopGame();
    }

    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  private async showAuthScreen(): Promise<void> {
    if (!this.moduleLoader.isLoaded('auth')) {
      await this.moduleLoader.load('auth');
    }

    this.authModule = createAuthModule();
    this.authModule.start();
    
    if (this.container) {
      this.authModule.view.mount(this.container);
    }
    
    console.log('[App] Auth screen shown');
  }

  private async showMainMenuScreen(): Promise<void> {
    if (!this.moduleLoader.isLoaded('mainmenu')) {
      await this.moduleLoader.load('mainmenu');
    }

    this.mainMenuModule = createMainMenuModule();
    this.mainMenuModule.start();
    
    if (this.container) {
      this.mainMenuModule.view.mount(this.container);
    }

    // 更新玩家信息
    if (this.authModule) {
      const username = this.authModule.controller.getUsername();
      if (username) {
        this.mainMenuModule.updatePlayerInfo(username, 1);
      }
    }
    
    console.log('[App] Main menu screen shown');
  }

  private async showGameScreen(): Promise<void> {
    if (!this.moduleLoader.isLoaded('game')) {
      await this.moduleLoader.load('game');
    }

    this.gameModule = createGameModule();
    this.gameModule.start();
    
    if (this.container) {
      this.gameModule.view.mount(this.container);
    }
    
    console.log('[App] Game screen shown');
  }

  /**
   * 启动游戏
   */
  startGame(): void {
    this.navigateTo('game');
  }

  /**
   * 停止游戏
   */
  stopGame(): void {
    if (this.gameModule) {
      this.gameModule.destroy();
      this.gameModule = null;
      console.log('[App] Game stopped');
    }
  }

  /**
   * 获取当前屏幕
   */
  getCurrentScreen(): Screen {
    return this.currentScreen;
  }

  /**
   * 获取模块
   */
  getModule<T>(name: string): T | null {
    return this.moduleLoader.get<T>(name);
  }

  /**
   * 销毁应用
   */
  async destroy(): Promise<void> {
    console.log('[App] Destroying...');

    this.cleanupCurrentScreen();
    
    await this.moduleLoader.unloadAll();
    this.resourceManager.clearAll();
    this.network.disconnect();
    
    this.eventSystem.clear();
    this.isInitialized = false;
    
    console.log('[App] Destroyed');
  }
}

// 启动应用
(async () => {
  const app = Application.getInstance();
  
  // 暴露到全局方便调试
  (window as any).app = app;

  try {
    await app.initialize();
    console.log('[App] Ready.');
  } catch (err) {
    console.error('[App] Initialization failed:', err);
  }
})();
