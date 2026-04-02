/**
 * MVVC 基础类 - View
 * 视图层，负责 UI 渲染和用户交互
 */

import { EventSystem } from '@core/EventSystem';

export interface ViewConfig {
  container?: HTMLElement;
  template?: string;
  styles?: string;
}

export abstract class View {
  protected eventSystem: EventSystem;
  protected element: HTMLElement | null;
  protected container: HTMLElement | null;
  protected isMounted: boolean = false;
  protected subscriptions: Array<() => void> = [];

  constructor(config?: ViewConfig) {
    this.eventSystem = EventSystem.getInstance();
    this.container = config?.container || null;
    this.element = null;
  }

  /**
   * 渲染视图
   */
  abstract render(): string;

  /**
   * 挂载到 DOM
   */
  mount(container?: HTMLElement): void {
    if (this.isMounted) return;

    this.container = container || this.container;
    if (!this.container) {
      console.warn('[View] No container to mount to');
      return;
    }

    const html = this.render();
    this.container.innerHTML = html;
    this.element = this.container.firstElementChild as HTMLElement;
    this.isMounted = true;

    this.onMount();
    this.bindEvents();
  }

  /**
   * 挂载后回调
   */
  protected onMount(): void {
    // 子类可重写
  }

  /**
   * 绑定事件
   */
  protected bindEvents(): void {
    // 子类可重写
  }

  /**
   * 订阅事件
   */
  protected subscribe(event: string, callback: (data?: any) => void): void {
    this.eventSystem.on(event, callback);
    this.subscriptions.push(() => {
      this.eventSystem.off(event, callback);
    });
  }

  /**
   * 更新视图
   */
  update(data?: any): void {
    if (!this.isMounted) return;
    this.onUpdate(data);
  }

  /**
   * 更新回调
   */
  protected onUpdate(data?: any): void {
    // 子类可重写
  }

  /**
   * 获取 DOM 元素
   */
  getElement<T extends HTMLElement>(selector?: string): T | null {
    if (!this.element) return null;
    if (!selector) return this.element as T;
    return this.element.querySelector(selector) as T;
  }

  /**
   * 显示
   */
  show(): void {
    if (this.element) {
      this.element.style.display = '';
    }
  }

  /**
   * 隐藏
   */
  hide(): void {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  /**
   * 卸载
   */
  unmount(): void {
    if (!this.isMounted) return;

    this.onUnmount();
    
    // 取消所有订阅
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];

    if (this.container && this.element) {
      this.container.removeChild(this.element);
    }

    this.element = null;
    this.isMounted = false;
  }

  /**
   * 卸载前回调
   */
  protected onUnmount(): void {
    // 子类可重写
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.unmount();
  }
}
