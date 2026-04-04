/**
 * 主菜单场景启动脚本
 */
import { Node, Label } from 'cc';
import { BaseController } from '../core/BaseController';
export declare class MainMenuController extends BaseController {
    mainMenuUI: Node | null;
    playButton: Node | null;
    settingsButton: Node | null;
    shopButton: Node | null;
    logoutButton: Node | null;
    playerNameLabel: Label | null;
    playerLevelLabel: Label | null;
    start(): void;
    /**
     * 创建主菜单 UI
     */
    private createMainMenuUI;
    /**
     * 更新玩家信息
     */
    private updatePlayerInfo;
    /**
     * 播放背景音乐
     */
    playBGM(): void;
    /**
     * 开始游戏
     */
    onStartGame(): void;
    /**
     * 打开设置
     */
    onSettings(): void;
    /**
     * 打开商店
     */
    onShop(): void;
    /**
     * 登出
     */
    onLogout(): void;
}
