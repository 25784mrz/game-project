/**
 * 游戏主界面 UI 生成器
 * 用于在 Cocos Creator 编辑器中创建完整的游戏主界面
 */
import { Component, Node } from 'cc';
export declare class GameMainMenuBuilder extends Component {
    designWidth: number;
    designHeight: number;
    /**
     * 构建游戏主菜单界面
     */
    buildMainMenu(): Node;
    /**
     * 创建背景
     */
    private createBackground;
    /**
     * 创建游戏标题
     */
    private createGameTitle;
    /**
     * 创建玩家信息面板
     */
    private createPlayerInfo;
    /**
     * 创建菜单容器
     */
    private createMenuContainer;
    /**
     * 创建开始游戏按钮
     */
    private createPlayButton;
    /**
     * 创建商店按钮
     */
    private createShopButton;
    /**
     * 创建设置按钮
     */
    private createSettingsButton;
    /**
     * 创建退出/登出按钮
     */
    private createLogoutButton;
    /**
     * 创建版权信息
     */
    private createCopyright;
    /**
     * 绑定控制器引用
     */
    private bindControllerReferences;
    /**
     * 播放入场动画
     */
    playEnterAnimation(rootNode: Node): void;
}
