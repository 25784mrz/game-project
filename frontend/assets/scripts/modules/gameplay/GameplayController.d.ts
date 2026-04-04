/**
 * 游戏玩法模块 - 游戏场景主控制器
 */
import { Node } from 'cc';
import { BaseController } from '../../core/BaseController';
export declare class GameplayController extends BaseController {
    playerNode: Node | null;
    playerSpeed: number;
    playerJumpForce: number;
    private isGrounded;
    private velocity;
    private inputDirection;
    start(): void;
    update(deltaTime: number): void;
    /**
     * 注册输入
     */
    private registerInput;
    /**
     * 按键按下
     */
    private onKeyDown;
    /**
     * 按键释放
     */
    private onKeyUp;
    /**
     * 处理移动
     */
    private handleMovement;
    /**
     * 跳跃
     */
    private jump;
    /**
     * 暂停游戏
     */
    private pauseGame;
    /**
     * 恢复游戏
     */
    resumeGame(): void;
    /**
     * 游戏结束
     */
    gameOver(): void;
    onDestroy(): void;
}
