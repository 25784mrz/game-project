/**
 * 应用入口 - 初始化并启动应用
 */

import { EventSystem } from '@core/EventSystem';
import { ResourceManager } from '@core/ResourceManager';
import { ModuleLoader } from '@core/ModuleLoader';
import { NetworkManager } from '@modules/network/NetworkManager';
import { AudioController } from '@modules/audio/AudioController';
import { createGameModule } from '@modules/game/GameModule';

export class Application {
  private static instance: Application;
  private eventSystem: EventSystem;
  private resourceManager: ResourceManager;
  private moduleLoader: ModuleLoader;
  private network: NetworkManager;
  private audio: AudioController;
  private gameModule: any = null;
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
  async initialize(config?: { serverUrl?: string }): Promise<void> {
    if (this.isInitialized) {
      console.log('[App] Already initialized');
      return;
    }

    console.log('[App] Initializing...');

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

    this.isInitialized = true;
    this.eventSystem.emit('app:initialized');
    console.log('[App] Initialization complete');
  }

  /**
   * 注册模块
   */
  private registerModules(): void {
    this.moduleLoader.registerAll([
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
   * 启动游戏模块
   */
  startGame(): void {
    if (this.gameModule) {
      console.log('[App] Game already started');
      return;
    }

    this.gameModule = createGameModule();
    this.gameModule.start();
    console.log('[App] Game started');
  }

  /**
   * 停止游戏模块
   */
  stopGame(): void {
    if (this.gameModule) {
      this.gameModule.destroy();
      this.gameModule = null;
      console.log('[App] Game stopped');
    }
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

    this.stopGame();
    
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
    console.log('[App] Ready. Call app.startGame() to start the game.');
  } catch (err) {
    console.error('[App] Initialization failed:', err);
  }
})();
