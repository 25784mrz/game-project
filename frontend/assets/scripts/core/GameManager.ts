/**
 * 游戏管理器 - 单例模式
 * 管理游戏生命周期、状态切换、全局配置
 */

import { _decorator, Component, Node, game } from 'cc';
const { ccclass, property } = _decorator;

export enum GameState {
    BOOT = 'boot',
    LOGIN = 'login',
    MAIN_MENU = 'main_menu',
    GAME = 'game',
    PAUSE = 'pause',
    GAME_OVER = 'game_over'
}

@ccclass('GameManager')
export class GameManager extends Component {
    private static instance: GameManager;
    
    @property
    debugMode: boolean = false;
    
    @property
    version: string = '1.0.0';
    
    private currentState: GameState = GameState.BOOT;
    private gameData: Map<string, any> = new Map();
    
    static getInstance(): GameManager {
        if (!GameManager.instance) {
            const node = new Node('GameManager');
            GameManager.instance = node.addComponent(GameManager);
            game.addPersistRootNode(node);
        }
        return GameManager.instance;
    }
    
    onLoad() {
        if (GameManager.instance && GameManager.instance !== this) {
            this.node.destroy();
            return;
        }
        console.log('[GameManager] Initialized, version:', this.version);
    }
    
    start() {
        this.changeState(GameState.BOOT);
    }
    
    /**
     * 切换游戏状态
     */
    changeState(newState: GameState): void {
        const oldState = this.currentState;
        this.currentState = newState;
        
        console.log(`[GameManager] State changed: ${oldState} -> ${newState}`);
        
        // 触发状态变更事件
        this.emitStateChange(oldState, newState);
    }
    
    /**
     * 获取当前状态
     */
    getState(): GameState {
        return this.currentState;
    }
    
    /**
     * 检查是否在指定状态
     */
    isInState(state: GameState): boolean {
        return this.currentState === state;
    }
    
    /**
     * 设置游戏数据
     */
    setGameData(key: string, value: any): void {
        this.gameData.set(key, value);
    }
    
    /**
     * 获取游戏数据
     */
    getGameData(key: string): any {
        return this.gameData.get(key);
    }
    
    /**
     * 清除游戏数据
     */
    clearGameData(key?: string): void {
        if (key) {
            this.gameData.delete(key);
        } else {
            this.gameData.clear();
        }
    }
    
    /**
     * 暂停游戏
     */
    pauseGame(): void {
        if (this.currentState === GameState.GAME) {
            this.changeState(GameState.PAUSE);
            game.pause();
        }
    }
    
    /**
     * 恢复游戏
     */
    resumeGame(): void {
        if (this.currentState === GameState.PAUSE) {
            game.resume();
            this.changeState(GameState.GAME);
        }
    }
    
    /**
     * 重启游戏
     */
    restartGame(): void {
        this.clearGameData();
        game.restart();
    }
    
    /**
     * 退出游戏
     */
    quitGame(): void {
        game.end();
    }
    
    /**
     * 触发状态变更事件
     */
    private emitStateChange(oldState: GameState, newState: GameState): void {
        // 事件系统会在 EventSystem 中处理
        console.log(`[GameManager] Event: state_change ${oldState} -> ${newState}`);
    }
    
    /**
     * 日志输出 (根据调试模式)
     */
    log(message: string, ...args: any[]): void {
        if (this.debugMode) {
            console.log(`[GameManager] ${message}`, ...args);
        }
    }
}
