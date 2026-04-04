/**
 * 玩家控制器
 * 玩家角色移动、动画、状态管理
 */

import { _decorator, Component, Node, Vec3, Animation } from 'cc';
import { BaseController } from '../core/BaseController';

const { ccclass, property } = _decorator;

enum PlayerState {
    IDLE = 'idle',
    RUN = 'run',
    JUMP = 'jump',
    FALL = 'fall',
    ATTACK = 'attack',
    HIT = 'hit',
    DEAD = 'dead'
}

@ccclass('PlayerController')
export class PlayerController extends BaseController {
    @property
    moveSpeed: number = 5;
    
    @property
    rotateSpeed: number = 10;
    
    @property
    jumpForce: number = 10;
    
    @property
    gravity: number = -20;
    
    @property
    attackDamage: number = 10;
    
    @property
    maxHealth: number = 100;
    
    @property(Node)
    modelNode: Node | null = null;
    
    @property(Animation)
    animation: Animation | null = null;
    
    private velocity: Vec3 = new Vec3(0, 0, 0);
    private isGrounded: boolean = true;
    private currentState: PlayerState = PlayerState.IDLE;
    private currentHealth: number = 100;
    private isInvincible: boolean = false;
    private invincibleTime: number = 0;
    
    // 动画状态
    private readonly ANIM_IDLE = 'idle';
    private readonly ANIM_RUN = 'run';
    private readonly ANIM_JUMP = 'jump';
    private readonly ANIM_FALL = 'fall';
    private readonly ANIM_ATTACK = 'attack';
    private readonly ANIM_HIT = 'hit';
    private readonly ANIM_DEAD = 'dead';
    
    start() {
        this.currentHealth = this.maxHealth;
        this.registerEvents();
        this.playAnimation(this.ANIM_IDLE);
        
        this.log('[PlayerController] Started');
    }
    
    update(deltaTime: number) {
        // 处理无敌时间
        if (this.isInvincible) {
            this.invincibleTime -= deltaTime;
            if (this.invincibleTime <= 0) {
                this.isInvincible = false;
            }
        }
        
        // 处理移动
        this.handleMovement(deltaTime);
        
        // 处理重力
        this.handleGravity(deltaTime);
        
        // 更新动画状态
        this.updateAnimationState();
    }
    
    /**
     * 注册事件
     */
    private registerEvents(): void {
        this.on('input:jump', this.onJumpInput, this);
        this.on('input:attack', this.onAttackInput, this);
    }
    
    /**
     * 处理移动
     */
    private handleMovement(deltaTime: number): void {
        const direction = this.getMoveDirection() || new Vec3(0, 0, 0);
        
        if (direction.length() > 0.1) {
            // 移动
            const moveDelta = direction.multiplyScalar(this.moveSpeed * deltaTime);
            this.node.position = this.node.position.add(moveDelta);
            
            // 面向移动方向
            this.rotateTowards(direction);
            
            // 更新状态
            if (this.currentState !== PlayerState.JUMP && 
                this.currentState !== PlayerState.FALL &&
                this.currentState !== PlayerState.ATTACK) {
                this.setState(PlayerState.RUN);
            }
        } else {
            if (this.currentState === PlayerState.RUN) {
                this.setState(PlayerState.IDLE);
            }
        }
    }
    
    /**
     * 处理重力
     */
    private handleGravity(deltaTime: number): void {
        if (!this.isGrounded) {
            // 应用重力
            this.velocity.y += this.gravity * deltaTime;
            this.node.position = this.node.position.add(new Vec3(0, this.velocity.y * deltaTime, 0));
            
            // 检测落地
            if (this.node.position.y <= 0) {
                this.node.position = new Vec3(
                    this.node.position.x,
                    0,
                    this.node.position.z
                );
                this.velocity.y = 0;
                this.onLand();
            } else if (this.velocity.y < 0) {
                this.setState(PlayerState.FALL);
            }
        }
    }
    
    /**
     * 面向方向
     */
    private rotateTowards(direction: Vec3): void {
        if (direction.x === 0 && direction.z === 0) return;
        
        const targetAngle = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
        const currentRotation = this.node.eulerAngles;
        
        // 平滑旋转
        let angleDiff = targetAngle - currentRotation.y;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        const rotateDelta = angleDiff * this.rotateSpeed * 0.016;
        this.node.setRotationFromEuler(new Vec3(
            currentRotation.x,
            currentRotation.y + rotateDelta,
            currentRotation.z
        ));
    }
    
    /**
     * 跳跃输入
     */
    private onJumpInput(isPressed: boolean): void {
        if (isPressed && this.isGrounded) {
            this.jump();
        }
    }
    
    /**
     * 攻击输入
     */
    private onAttackInput(isPressed: boolean): void {
        if (isPressed && this.currentState !== PlayerState.ATTACK &&
            this.currentState !== PlayerState.HIT && this.currentState !== PlayerState.DEAD) {
            this.attack();
        }
    }
    
    /**
     * 跳跃
     */
    private jump(): void {
        this.velocity.y = this.jumpForce;
        this.isGrounded = false;
        this.setState(PlayerState.JUMP);
        
        this.playSFX(null!);
        this.emit('player:jump');
        
        this.log('[PlayerController] Jump!');
    }
    
    /**
     * 落地
     */
    private onLand(): void {
        this.isGrounded = true;
        this.velocity.y = 0;
        
        if (this.currentState === PlayerState.FALL) {
            this.setState(PlayerState.IDLE);
        }
        
        this.playSFX(null!);
        this.emit('player:land');
    }
    
    /**
     * 攻击
     */
    private attack(): void {
        this.setState(PlayerState.ATTACK);
        this.playAnimation(this.ANIM_ATTACK);
        
        this.playSFX(null!);
        
        // 攻击检测（简单示例）
        setTimeout(() => {
            this.emit('player:attack', {
                position: this.node.position,
                damage: this.attackDamage
            });
        }, 200);
        
        this.log('[PlayerController] Attack!');
    }
    
    /**
     * 受到伤害
     */
    takeDamage(damage: number): void {
        if (this.isInvincible || this.currentState === PlayerState.DEAD) return;
        
        this.currentHealth -= damage;
        this.setState(PlayerState.HIT);
        this.playAnimation(this.ANIM_HIT);
        
        this.playSFX(null!);
        this.emit('player:hit', { damage, health: this.currentHealth });
        
        this.log(`[PlayerController] Take damage: ${damage}, HP: ${this.currentHealth}`);
        
        if (this.currentHealth <= 0) {
            this.die();
        } else {
            // 设置无敌时间
            this.isInvincible = true;
            this.invincibleTime = 1.0;
        }
    }
    
    /**
     * 死亡
     */
    private die(): void {
        this.setState(PlayerState.DEAD);
        this.playAnimation(this.ANIM_DEAD);
        
        this.playSFX(null!);
        this.emit('player:dead');
        
        this.log('[PlayerController] Player died');
    }
    
    /**
     * 治疗
     */
    heal(amount: number): void {
        this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);
        this.emit('player:heal', { amount, health: this.currentHealth });
        
        this.log(`[PlayerController] Healed: ${amount}, HP: ${this.currentHealth}`);
    }
    
    /**
     * 更新动画状态
     */
    private updateAnimationState(): void {
        if (this.currentState === PlayerState.ATTACK ||
            this.currentState === PlayerState.HIT ||
            this.currentState === PlayerState.DEAD) {
            return; // 这些状态由动画自己控制
        }
        
        if (!this.isGrounded) {
            if (this.velocity.y > 0) {
                this.playAnimation(this.ANIM_JUMP);
            } else {
                this.playAnimation(this.ANIM_FALL);
            }
        } else if (this.getInputState()?.isMoving) {
            this.playAnimation(this.ANIM_RUN);
        } else {
            this.playAnimation(this.ANIM_IDLE);
        }
    }
    
    /**
     * 播放动画
     */
    private playAnimation(animName: string): void {
        if (!this.animation) return;
        
        const state = this.animation.getState(animName);
        if (state && !state.isPlaying) {
            state.play();
        }
    }
    
    /**
     * 设置状态
     */
    private setState(state: PlayerState): void {
        if (this.currentState === state) return;
        
        const oldState = this.currentState;
        this.currentState = state;
        
        this.log(`[PlayerController] State: ${oldState} -> ${state}`);
        this.emit('player:state-change', { old: oldState, new: state });
    }
    
    /**
     * 获取当前生命值
     */
    getHealth(): number {
        return this.currentHealth;
    }
    
    /**
     * 获取最大生命值
     */
    getMaxHealth(): number {
        return this.maxHealth;
    }
    
    /**
     * 获取当前状态
     */
    getState(): PlayerState {
        return this.currentState;
    }
    
    /**
     * 检查是否存活
     */
    isAlive(): boolean {
        return this.currentState !== PlayerState.DEAD;
    }
    
    /**
     * 重置玩家
     */
    reset(): void {
        this.currentHealth = this.maxHealth;
        this.isGrounded = true;
        this.velocity.set(0, 0, 0);
        this.setState(PlayerState.IDLE);
        this.node.position = new Vec3(0, 0, 0);
        this.playAnimation(this.ANIM_IDLE);
    }
    
    onDestroy(): void {
        this.off('input:jump', this.onJumpInput, this);
        this.off('input:attack', this.onAttackInput, this);
    }
}
