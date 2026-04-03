/**
 * 资源管理器 - 负责资源的异步加载与引用计数释放
 */

interface Resource {
  id: string;
  data: any;
  refCount: number;
  type: 'image' | 'audio' | 'video' | 'json' | 'text';
}

export class ResourceManager {
  private static instance: ResourceManager;
  private resources: Map<string, Resource>;
  private loadingQueue: Map<string, Promise<any>>;

  private constructor() {
    this.resources = new Map();
    this.loadingQueue = new Map();
  }

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  /**
   * 加载资源 (引用计数 +1)
   */
  async load<T>(id: string, url: string, type: Resource['type'] = 'json'): Promise<T> {
    // 已存在则直接返回并增加引用计数
    if (this.resources.has(id)) {
      const resource = this.resources.get(id)!;
      resource.refCount++;
      return resource.data as T;
    }

    // 正在加载中则等待
    if (this.loadingQueue.has(id)) {
      return this.loadingQueue.get(id)! as Promise<T>;
    }

    // 开始加载
    const loadPromise = this.loadResource(url, type)
      .then(data => {
        this.resources.set(id, { id, data, refCount: 1, type });
        this.loadingQueue.delete(id);
        return data;
      })
      .catch(err => {
        this.loadingQueue.delete(id);
        throw err;
      });

    this.loadingQueue.set(id, loadPromise);
    return loadPromise;
  }

  private async loadResource(url: string, type: Resource['type']): Promise<any> {
    switch (type) {
      case 'json':
        const res = await fetch(url);
        return res.json();
      case 'image':
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });
      case 'audio':
        return new Promise((resolve, reject) => {
          const audio = new Audio(url);
          audio.oncanplaythrough = () => resolve(audio);
          audio.onerror = reject;
        });
      default:
        const textRes = await fetch(url);
        return textRes.text();
    }
  }

  /**
   * 引用资源 (引用计数 +1)
   */
  retain(id: string): void {
    const resource = this.resources.get(id);
    if (resource) {
      resource.refCount++;
    }
  }

  /**
   * 释放资源 (引用计数 -1, 为 0 时真正释放)
   */
  release(id: string): void {
    const resource = this.resources.get(id);
    if (!resource) return;

    resource.refCount--;
    if (resource.refCount <= 0) {
      // 清理资源
      if (resource.data instanceof HTMLImageElement) {
        resource.data.src = '';
      } else if (resource.data instanceof Audio) {
        resource.data.pause();
        resource.data.src = '';
      }
      this.resources.delete(id);
    }
  }

  /**
   * 获取资源
   */
  get<T>(id: string): T | null {
    const resource = this.resources.get(id);
    return resource ? (resource.data as T) : null;
  }

  /**
   * 检查资源是否已加载
   */
  isLoaded(id: string): boolean {
    return this.resources.has(id);
  }

  /**
   * 预加载多个资源
   */
  async preload(resources: Array<{ id: string; url: string; type: Resource['type'] }>): Promise<void> {
    await Promise.all(resources.map(r => this.load(r.id, r.url, r.type)));
  }

  /**
   * 清空所有资源
   */
  clearAll(): void {
    this.resources.forEach(resource => {
      if (resource.data instanceof HTMLImageElement) {
        resource.data.src = '';
      } else if (resource.data instanceof Audio) {
        resource.data.pause();
        resource.data.src = '';
      }
    });
    this.resources.clear();
  }
}
