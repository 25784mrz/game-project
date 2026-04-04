/**
 * 游戏管理器 - 单例模式
 * 管理游戏生命周期、状态切换、全局配置
 */
import { Component } from 'cc';
export declare enum GameState {
    BOOT = "boot",
    LOGIN = "login",
    MAIN_MENU = "main_menu",
    GAME = "game",
    PAUSE = "pause",
    GAME_OVER = "game_over"
}
export declare class GameManager extends Component {
    private static instance;
    debugMode: boolean;
    version: string;
    private currentState;
    private gameData;
    static getInstance(): GameManager;
    onLoad(): void;
    start(): void;
    /**
     * 切换游戏状态
     */
    changeState(newState: GameState): void;
    /**
     * 获取当前状态
     */
    getState(): GameState;
    /**
     * 检查是否在指定状态
     */
    isInState(state: GameState): boolean;
    /**
     * 设置游戏数据
     */
    setGameData(key: string, value: any): void;
    /**
     * 获取游戏数据
     */
    getGameData(key: string): any;
    /**
     * 清除游戏数据
     */
    clearGameData(key?: string): void;
    /**
     * 暂停游戏
     */
    pauseGame(): void;
    /**
     * 恢复游戏
     */
    resumeGame(): void;
    /**
     * 重启游戏
     */
    restartGame(): void;
    /**
     * 退出游戏
     */
    quitGame(): void;
    /**
     * 触发状态变更事件
     */
    private emitStateChange;
    /**
     * 日志输出 (根据调试模式)
     */
    log(message: string, ...args: any[]): void;
}
