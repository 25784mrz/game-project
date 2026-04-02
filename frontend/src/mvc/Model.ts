/**
 * MVVC 基础类 - Model
 * 数据层，负责数据管理和业务逻辑
 */

import { EventSystem } from '@core/EventSystem';

export abstract class Model {
  protected eventSystem: EventSystem;
  protected data: Map<string, any>;

  constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.data = new Map();
  }

  /**
   * 设置数据
   */
  set(key: string, value: any): void {
    const oldValue = this.data.get(key);
    this.data.set(key, value);
    
    if (oldValue !== value) {
      this.eventSystem.emit(`model:${this.constructor.name}:${key}`, value);
      this.eventSystem.emit(`model:${this.constructor.name}:change`, { key, value, oldValue });
    }
  }

  /**
   * 获取数据
   */
  get<T>(key: string): T | undefined {
    return this.data.get(key);
  }

  /**
   * 批量设置数据
   */
  setAll(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * 获取所有数据
   */
  getAll(): Record<string, any> {
    return Object.fromEntries(this.data);
  }

  /**
   * 删除数据
   */
  delete(key: string): void {
    const value = this.data.get(key);
    this.data.delete(key);
    this.eventSystem.emit(`model:${this.constructor.name}:delete`, { key, value });
  }

  /**
   * 清空数据
   */
  clear(): void {
    this.data.clear();
    this.eventSystem.emit(`model:${this.constructor.name}:clear`);
  }

  /**
   * 检查数据是否存在
   */
  has(key: string): boolean {
    return this.data.has(key);
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.clear();
  }
}
