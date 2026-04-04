/**
 * 主菜单场景启动脚本
 */

import { _decorator, Node, find, Label } from 'cc';
import { BaseController } from '../core/BaseController';
import { GameState } from '../core/GameManager';
import { GameMainMenuBuilder } from '../modules/mainmenu/GameMainMenuBuilder';
import { TweenUtils } from '../utils/TweenUtils';

const { ccclass, property } = _decorator;

@ccclass('MainMenuController')
export class MainMenuController extends BaseController {
    @property(Node)
    mainMenuUI: Node | null = null;
    
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
        this.log('[MainMenu] Scene started');
        
        if (!this.mainMenuUI) {
            this.createMainMenuUI();
        }
        
        this.updatePlayerInfo();
        this.playBGM();
    }
    
    /**
     * 创建主菜单 UI
     */
    private createMainMenuUI(): void {
        const uiNode = new Node();
        uiNode.name = 'MainMenuUI';
        uiNode.parent = this.node;
        
        const builder = new GameMainMenuBuilder();
        const uiRoot = builder.buildMainMenu();
        uiRoot.parent = uiNode;
        
        this.mainMenuUI = uiNode;
        
        this.log('[MainMenu] Main menu UI created');
    }
    
    /**
     * 更新玩家信息
     */
    private updatePlayerInfo(): void {
        const playerData = this.getGameData('player');
        
        if (playerData) {
            this.log('[MainMenu] Player data:', playerData);
            
            const nameNode = find('MainMenuUI/PlayerInfo/NameLabel');
            const levelNode = find('MainMenuUI/PlayerInfo/LevelLabel');
            
            if (nameNode) {
                const label = nameNode.getComponent(Label);
                if (label) {
                    (label as any).string = playerData.name || '玩家';
                }
            }
            
            if (levelNode) {
                const label = levelNode.getComponent(Label);
                if (label) {
                    (label as any).string = `Lv.${playerData.level || 1}`;
                }
            }
        } else {
            this.log('[MainMenu] No player data, redirecting to login');
            this.changeGameState(GameState.LOGIN);
        }
    }
    
    /**
     * 播放背景音乐
     */
    playBGM(): void {
        super.playBGM();
    }
    
    /**
     * 开始游戏
     */
    onStartGame(): void {
        console.log('[MainMenu] Start game clicked');
        
        this.audioController?.playClick();
        
        // 淡出主菜单
        if (this.mainMenuUI) {
            TweenUtils.fadeOut(this.mainMenuUI, 0.3, () => {
                // 切换到游戏场景
                this.gameManager?.changeState(GameState.GAME);
                // SceneManager.getInstance().loadScene('game');
            });
        }
    }
    
    /**
     * 打开设置
     */
    onSettings(): void {
        console.log('[MainMenu] Settings clicked');
        this.audioController?.playClick();
        // TODO: 打开设置面板
    }
    
    /**
     * 打开商店
     */
    onShop(): void {
        console.log('[MainMenu] Shop clicked');
        this.audioController?.playClick();
        // TODO: 打开商店面板
    }
    
    /**
     * 登出
     */
    onLogout(): void {
        console.log('[MainMenu] Logout clicked');
        this.audioController?.playClick();
        
        // 清除玩家数据
        this.gameManager?.clearGameData('player');
        
        // 返回登录状态
        this.gameManager?.changeState(GameState.LOGIN);
        
        // TODO: 切换到登录场景
        // SceneManager.getInstance().loadScene('auth');
    }
}
