/**
 * 认证模块 - 主菜单场景控制器
 */
import { Node, Label } from 'cc';
import { BaseController } from '../../core/BaseController';
export declare class MainMenuController extends BaseController {
    playButton: Node | null;
    settingsButton: Node | null;
    shopButton: Node | null;
    logoutButton: Node | null;
    playerNameLabel: Label | null;
    playerLevelLabel: Label | null;
    start(): void;
    protected onControllerStart(): void;
    /**
     * 绑定事件
     */
    private bindEvents;
    /**
     * 更新玩家信息
     */
    updatePlayerInfo(): void;
    /**
     * 开始游戏按钮点击
     */
    onPlayClick(): void;
    /**
     * 设置按钮点击
     */
    onSettingsClick(): void;
    /**
     * 商店按钮点击
     */
    onShopClick(): void;
    /**
     * 登出按钮点击
     */
    onLogoutClick(): void;
    protected cleanup(): void;
}
