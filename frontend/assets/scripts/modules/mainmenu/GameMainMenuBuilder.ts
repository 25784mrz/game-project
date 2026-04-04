/**
 * 游戏主界面 UI 生成器
 * 用于在 Cocos Creator 编辑器中创建完整的游戏主界面
 */

import { _decorator, Component, Node, Label, Button, Sprite, UITransform, Widget, Color, Vec3, ProgressBar } from 'cc';
import { MainMenuController } from './MainMenuController';
import { TweenUtils } from '../../utils/TweenUtils';

const { ccclass, property } = _decorator;

@ccclass('GameMainMenuBuilder')
export class GameMainMenuBuilder extends Component {
    @property
    designWidth: number = 1920;
    
    @property
    designHeight: number = 1080;
    
    /**
     * 构建游戏主菜单界面
     */
    buildMainMenu(): Node {
        const rootNode = new Node();
        rootNode.name = 'MainMenuUI';
        const rootTransform = rootNode.addComponent(UITransform) as UITransform;
        (rootTransform as any).setContentSize(this.designWidth, this.designHeight);
        
        const rootWidget = rootNode.addComponent(Widget) as any;
        rootWidget.isAlignLeft = true;
        rootWidget.isAlignRight = true;
        rootWidget.isAlignTop = true;
        rootWidget.isAlignBottom = true;
        
        // 1. 背景层
        const background = this.createBackground();
        background.parent = rootNode;
        
        // 2. 游戏标题
        const gameTitle = this.createGameTitle();
        gameTitle.parent = rootNode;
        
        // 3. 玩家信息面板
        const playerInfo = this.createPlayerInfo();
        playerInfo.parent = rootNode;
        
        // 4. 主菜单按钮容器
        const menuContainer = this.createMenuContainer();
        menuContainer.parent = rootNode;
        
        // 5. 开始游戏按钮
        const playButton = this.createPlayButton();
        playButton.parent = menuContainer;
        
        // 6. 商店按钮
        const shopButton = this.createShopButton();
        shopButton.parent = menuContainer;
        
        // 7. 设置按钮
        const settingsButton = this.createSettingsButton();
        settingsButton.parent = menuContainer;
        
        // 8. 退出/登出按钮
        const logoutButton = this.createLogoutButton();
        logoutButton.parent = menuContainer;
        
        // 9. 版权信息
        const copyright = this.createCopyright();
        copyright.parent = rootNode;
        
        // 10. 添加控制器
        const controller = rootNode.addComponent(MainMenuController) as MainMenuController;
        
        // 11. 绑定引用
        this.bindControllerReferences(controller, {
            playButton,
            settingsButton,
            shopButton,
            logoutButton,
            playerNameLabel: playerInfo.getChildByName('NameLabel')?.getComponent(Label) || null,
            playerLevelLabel: playerInfo.getChildByName('LevelLabel')?.getComponent(Label) || null
        });
        
        console.log('[GameMainMenuBuilder] Main menu created successfully');
        return rootNode;
    }
    
    /**
     * 创建背景
     */
    private createBackground(): Node {
        const bgNode = new Node();
        bgNode.name = 'Background';
        const bgTransform = bgNode.addComponent(UITransform) as UITransform;
        (bgTransform as any).setContentSize(this.designWidth, this.designHeight);
        
        const bgSprite = bgNode.addComponent(Sprite);
        
        const bgWidget = bgNode.addComponent(Widget) as any;
        bgWidget.isAlignLeft = true;
        bgWidget.isAlignRight = true;
        bgWidget.isAlignTop = true;
        bgWidget.isAlignBottom = true;
        
        return bgNode;
    }
    
    /**
     * 创建游戏标题
     */
    private createGameTitle(): Node {
        const titleNode = new Node();
        titleNode.name = 'GameTitle';
        const titleTransform = titleNode.addComponent(UITransform) as UITransform;
        (titleTransform as any).setContentSize(1000, 200);
        
        const titleLabel = titleNode.addComponent(Label) as any;
        titleLabel.string = '我的游戏';
        titleLabel.fontSize = 96;
        titleLabel.fontWeight = (Label as any).FontWeight.BOLD;
        titleLabel.color = new Color(255, 215, 0, 255);
        
        const shadowNode = new Node();
        shadowNode.name = 'Shadow';
        shadowNode.parent = titleNode;
        const shadowTransform = shadowNode.addComponent(UITransform) as UITransform;
        (shadowTransform as any).setContentSize(1000, 200);
        const shadowLabel = shadowNode.addComponent(Label) as any;
        shadowLabel.string = '我的游戏';
        shadowLabel.fontSize = 96;
        shadowLabel.fontWeight = (Label as any).FontWeight.BOLD;
        shadowLabel.color = new Color(0, 0, 0, 100);
        
        titleNode.setPosition(new Vec3(0, this.designHeight / 2 - 150, 0));
        
        const titleWidget = titleNode.addComponent(Widget) as any;
        titleWidget.isAlignTop = true;
        titleWidget.isAlignHorizontalCenter = true;
        titleWidget.top = 100;
        
        return titleNode;
    }
    
    /**
     * 创建玩家信息面板
     */
    private createPlayerInfo(): Node {
        const infoNode = new Node();
        infoNode.name = 'PlayerInfo';
        const infoTransform = infoNode.addComponent(UITransform) as UITransform;
        (infoTransform as any).setContentSize(400, 120);
        
        const bgNode = new Node();
        bgNode.name = 'Background';
        bgNode.parent = infoNode;
        const bgTransform = bgNode.addComponent(UITransform) as UITransform;
        (bgTransform as any).setContentSize(400, 120);
        const bgSprite = bgNode.addComponent(Sprite) as any;
        bgSprite.color = new Color(0, 0, 0, 150);
        
        const nameNode = new Node();
        nameNode.name = 'NameLabel';
        nameNode.parent = infoNode;
        const nameTransform = nameNode.addComponent(UITransform) as UITransform;
        (nameTransform as any).setContentSize(300, 50);
        const nameLabel = nameNode.addComponent(Label) as any;
        nameLabel.string = '玩家名称';
        nameLabel.fontSize = 36;
        nameLabel.color = new Color(255, 255, 255, 255);
        nameLabel.horizontalAlign = (Label as any).HorizontalAlign.LEFT;
        nameNode.setPosition(new Vec3(-150, 20, 0));
        
        const levelNode = new Node();
        levelNode.name = 'LevelLabel';
        levelNode.parent = infoNode;
        const levelTransform = levelNode.addComponent(UITransform) as UITransform;
        (levelTransform as any).setContentSize(200, 40);
        const levelLabel = levelNode.addComponent(Label) as any;
        levelLabel.string = 'Lv.1';
        levelLabel.fontSize = 32;
        levelLabel.color = new Color(255, 215, 0, 255);
        levelLabel.horizontalAlign = (Label as any).HorizontalAlign.RIGHT;
        levelNode.setPosition(new Vec3(100, -30, 0));
        
        infoNode.setPosition(new Vec3(this.designWidth / 2 - 250, this.designHeight / 2 - 100, 0));
        
        const infoWidget = infoNode.addComponent(Widget) as any;
        infoWidget.isAlignRight = true;
        infoWidget.isAlignTop = true;
        infoWidget.right = 200;
        infoWidget.top = 50;
        
        return infoNode;
    }
    
    /**
     * 创建菜单容器
     */
    private createMenuContainer(): Node {
        const containerNode = new Node();
        containerNode.name = 'MenuContainer';
        const containerTransform = containerNode.addComponent(UITransform) as UITransform;
        (containerTransform as any).setContentSize(500, 600);
        
        containerNode.setPosition(new Vec3(0, -50, 0));
        
        const containerWidget = containerNode.addComponent(Widget) as any;
        containerWidget.isAlignHorizontalCenter = true;
        containerWidget.isAlignVerticalCenter = true;
        
        return containerNode;
    }
    
    /**
     * 创建开始游戏按钮
     */
    private createPlayButton(): Node {
        const buttonNode = new Node();
        buttonNode.name = 'PlayButton';
        const buttonTransform = buttonNode.addComponent(UITransform) as UITransform;
        (buttonTransform as any).setContentSize(450, 100);
        
        const bgNode = new Node();
        bgNode.name = 'Background';
        bgNode.parent = buttonNode;
        const bgTransform = bgNode.addComponent(UITransform) as UITransform;
        (bgTransform as any).setContentSize(450, 100);
        const bgSprite = bgNode.addComponent(Sprite) as any;
        bgSprite.color = new Color(220, 20, 60, 255);
        
        buttonNode.addComponent(Button);
        
        const labelNode = new Node();
        labelNode.name = 'Label';
        labelNode.parent = buttonNode;
        const labelTransform = labelNode.addComponent(UITransform) as UITransform;
        (labelTransform as any).setContentSize(450, 100);
        const label = labelNode.addComponent(Label) as any;
        label.string = '开始游戏';
        label.fontSize = 48;
        label.fontWeight = (Label as any).FontWeight.BOLD;
        label.color = new Color(255, 255, 255, 255);
        label.horizontalAlign = (Label as any).HorizontalAlign.CENTER;
        label.verticalAlign = (Label as any).VerticalAlign.CENTER;
        
        const labelWidget = labelNode.addComponent(Widget) as any;
        labelWidget.isAlignLeft = true;
        labelWidget.isAlignRight = true;
        labelWidget.isAlignTop = true;
        labelWidget.isAlignBottom = true;
        
        return buttonNode;
    }
    
    /**
     * 创建商店按钮
     */
    private createShopButton(): Node {
        const buttonNode = new Node();
        buttonNode.name = 'ShopButton';
        const buttonTransform = buttonNode.addComponent(UITransform) as UITransform;
        (buttonTransform as any).setContentSize(450, 100);
        
        const bgNode = new Node();
        bgNode.name = 'Background';
        bgNode.parent = buttonNode;
        const bgTransform = bgNode.addComponent(UITransform) as UITransform;
        (bgTransform as any).setContentSize(450, 100);
        const bgSprite = bgNode.addComponent(Sprite) as any;
        bgSprite.color = new Color(255, 140, 0, 255);
        
        buttonNode.addComponent(Button);
        
        const labelNode = new Node();
        labelNode.name = 'Label';
        labelNode.parent = buttonNode;
        const labelTransform = labelNode.addComponent(UITransform) as UITransform;
        (labelTransform as any).setContentSize(450, 100);
        const label = labelNode.addComponent(Label) as any;
        label.string = '商店';
        label.fontSize = 48;
        label.fontWeight = (Label as any).FontWeight.BOLD;
        label.color = new Color(255, 255, 255, 255);
        label.horizontalAlign = (Label as any).HorizontalAlign.CENTER;
        label.verticalAlign = (Label as any).VerticalAlign.CENTER;
        
        const labelWidget = labelNode.addComponent(Widget) as any;
        labelWidget.isAlignLeft = true;
        labelWidget.isAlignRight = true;
        labelWidget.isAlignTop = true;
        labelWidget.isAlignBottom = true;
        
        return buttonNode;
    }
    
    /**
     * 创建设置按钮
     */
    private createSettingsButton(): Node {
        const buttonNode = new Node();
        buttonNode.name = 'SettingsButton';
        const buttonTransform = buttonNode.addComponent(UITransform) as UITransform;
        (buttonTransform as any).setContentSize(450, 100);
        
        const bgNode = new Node();
        bgNode.name = 'Background';
        bgNode.parent = buttonNode;
        const bgTransform = bgNode.addComponent(UITransform) as UITransform;
        (bgTransform as any).setContentSize(450, 100);
        const bgSprite = bgNode.addComponent(Sprite) as any;
        bgSprite.color = new Color(70, 130, 180, 255);
        
        buttonNode.addComponent(Button);
        
        const labelNode = new Node();
        labelNode.name = 'Label';
        labelNode.parent = buttonNode;
        const labelTransform = labelNode.addComponent(UITransform) as UITransform;
        (labelTransform as any).setContentSize(450, 100);
        const label = labelNode.addComponent(Label) as any;
        label.string = '设置';
        label.fontSize = 48;
        label.fontWeight = (Label as any).FontWeight.BOLD;
        label.color = new Color(255, 255, 255, 255);
        label.horizontalAlign = (Label as any).HorizontalAlign.CENTER;
        label.verticalAlign = (Label as any).VerticalAlign.CENTER;
        
        const labelWidget = labelNode.addComponent(Widget) as any;
        labelWidget.isAlignLeft = true;
        labelWidget.isAlignRight = true;
        labelWidget.isAlignTop = true;
        labelWidget.isAlignBottom = true;
        
        return buttonNode;
    }
    
    /**
     * 创建退出/登出按钮
     */
    private createLogoutButton(): Node {
        const buttonNode = new Node();
        buttonNode.name = 'LogoutButton';
        const buttonTransform = buttonNode.addComponent(UITransform) as UITransform;
        (buttonTransform as any).setContentSize(450, 100);
        
        const bgNode = new Node();
        bgNode.name = 'Background';
        bgNode.parent = buttonNode;
        const bgTransform = bgNode.addComponent(UITransform) as UITransform;
        (bgTransform as any).setContentSize(450, 100);
        const bgSprite = bgNode.addComponent(Sprite) as any;
        bgSprite.color = new Color(128, 128, 128, 255);
        
        buttonNode.addComponent(Button);
        
        const labelNode = new Node();
        labelNode.name = 'Label';
        labelNode.parent = buttonNode;
        const labelTransform = labelNode.addComponent(UITransform) as UITransform;
        (labelTransform as any).setContentSize(450, 100);
        const label = labelNode.addComponent(Label) as any;
        label.string = '登出';
        label.fontSize = 48;
        label.fontWeight = (Label as any).FontWeight.BOLD;
        label.color = new Color(255, 255, 255, 255);
        label.horizontalAlign = (Label as any).HorizontalAlign.CENTER;
        label.verticalAlign = (Label as any).VerticalAlign.CENTER;
        
        const labelWidget = labelNode.addComponent(Widget) as any;
        labelWidget.isAlignLeft = true;
        labelWidget.isAlignRight = true;
        labelWidget.isAlignTop = true;
        labelWidget.isAlignBottom = true;
        
        return buttonNode;
    }
    
    /**
     * 创建版权信息
     */
    private createCopyright(): Node {
        const labelNode = new Node();
        labelNode.name = 'Copyright';
        const labelTransform = labelNode.addComponent(UITransform) as UITransform;
        (labelTransform as any).setContentSize(600, 40);
        
        const label = labelNode.addComponent(Label) as any;
        label.string = '© 2024 My Game. All rights reserved.';
        label.fontSize = 24;
        label.color = new Color(150, 150, 150, 255);
        label.horizontalAlign = (Label as any).HorizontalAlign.CENTER;
        
        labelNode.setPosition(new Vec3(0, -this.designHeight / 2 + 50, 0));
        
        const labelWidget = labelNode.addComponent(Widget) as any;
        labelWidget.isAlignBottom = true;
        labelWidget.isAlignHorizontalCenter = true;
        labelWidget.bottom = 30;
        
        return labelNode;
    }
    
    /**
     * 绑定控制器引用
     */
    private bindControllerReferences(controller: MainMenuController, refs: {
        playButton: Node;
        settingsButton: Node;
        shopButton: Node;
        logoutButton: Node;
        playerNameLabel: Label | null;
        playerLevelLabel: Label | null;
    }): void {
        controller.playButton = refs.playButton;
        controller.settingsButton = refs.settingsButton;
        controller.shopButton = refs.shopButton;
        controller.logoutButton = refs.logoutButton;
        controller.playerNameLabel = refs.playerNameLabel;
        controller.playerLevelLabel = refs.playerLevelLabel;
    }
    
    /**
     * 播放入场动画
     */
    playEnterAnimation(rootNode: Node): void {
        // 标题缩放动画
        const title = rootNode.getChildByName('GameTitle');
        if (title) {
            title.scale = new Vec3(0, 0, 0);
            TweenUtils.popupUI(title);
        }
        
        // 玩家信息淡入
        const playerInfo = rootNode.getChildByName('PlayerInfo');
        if (playerInfo) {
            playerInfo.opacity = 0;
            TweenUtils.fadeIn(playerInfo, 0.5);
        }
        
        // 菜单按钮依次出现
        const menuContainer = rootNode.getChildByName('MenuContainer');
        if (menuContainer) {
            const buttons = menuContainer.children;
            buttons.forEach((button, index) => {
                button.scale = new Vec3(0, 0, 0);
                setTimeout(() => {
                    TweenUtils.pulse(button, 0.3, 1.0);
                }, index * 100);
            });
        }
    }
}
