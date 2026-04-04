/**
 * 玩家控制器
 * 玩家角色移动、动画、状态管理
 */
import { Node, Animation } from 'cc';
import { BaseController } from '../core/BaseController';
declare enum PlayerState {
    IDLE = "idle",
    RUN = "run",
    JUMP = "jump",
    FALL = "fall",
    ATTACK = "attack",
    HIT = "hit",
    DEAD = "dead"
}
export declare class PlayerController extends BaseController {
    moveSpeed: number;
    rotateSpeed: number;
    jumpForce: number;
    gravity: number;
    attackDamage: number;
    maxHealth: number;
    modelNode: Node | null;
    animation: Animation | null;
    private velocity;
    private isGrounded;
    private currentState;
    private currentHealth;
    private isInvincible;
    private invincibleTime;
    private readonly ANIM_IDLE;
    private readonly ANIM_RUN;
    private readonly ANIM_JUMP;
    private readonly ANIM_FALL;
    private readonly ANIM_ATTACK;
    private readonly ANIM_HIT;
    private readonly ANIM_DEAD;
    start(): void;
    update(deltaTime: number): void;
    /**
     * 注册事件
     */
    private registerEvents;
    /**
     * 处理移动
     */
    private handleMovement;
    /**
     * 处理重力
     */
    private handleGravity;
    /**
     * 面向方向
     */
    private rotateTowards;
    /**
     * 跳跃输入
     */
    private onJumpInput;
    /**
     * 攻击输入
     */
    private onAttackInput;
    /**
     * 跳跃
     */
    private jump;
    /**
     * 落地
     */
    private onLand;
    /**
     * 攻击
     */
    private attack;
    /**
     * 受到伤害
     */
    takeDamage(damage: number): void;
    /**
     * 死亡
     */
    private die;
    /**
     * 治疗
     */
    heal(amount: number): void;
    /**
     * 更新动画状态
     */
    private updateAnimationState;
    /**
     * 播放动画
     */
    private playAnimation;
    /**
     * 设置状态
     */
    private setState;
    /**
     * 获取当前生命值
     */
    getHealth(): number;
    /**
     * 获取最大生命值
     */
    getMaxHealth(): number;
    /**
     * 获取当前状态
     */
    getState(): PlayerState;
    /**
     * 检查是否存活
     */
    isAlive(): boolean;
    /**
     * 重置玩家
     */
    reset(): void;
    onDestroy(): void;
}
export {};
