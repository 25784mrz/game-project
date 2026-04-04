/**
 * 认证模块 - 主菜单场景控制器
 */

import { _decorator, Component, Node, Label, Button } from 'cc';
import { BaseController } from '../../core/BaseController';
import { GameState } from '../../core/GameManager';
import { AudioController } from '../../components/AudioController';

const { ccclass, property } = _decorator;

@ccclass('MainMenuController')
export class MainMenuController extends BaseController {
    @property(Node)
    playButton: Node | null = null;
    
    @property(Node)
    settingsButton: Node | null = null;
    
    @property(Node)
    shopButton: Node | null = null;
    
    @property(Node)
    logoutButton: Node | null = null;
    
    @property(Label)
    playerNameLabel: Label | null = null;
    
    @property(Label)
    playerLevelLabel: Label | null = null;
    
    start() {
        super.start();
    }
    
    protected onControllerStart(): void {
        this.bindEvents();
        this.updatePlayerInfo();
        
        // 播放主菜单 BGM
        this.playBGM();
        
        this.log('[MainMenu] Started');
    }
    
    /**
     * 绑定事件
     */
    private bindEvents(): void {
        if (this.playButton) {
            this.playButton.on(Button.EventType.CLICK, this.onPlayClick, this);
        }
        
        if (this.settingsButton) {
            this.settingsButton.on(Button.EventType.CLICK, this.onSettingsClick, this);
        }
        
        if (this.shopButton) {
            this.shopButton.on(Button.EventType.CLICK, this.onShopClick, this);
        }
        
        if (this.logoutButton) {
            this.logoutButton.on(Button.EventType.CLICK, this.onLogoutClick, this);
        }
    }
    
    /**
     * 更新玩家信息
     */
    updatePlayerInfo(): void {
        const playerData = this.getGameData('player');
        
        if (this.playerNameLabel && playerData?.name) {
            (this.playerNameLabel as any).string = playerData.name;
        }
        
        if (this.playerLevelLabel && playerData?.level) {
            (this.playerLevelLabel as any).string = `Lv.${playerData.level}`;
        }
    }
    
    /**
     * 开始游戏按钮点击
     */
    onPlayClick(): void {
        this.log('[MainMenu] Play button clicked');
        
        this.playClick();
        
        // 切换到游戏场景
        this.changeGameState(GameState.GAME);
        
        // TODO: 加载游戏场景
        // SceneManager.getInstance().loadScene('game');
    }
    
    /**
     * 设置按钮点击
     */
    onSettingsClick(): void {
        this.log('[MainMenu] Settings button clicked');
        this.playClick();
        
        // TODO: 打开设置面板
    }
    
    /**
     * 商店按钮点击
     */
    onShopClick(): void {
        this.log('[MainMenu] Shop button clicked');
        this.playClick();
        
        // TODO: 打开商店面板
    }
    
    /**
     * 登出按钮点击
     */
    onLogoutClick(): void {
        this.log('[MainMenu] Logout button clicked');
        this.playClick();
        
        // 清除玩家数据
        this.clearGameData('player');
        
        // 返回登录场景
        this.changeGameState(GameState.LOGIN);
        
        // TODO: 加载登录场景
        // SceneManager.getInstance().loadScene('auth');
    }
    
    protected cleanup(): void {
        if (this.isValidNode(this.playButton)) {
            (this.playButton as Node).off('click', this.onPlayClick, this);
        }
        if (this.isValidNode(this.settingsButton)) {
            (this.settingsButton as Node).off('click', this.onSettingsClick, this);
        }
        if (this.isValidNode(this.shopButton)) {
            (this.shopButton as Node).off('click', this.onShopClick, this);
        }
        if (this.isValidNode(this.logoutButton)) {
            (this.logoutButton as Node).off('click', this.onLogoutClick, this);
        }
    }
}
