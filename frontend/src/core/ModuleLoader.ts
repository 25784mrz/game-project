/**
 * 模块加载器 - 分包模式核心
 * 支持动态加载和卸载模块
 */

import { EventSystem } from '@core/EventSystem';

export interface ModuleConfig {
  name: string;
  path: string;
  dependencies?: string[];
  autoLoad?: boolean;
}

export interface ModuleInstance {
  name: string;
  instance: any;
  loaded: boolean;
  dependencies: string[];
}

export class ModuleLoader {
  private static instance: ModuleLoader;
  private eventSystem: EventSystem;
  private modules: Map<string, ModuleInstance>;
  private loadingModules: Map<string, Promise<any>>;
  private moduleConfigs: Map<string, ModuleConfig>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.modules = new Map();
    this.loadingModules = new Map();
    this.moduleConfigs = new Map();
  }

  static getInstance(): ModuleLoader {
    if (!ModuleLoader.instance) {
      ModuleLoader.instance = new ModuleLoader();
    }
    return ModuleLoader.instance;
  }

  /**
   * 注册模块配置
   */
  register(config: ModuleConfig): void {
    this.moduleConfigs.set(config.name, config);
    console.log(`[ModuleLoader] Registered module: ${config.name}`);
  }

  /**
   * 批量注册模块
   */
  registerAll(configs: ModuleConfig[]): void {
    configs.forEach(config => this.register(config));
  }

  /**
   * 加载模块
   */
  async load(moduleName: string): Promise<any> {
    // 已加载则直接返回
    if (this.modules.has(moduleName)) {
      const module = this.modules.get(moduleName)!;
      if (module.loaded) {
        return module.instance;
      }
    }

    // 正在加载中则等待
    if (this.loadingModules.has(moduleName)) {
      return this.loadingModules.get(moduleName);
    }

    const config = this.moduleConfigs.get(moduleName);
    if (!config) {
      throw new Error(`Module not registered: ${moduleName}`);
    }

    // 先加载依赖
    if (config.dependencies) {
      for (const dep of config.dependencies) {
        if (!this.isLoaded(dep)) {
          await this.load(dep);
        }
      }
    }

    // 开始加载
    const loadPromise = this.loadModule(config)
      .then(instance => {
        this.modules.set(moduleName, {
          name: moduleName,
          instance,
          loaded: true,
          dependencies: config.dependencies || []
        });
        this.loadingModules.delete(moduleName);
        this.eventSystem.emit('module:loaded', moduleName);
        console.log(`[ModuleLoader] Module loaded: ${moduleName}`);
        return instance;
      })
      .catch(err => {
        this.loadingModules.delete(moduleName);
        this.eventSystem.emit('module:error', { moduleName, error: err });
        throw err;
      });

    this.loadingModules.set(moduleName, loadPromise);
    return loadPromise;
  }

  private async loadModule(config: ModuleConfig): Promise<any> {
    try {
      // 动态导入模块
      const module = await import(config.path);
      
      // 如果模块有默认导出且是类，则实例化
      if (module.default) {
        const ModuleClass = module.default;
        if (typeof ModuleClass === 'function') {
          return new ModuleClass();
        }
        return module.default;
      }
      
      return module;
    } catch (err) {
      console.error(`[ModuleLoader] Failed to load module ${config.name}:`, err);
      throw err;
    }
  }

  /**
   * 卸载模块
   */
  async unload(moduleName: string): Promise<void> {
    const module = this.modules.get(moduleName);
    if (!module || !module.loaded) {
      console.warn(`[ModuleLoader] Module not loaded: ${moduleName}`);
      return;
    }

    // 检查是否有其他模块依赖此模块
    const dependents = this.getDependentModules(moduleName);
    if (dependents.length > 0) {
      console.warn(`[ModuleLoader] Cannot unload ${moduleName}, still used by:`, dependents);
      return;
    }

    // 调用模块的销毁方法
    if (module.instance.destroy && typeof module.instance.destroy === 'function') {
      module.instance.destroy();
    }

    this.modules.delete(moduleName);
    this.eventSystem.emit('module:unloaded', moduleName);
    console.log(`[ModuleLoader] Module unloaded: ${moduleName}`);
  }

  /**
   * 获取依赖某模块的所有模块
   */
  private getDependentModules(moduleName: string): string[] {
    const dependents: string[] = [];
    this.modules.forEach((module, name) => {
      if (module.dependencies.includes(moduleName)) {
        dependents.push(name);
      }
    });
    return dependents;
  }

  /**
   * 检查模块是否已加载
   */
  isLoaded(moduleName: string): boolean {
    const module = this.modules.get(moduleName);
    return module?.loaded === true;
  }

  /**
   * 获取模块实例
   */
  get<T>(moduleName: string): T | null {
    const module = this.modules.get(moduleName);
    return module?.loaded ? (module.instance as T) : null;
  }

  /**
   * 加载所有自动加载模块
   */
  async loadAutoModules(): Promise<void> {
    const autoLoadModules = Array.from(this.moduleConfigs.values())
      .filter(config => config.autoLoad);
    
    await Promise.all(autoLoadModules.map(config => this.load(config.name)));
  }

  /**
   * 获取所有已加载模块
   */
  getLoadedModules(): string[] {
    return Array.from(this.modules.entries())
      .filter(([_, module]) => module.loaded)
      .map(([name, _]) => name);
  }

  /**
   * 清空所有模块
   */
  async unloadAll(): Promise<void> {
    const loadedModules = this.getLoadedModules();
    
    // 按依赖关系反向卸载
    for (const moduleName of loadedModules.reverse()) {
      await this.unload(moduleName);
    }
  }
}
