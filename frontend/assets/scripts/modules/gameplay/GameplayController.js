/**
 * 游戏玩法模块 - 游戏场景主控制器
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
import { _decorator, Node, Vec3, input, Input, KeyCode } from 'cc';
import { BaseController } from '../../core/BaseController';
import { GameState } from '../../core/GameManager';
const { ccclass, property } = _decorator;
let GameplayController = (() => {
    let _classDecorators = [ccclass('GameplayController')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseController;
    let _playerNode_decorators;
    let _playerNode_initializers = [];
    let _playerNode_extraInitializers = [];
    let _playerSpeed_decorators;
    let _playerSpeed_initializers = [];
    let _playerSpeed_extraInitializers = [];
    let _playerJumpForce_decorators;
    let _playerJumpForce_initializers = [];
    let _playerJumpForce_extraInitializers = [];
    var GameplayController = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.playerNode = __runInitializers(this, _playerNode_initializers, null);
            this.playerSpeed = (__runInitializers(this, _playerNode_extraInitializers), __runInitializers(this, _playerSpeed_initializers, 5));
            this.playerJumpForce = (__runInitializers(this, _playerSpeed_extraInitializers), __runInitializers(this, _playerJumpForce_initializers, 10));
            this.isGrounded = (__runInitializers(this, _playerJumpForce_extraInitializers), true);
            this.velocity = new Vec3(0, 0, 0);
            this.inputDirection = new Vec3(0, 0, 0);
        }
        start() {
            this.log('[Gameplay] Started');
            this.registerInput();
            this.changeGameState(GameState.GAME);
        }
        update(deltaTime) {
            this.handleMovement(deltaTime);
        }
        /**
         * 注册输入
         */
        registerInput() {
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        }
        /**
         * 按键按下
         */
        onKeyDown(event) {
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
        onKeyUp(event) {
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
        handleMovement(deltaTime) {
            if (!this.playerNode)
                return;
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
        jump() {
            if (this.isGrounded && this.playerNode) {
                this.velocity.y = this.playerJumpForce;
                this.isGrounded = false;
                this.audioController?.playSFX(null); // TODO: 添加跳跃音效
                console.log('[Gameplay] Jump!');
            }
        }
        /**
         * 暂停游戏
         */
        pauseGame() {
            console.log('[Gameplay] Game paused');
            this.gameManager?.pauseGame();
        }
        /**
         * 恢复游戏
         */
        resumeGame() {
            console.log('[Gameplay] Game resumed');
            this.gameManager?.resumeGame();
        }
        /**
         * 游戏结束
         */
        gameOver() {
            console.log('[Gameplay] Game over');
            this.gameManager?.changeState(GameState.GAME_OVER);
        }
        onDestroy() {
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        }
    };
    __setFunctionName(_classThis, "GameplayController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _playerNode_decorators = [property(Node)];
        _playerSpeed_decorators = [property];
        _playerJumpForce_decorators = [property];
        __esDecorate(null, null, _playerNode_decorators, { kind: "field", name: "playerNode", static: false, private: false, access: { has: obj => "playerNode" in obj, get: obj => obj.playerNode, set: (obj, value) => { obj.playerNode = value; } }, metadata: _metadata }, _playerNode_initializers, _playerNode_extraInitializers);
        __esDecorate(null, null, _playerSpeed_decorators, { kind: "field", name: "playerSpeed", static: false, private: false, access: { has: obj => "playerSpeed" in obj, get: obj => obj.playerSpeed, set: (obj, value) => { obj.playerSpeed = value; } }, metadata: _metadata }, _playerSpeed_initializers, _playerSpeed_extraInitializers);
        __esDecorate(null, null, _playerJumpForce_decorators, { kind: "field", name: "playerJumpForce", static: false, private: false, access: { has: obj => "playerJumpForce" in obj, get: obj => obj.playerJumpForce, set: (obj, value) => { obj.playerJumpForce = value; } }, metadata: _metadata }, _playerJumpForce_initializers, _playerJumpForce_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GameplayController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameplayController = _classThis;
})();
export { GameplayController };
