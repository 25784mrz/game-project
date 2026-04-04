/**
 * 玩家控制器
 * 玩家角色移动、动画、状态管理
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { _decorator, Node, Vec3, Animation } from 'cc';
import { BaseController } from '../core/BaseController';
const { ccclass, property } = _decorator;
var PlayerState;
(function (PlayerState) {
    PlayerState["IDLE"] = "idle";
    PlayerState["RUN"] = "run";
    PlayerState["JUMP"] = "jump";
    PlayerState["FALL"] = "fall";
    PlayerState["ATTACK"] = "attack";
    PlayerState["HIT"] = "hit";
    PlayerState["DEAD"] = "dead";
})(PlayerState || (PlayerState = {}));
let PlayerController = (() => {
    let _classDecorators = [ccclass('PlayerController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseController;
    let _moveSpeed_decorators;
    let _moveSpeed_initializers = [];
    let _moveSpeed_extraInitializers = [];
    let _rotateSpeed_decorators;
    let _rotateSpeed_initializers = [];
    let _rotateSpeed_extraInitializers = [];
    let _jumpForce_decorators;
    let _jumpForce_initializers = [];
    let _jumpForce_extraInitializers = [];
    let _gravity_decorators;
    let _gravity_initializers = [];
    let _gravity_extraInitializers = [];
    let _attackDamage_decorators;
    let _attackDamage_initializers = [];
    let _attackDamage_extraInitializers = [];
    let _maxHealth_decorators;
    let _maxHealth_initializers = [];
    let _maxHealth_extraInitializers = [];
    let _modelNode_decorators;
    let _modelNode_initializers = [];
    let _modelNode_extraInitializers = [];
    let _animation_decorators;
    let _animation_initializers = [];
    let _animation_extraInitializers = [];
    var PlayerController = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.moveSpeed = __runInitializers(this, _moveSpeed_initializers, 5);
            this.rotateSpeed = (__runInitializers(this, _moveSpeed_extraInitializers), __runInitializers(this, _rotateSpeed_initializers, 10));
            this.jumpForce = (__runInitializers(this, _rotateSpeed_extraInitializers), __runInitializers(this, _jumpForce_initializers, 10));
            this.gravity = (__runInitializers(this, _jumpForce_extraInitializers), __runInitializers(this, _gravity_initializers, -20));
            this.attackDamage = (__runInitializers(this, _gravity_extraInitializers), __runInitializers(this, _attackDamage_initializers, 10));
            this.maxHealth = (__runInitializers(this, _attackDamage_extraInitializers), __runInitializers(this, _maxHealth_initializers, 100));
            this.modelNode = (__runInitializers(this, _maxHealth_extraInitializers), __runInitializers(this, _modelNode_initializers, null));
            this.animation = (__runInitializers(this, _modelNode_extraInitializers), __runInitializers(this, _animation_initializers, null));
            this.velocity = (__runInitializers(this, _animation_extraInitializers), new Vec3(0, 0, 0));
            this.isGrounded = true;
            this.currentState = PlayerState.IDLE;
            this.currentHealth = 100;
            this.isInvincible = false;
            this.invincibleTime = 0;
            // 动画状态
            this.ANIM_IDLE = 'idle';
            this.ANIM_RUN = 'run';
            this.ANIM_JUMP = 'jump';
            this.ANIM_FALL = 'fall';
            this.ANIM_ATTACK = 'attack';
            this.ANIM_HIT = 'hit';
            this.ANIM_DEAD = 'dead';
        }
        start() {
            this.currentHealth = this.maxHealth;
            this.registerEvents();
            this.playAnimation(this.ANIM_IDLE);
            this.log('[PlayerController] Started');
        }
        update(deltaTime) {
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
        registerEvents() {
            this.on('input:jump', this.onJumpInput, this);
            this.on('input:attack', this.onAttackInput, this);
        }
        /**
         * 处理移动
         */
        handleMovement(deltaTime) {
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
            }
            else {
                if (this.currentState === PlayerState.RUN) {
                    this.setState(PlayerState.IDLE);
                }
            }
        }
        /**
         * 处理重力
         */
        handleGravity(deltaTime) {
            if (!this.isGrounded) {
                // 应用重力
                this.velocity.y += this.gravity * deltaTime;
                this.node.position = this.node.position.add(new Vec3(0, this.velocity.y * deltaTime, 0));
                // 检测落地
                if (this.node.position.y <= 0) {
                    this.node.position = new Vec3(this.node.position.x, 0, this.node.position.z);
                    this.velocity.y = 0;
                    this.onLand();
                }
                else if (this.velocity.y < 0) {
                    this.setState(PlayerState.FALL);
                }
            }
        }
        /**
         * 面向方向
         */
        rotateTowards(direction) {
            if (direction.x === 0 && direction.z === 0)
                return;
            const targetAngle = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
            const currentRotation = this.node.eulerAngles;
            // 平滑旋转
            let angleDiff = targetAngle - currentRotation.y;
            while (angleDiff > 180)
                angleDiff -= 360;
            while (angleDiff < -180)
                angleDiff += 360;
            const rotateDelta = angleDiff * this.rotateSpeed * 0.016;
            this.node.setRotationFromEuler(new Vec3(currentRotation.x, currentRotation.y + rotateDelta, currentRotation.z));
        }
        /**
         * 跳跃输入
         */
        onJumpInput(isPressed) {
            if (isPressed && this.isGrounded) {
                this.jump();
            }
        }
        /**
         * 攻击输入
         */
        onAttackInput(isPressed) {
            if (isPressed && this.currentState !== PlayerState.ATTACK &&
                this.currentState !== PlayerState.HIT && this.currentState !== PlayerState.DEAD) {
                this.attack();
            }
        }
        /**
         * 跳跃
         */
        jump() {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            this.setState(PlayerState.JUMP);
            this.playSFX(null);
            this.emit('player:jump');
            this.log('[PlayerController] Jump!');
        }
        /**
         * 落地
         */
        onLand() {
            this.isGrounded = true;
            this.velocity.y = 0;
            if (this.currentState === PlayerState.FALL) {
                this.setState(PlayerState.IDLE);
            }
            this.playSFX(null);
            this.emit('player:land');
        }
        /**
         * 攻击
         */
        attack() {
            this.setState(PlayerState.ATTACK);
            this.playAnimation(this.ANIM_ATTACK);
            this.playSFX(null);
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
        takeDamage(damage) {
            if (this.isInvincible || this.currentState === PlayerState.DEAD)
                return;
            this.currentHealth -= damage;
            this.setState(PlayerState.HIT);
            this.playAnimation(this.ANIM_HIT);
            this.playSFX(null);
            this.emit('player:hit', { damage, health: this.currentHealth });
            this.log(`[PlayerController] Take damage: ${damage}, HP: ${this.currentHealth}`);
            if (this.currentHealth <= 0) {
                this.die();
            }
            else {
                // 设置无敌时间
                this.isInvincible = true;
                this.invincibleTime = 1.0;
            }
        }
        /**
         * 死亡
         */
        die() {
            this.setState(PlayerState.DEAD);
            this.playAnimation(this.ANIM_DEAD);
            this.playSFX(null);
            this.emit('player:dead');
            this.log('[PlayerController] Player died');
        }
        /**
         * 治疗
         */
        heal(amount) {
            this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);
            this.emit('player:heal', { amount, health: this.currentHealth });
            this.log(`[PlayerController] Healed: ${amount}, HP: ${this.currentHealth}`);
        }
        /**
         * 更新动画状态
         */
        updateAnimationState() {
            if (this.currentState === PlayerState.ATTACK ||
                this.currentState === PlayerState.HIT ||
                this.currentState === PlayerState.DEAD) {
                return; // 这些状态由动画自己控制
            }
            if (!this.isGrounded) {
                if (this.velocity.y > 0) {
                    this.playAnimation(this.ANIM_JUMP);
                }
                else {
                    this.playAnimation(this.ANIM_FALL);
                }
            }
            else if (this.getInputState()?.isMoving) {
                this.playAnimation(this.ANIM_RUN);
            }
            else {
                this.playAnimation(this.ANIM_IDLE);
            }
        }
        /**
         * 播放动画
         */
        playAnimation(animName) {
            if (!this.animation)
                return;
            const state = this.animation.getState(animName);
            if (state && !state.isPlaying) {
                state.play();
            }
        }
        /**
         * 设置状态
         */
        setState(state) {
            if (this.currentState === state)
                return;
            const oldState = this.currentState;
            this.currentState = state;
            this.log(`[PlayerController] State: ${oldState} -> ${state}`);
            this.emit('player:state-change', { old: oldState, new: state });
        }
        /**
         * 获取当前生命值
         */
        getHealth() {
            return this.currentHealth;
        }
        /**
         * 获取最大生命值
         */
        getMaxHealth() {
            return this.maxHealth;
        }
        /**
         * 获取当前状态
         */
        getState() {
            return this.currentState;
        }
        /**
         * 检查是否存活
         */
        isAlive() {
            return this.currentState !== PlayerState.DEAD;
        }
        /**
         * 重置玩家
         */
        reset() {
            this.currentHealth = this.maxHealth;
            this.isGrounded = true;
            this.velocity.set(0, 0, 0);
            this.setState(PlayerState.IDLE);
            this.node.position = new Vec3(0, 0, 0);
            this.playAnimation(this.ANIM_IDLE);
        }
        onDestroy() {
            this.off('input:jump', this.onJumpInput, this);
            this.off('input:attack', this.onAttackInput, this);
        }
    };
    __setFunctionName(_classThis, "PlayerController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _moveSpeed_decorators = [property];
        _rotateSpeed_decorators = [property];
        _jumpForce_decorators = [property];
        _gravity_decorators = [property];
        _attackDamage_decorators = [property];
        _maxHealth_decorators = [property];
        _modelNode_decorators = [property(Node)];
        _animation_decorators = [property(Animation)];
        __esDecorate(null, null, _moveSpeed_decorators, { kind: "field", name: "moveSpeed", static: false, private: false, access: { has: obj => "moveSpeed" in obj, get: obj => obj.moveSpeed, set: (obj, value) => { obj.moveSpeed = value; } }, metadata: _metadata }, _moveSpeed_initializers, _moveSpeed_extraInitializers);
        __esDecorate(null, null, _rotateSpeed_decorators, { kind: "field", name: "rotateSpeed", static: false, private: false, access: { has: obj => "rotateSpeed" in obj, get: obj => obj.rotateSpeed, set: (obj, value) => { obj.rotateSpeed = value; } }, metadata: _metadata }, _rotateSpeed_initializers, _rotateSpeed_extraInitializers);
        __esDecorate(null, null, _jumpForce_decorators, { kind: "field", name: "jumpForce", static: false, private: false, access: { has: obj => "jumpForce" in obj, get: obj => obj.jumpForce, set: (obj, value) => { obj.jumpForce = value; } }, metadata: _metadata }, _jumpForce_initializers, _jumpForce_extraInitializers);
        __esDecorate(null, null, _gravity_decorators, { kind: "field", name: "gravity", static: false, private: false, access: { has: obj => "gravity" in obj, get: obj => obj.gravity, set: (obj, value) => { obj.gravity = value; } }, metadata: _metadata }, _gravity_initializers, _gravity_extraInitializers);
        __esDecorate(null, null, _attackDamage_decorators, { kind: "field", name: "attackDamage", static: false, private: false, access: { has: obj => "attackDamage" in obj, get: obj => obj.attackDamage, set: (obj, value) => { obj.attackDamage = value; } }, metadata: _metadata }, _attackDamage_initializers, _attackDamage_extraInitializers);
        __esDecorate(null, null, _maxHealth_decorators, { kind: "field", name: "maxHealth", static: false, private: false, access: { has: obj => "maxHealth" in obj, get: obj => obj.maxHealth, set: (obj, value) => { obj.maxHealth = value; } }, metadata: _metadata }, _maxHealth_initializers, _maxHealth_extraInitializers);
        __esDecorate(null, null, _modelNode_decorators, { kind: "field", name: "modelNode", static: false, private: false, access: { has: obj => "modelNode" in obj, get: obj => obj.modelNode, set: (obj, value) => { obj.modelNode = value; } }, metadata: _metadata }, _modelNode_initializers, _modelNode_extraInitializers);
        __esDecorate(null, null, _animation_decorators, { kind: "field", name: "animation", static: false, private: false, access: { has: obj => "animation" in obj, get: obj => obj.animation, set: (obj, value) => { obj.animation = value; } }, metadata: _metadata }, _animation_initializers, _animation_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlayerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlayerController = _classThis;
})();
export { PlayerController };
