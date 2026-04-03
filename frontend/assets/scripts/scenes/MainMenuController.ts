/**
 * 主菜单场景启动脚本
 */

import { _decorator, Component, Node, find, Label } from 'cc';
import { GameManager, GameState } from '../core/GameManager';
import { AudioController } from '../components/AudioController';
import { GameMainMenuBuilder } from '../modules/mainmenu/GameMainMenuBuilder';
import { TweenUtils } from '../../utils/TweenUtils';

const { ccclass, property } = _decorator;

@ccclass('MainMenuController')
export class MainMenuController extends Component {
    @property(Node)
    mainMenuUI: Node | null = null;
    
    private gameManager: GameManager | null = null;
    private audioController: AudioController | null = null;
    
    start() {
        console.log('[MainMenu] Scene started');
        
        this.gameManager = GameManager.getInstance();
        this.audioController = AudioController.getInstance();
        
        // 检查是否需要创建主菜单 UI
        if (!this.mainMenuUI) {
            this.createMainMenuUI();
        }
        
        // 更新玩家信息
        this.updatePlayerInfo();
        
        // 播放背景音乐
        this.playBGM();
    }
    
    /**
     * 创建主菜单 UI
     */
    private createMainMenuUI(): void {
        const uiNode = new Node('MainMenuUI');
        uiNode.parent = this.node;
        
        const builder = uiNode.addComponent(GameMainMenuBuilder);
        const uiRoot = builder.buildMainMenu();
        uiRoot.parent = uiNode;
        
        this.mainMenuUI = uiNode;
        
        // 播放入场动画
        builder.playEnterAnimation(uiRoot);
        
        console.log('[MainMenu] Main menu UI created');
    }
    
    /**
     * 更新玩家信息
     */
    private updatePlayerInfo(): void {
        const playerData = this.gameManager?.getGameData('player');
        
        if (playerData) {
            console.log('[MainMenu] Player data:', playerData);
            
            // 查找并更新 UI
            const nameNode = find('MainMenuUI/PlayerInfo/NameLabel', this.node);
            const levelNode = find('MainMenuUI/PlayerInfo/LevelLabel', this.node);
            
            if (nameNode) {
                const label = nameNode.getComponent(Label);
                if (label) {
                    label.string = playerData.name || '玩家';
                }
            }
            
            if (levelNode) {
                const label = levelNode.getComponent(Label);
                if (label) {
                    label.string = `Lv.${playerData.level || 1}`;
                }
            }
        } else {
            console.log('[MainMenu] No player data, redirecting to login');
            // 没有玩家数据，返回登录
            this.gameManager?.changeState(GameState.LOGIN);
        }
    }
    
    /**
     * 播放背景音乐
     */
    private playBGM(): void {
        if (this.audioController) {
            this.audioController.playBGM();
            console.log('[MainMenu] Playing BGM');
        }
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
