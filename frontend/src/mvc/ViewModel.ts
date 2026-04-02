/**
 * MVVC 基础类 - ViewModel
 * 连接 Model 和 View 的桥梁
 */

import { EventSystem } from '@core/EventSystem';
import { Model } from './Model';
import { View } from './View';

export abstract class ViewModel<M extends Model, V extends View> {
  protected eventSystem: EventSystem;
  protected model: M;
  protected view: V;
  protected subscriptions: Array<() => void> = [];

  constructor(model: M, view: V) {
    this.eventSystem = EventSystem.getInstance();
    this.model = model;
    this.view = view;
    
    this.bindModel();
  }

  /**
   * 绑定 Model 变化
   */
  protected bindModel(): void {
    // 子类可重写以监听特定数据变化
  }

  /**
   * 同步数据到 View
   */
  protected syncToView(data?: any): void {
    this.view.update(data);
  }

  /**
   * 同步数据到 Model
   */
  protected syncToModel(key: string, value: any): void {
    this.model.set(key, value);
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
   * 初始化
   */
  initialize(): void {
    this.onInitialize();
  }

  /**
   * 初始化回调
   */
  protected onInitialize(): void {
    // 子类可重写
  }

  /**
   * 显示
   */
  show(): void {
    this.view.show();
    this.onShow();
  }

  /**
   * 显示回调
   */
  protected onShow(): void {
    // 子类可重写
  }

  /**
   * 隐藏
   */
  hide(): void {
    this.onHide();
    this.view.hide();
  }

  /**
   * 隐藏回调
   */
  protected onHide(): void {
    // 子类可重写
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];
    
    this.onDestroy();
    this.view.destroy();
    this.model.destroy();
  }

  /**
   * 销毁回调
   */
  protected onDestroy(): void {
    // 子类可重写
  }
}
