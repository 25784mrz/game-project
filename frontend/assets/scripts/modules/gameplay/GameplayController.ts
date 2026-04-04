/**
 * 游戏玩法模块 - 游戏场景主控制器
 */

import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode } from 'cc';
import { BaseController } from '../../core/BaseController';
import { GameState } from '../../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('GameplayController')
export class GameplayController extends BaseController {
    @property(Node)
    playerNode: Node | null = null;
    
    @property
    playerSpeed: number = 5;
    
    @property
    playerJumpForce: number = 10;
    
    private isGrounded: boolean = true;
    private velocity: Vec3 = new Vec3(0, 0, 0);
    private inputDirection: Vec3 = new Vec3(0, 0, 0);
    
    start() {
        this.log('[Gameplay] Started');
        
        this.registerInput();
        this.changeGameState(GameState.GAME);
    }
    
    update(deltaTime: number) {
        this.handleMovement(deltaTime);
    }
    
    /**
     * 注册输入
     */
    private registerInput(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    
    /**
     * 按键按下
     */
    private onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.inputDirection.z = -1;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.inputDirection.z = 1;
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.inputDirection.x = -1;
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.inputDirection.x = 1;
                break;
            case KeyCode.SPACE:
                this.jump();
                break;
            case KeyCode.ESCAPE:
                this.pauseGame();
                break;
        }
    }
    
    /**
     * 按键释放
     */
    private onKeyUp(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                if (Math.abs(this.inputDirection.z) === 1) {
                    this.inputDirection.z = 0;
                }
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                if (Math.abs(this.inputDirection.x) === 1) {
                    this.inputDirection.x = 0;
                }
                break;
        }
    }
    
    /**
     * 处理移动
     */
    private handleMovement(deltaTime: number): void {
        if (!this.playerNode) return;
        
        // 计算移动方向
        const moveDirection = new Vec3(this.inputDirection.x, 0, this.inputDirection.z);
        
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            
            // 移动玩家
            const moveDelta = moveDirection.multiplyScalar(this.playerSpeed * deltaTime);
            this.playerNode.position = this.playerNode.position.add(moveDelta);
            
            // 面向移动方向
            if (moveDirection.length() > 0.1) {
                const targetRotation = Math.atan2(moveDirection.x, moveDirection.z) * 180 / Math.PI;
                this.playerNode.setRotationFromEuler(new Vec3(0, targetRotation, 0));
            }
        }
        
        // 重力
        if (!this.isGrounded) {
            this.velocity.y -= 20 * deltaTime;
            this.playerNode.position = this.playerNode.position.add(new Vec3(0, this.velocity.y * deltaTime, 0));
            
            // 简单地面检测
            if (this.playerNode.position.y <= 0) {
                this.playerNode.position = new Vec3(this.playerNode.position.x, 0, this.playerNode.position.z);
                this.velocity.y = 0;
                this.isGrounded = true;
            }
        }
    }
    
    /**
     * 跳跃
     */
    private jump(): void {
        if (this.isGrounded && this.playerNode) {
            this.velocity.y = this.playerJumpForce;
            this.isGrounded = false;
            this.audioController?.playSFX(null!); // TODO: 添加跳跃音效
            console.log('[Gameplay] Jump!');
        }
    }
    
    /**
     * 暂停游戏
     */
    private pauseGame(): void {
        console.log('[Gameplay] Game paused');
        this.gameManager?.pauseGame();
    }
    
    /**
     * 恢复游戏
     */
    resumeGame(): void {
        console.log('[Gameplay] Game resumed');
        this.gameManager?.resumeGame();
    }
    
    /**
     * 游戏结束
     */
    gameOver(): void {
        console.log('[Gameplay] Game over');
        this.gameManager?.changeState(GameState.GAME_OVER);
    }
    
    onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
