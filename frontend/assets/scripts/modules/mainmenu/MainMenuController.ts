/**
 * 认证模块 - 主菜单场景控制器
 */

import { _decorator, Component, Node, Label, Button, UITransform, EventTouch } from 'cc';
import { GameManager, GameState } from '../core/GameManager';
import { AudioController } from '../components/AudioController';

const { ccclass, property } = _decorator;

@ccclass('MainMenuController')
export class MainMenuController extends Component {
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
    
    private gameManager: GameManager | null = null;
    private audioController: AudioController | null = null;
    
    start() {
        this.gameManager = GameManager.getInstance();
        this.audioController = AudioController.getInstance();
        
        this.bindEvents();
        this.updatePlayerInfo();
        
        // 播放主菜单 BGM
        this.audioController?.playBGM();
        
        console.log('[MainMenu] Started');
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
        const playerData = this.gameManager?.getGameData('player');
        
        if (this.playerNameLabel && playerData?.name) {
            this.playerNameLabel.string = playerData.name;
        }
        
        if (this.playerLevelLabel && playerData?.level) {
            this.playerLevelLabel.string = `Lv.${playerData.level}`;
        }
    }
    
    /**
     * 开始游戏按钮点击
     */
    onPlayClick(): void {
        console.log('[MainMenu] Play button clicked');
        
        this.audioController?.playClick();
        
        // 切换到游戏场景
        this.gameManager?.changeState(GameState.GAME);
        
        // TODO: 加载游戏场景
        // SceneManager.getInstance().loadScene('game');
    }
    
    /**
     * 设置按钮点击
     */
    onSettingsClick(): void {
        console.log('[MainMenu] Settings button clicked');
        this.audioController?.playClick();
        
        // TODO: 打开设置面板
    }
    
    /**
     * 商店按钮点击
     */
    onShopClick(): void {
        console.log('[MainMenu] Shop button clicked');
        this.audioController?.playClick();
        
        // TODO: 打开商店面板
    }
    
    /**
     * 登出按钮点击
     */
    onLogoutClick(): void {
        console.log('[MainMenu] Logout button clicked');
        this.audioController?.playClick();
        
        // 清除玩家数据
        this.gameManager?.clearGameData('player');
        
        // 返回登录场景
        this.gameManager?.changeState(GameState.LOGIN);
        
        // TODO: 加载登录场景
        // SceneManager.getInstance().loadScene('auth');
    }
    
    onDestroy(): void {
        if (this.playButton) {
            this.playButton.off(Button.EventType.CLICK, this.onPlayClick, this);
        }
        if (this.settingsButton) {
            this.settingsButton.off(Button.EventType.CLICK, this.onSettingsClick, this);
        }
        if (this.shopButton) {
            this.shopButton.off(Button.EventType.CLICK, this.onShopClick, this);
        }
        if (this.logoutButton) {
            this.logoutButton.off(Button.EventType.CLICK, this.onLogoutClick, this);
        }
    }
}
