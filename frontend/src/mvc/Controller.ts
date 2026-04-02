/**
 * MVVC 基础类 - Controller
 * 控制器层，负责业务逻辑和协调
 */

import { EventSystem } from '@core/EventSystem';
import { Model } from './Model';
import { View } from './View';
import { ViewModel } from './ViewModel';

export abstract class Controller<M extends Model, V extends View, VM extends ViewModel<M, V>> {
  protected eventSystem: EventSystem;
  protected model: M;
  protected view: V;
  protected viewModel: VM;
  protected subscriptions: Array<() => void> = [];

  constructor(model: M, view: V, viewModel: VM) {
    this.eventSystem = EventSystem.getInstance();
    this.model = model;
    this.view = view;
    this.viewModel = viewModel;
  }

  /**
   * 初始化
   */
  initialize(): void {
    this.viewModel.initialize();
    this.bindEvents();
    this.onInitialize();
  }

  /**
   * 绑定事件
   */
  protected bindEvents(): void {
    // 子类可重写
  }

  /**
   * 初始化回调
   */
  protected onInitialize(): void {
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
   * 启动
   */
  start(): void {
    this.view.mount();
    this.viewModel.show();
    this.onStart();
  }

  /**
   * 启动回调
   */
  protected onStart(): void {
    // 子类可重写
  }

  /**
   * 停止
   */
  stop(): void {
    this.onStop();
    this.viewModel.hide();
    this.view.unmount();
  }

  /**
   * 停止回调
   */
  protected onStop(): void {
    // 子类可重写
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];
    
    this.onDestroy();
    this.viewModel.destroy();
  }

  /**
   * 销毁回调
   */
  protected onDestroy(): void {
    // 子类可重写
  }
}
