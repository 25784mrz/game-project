/**
 * 输入管理器
 * 统一处理键盘、触摸、鼠标输入
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
import { _decorator, Component, Node, input, Input, KeyCode, Vec2, Vec3, game } from 'cc';
import { EventSystem } from '../core/EventSystem';
const { ccclass, property } = _decorator;
let InputManager = (() => {
    let _classDecorators = [ccclass('InputManager')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    let _keyRepeatDelay_decorators;
    let _keyRepeatDelay_initializers = [];
    let _keyRepeatDelay_extraInitializers = [];
    let _touchSensitivity_decorators;
    let _touchSensitivity_initializers = [];
    let _touchSensitivity_extraInitializers = [];
    let _mouseSensitivity_decorators;
    let _mouseSensitivity_initializers = [];
    let _mouseSensitivity_extraInitializers = [];
    var InputManager = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.keyRepeatDelay = __runInitializers(this, _keyRepeatDelay_initializers, 0.1);
            this.touchSensitivity = (__runInitializers(this, _keyRepeatDelay_extraInitializers), __runInitializers(this, _touchSensitivity_initializers, 1.0));
            this.mouseSensitivity = (__runInitializers(this, _touchSensitivity_extraInitializers), __runInitializers(this, _mouseSensitivity_initializers, 0.5));
            this.inputState = (__runInitializers(this, _mouseSensitivity_extraInitializers), {
                up: false,
                down: false,
                left: false,
                right: false,
                jump: false,
                attack: false,
                pause: false
            });
            this.touchPos = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                delta: new Vec2(0, 0)
            };
            this.mousePos = new Vec2(0, 0);
            this.eventSystem = null;
            this.keyRepeatTimers = new Map();
        }
        static getInstance() {
            if (!InputManager.instance) {
                const node = new Node('InputManager');
                InputManager.instance = node.addComponent(InputManager);
                game.addPersistRootNode(node);
            }
            return InputManager.instance;
        }
        onLoad() {
            if (InputManager.instance && InputManager.instance !== this) {
                this.node.destroy();
                return;
            }
            InputManager.instance = this;
            this.eventSystem = EventSystem.getInstance();
            console.log('[InputManager] Initialized');
        }
        start() {
            this.registerInput();
        }
        /**
         * 注册输入事件
         */
        registerInput() {
            // 键盘事件
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
            // 触摸事件
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
            // 鼠标事件
            input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
            input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
            input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        }
        /**
         * 键盘按下
         */
        onKeyDown(event) {
            const keyCode = event.keyCode;
            switch (keyCode) {
                case KeyCode.KEY_W:
                case KeyCode.ARROW_UP:
                    this.inputState.up = true;
                    this.startKeyRepeat('up');
                    break;
                case KeyCode.KEY_S:
                case KeyCode.ARROW_DOWN:
                    this.inputState.down = true;
                    this.startKeyRepeat('down');
                    break;
                case KeyCode.KEY_A:
                case KeyCode.ARROW_LEFT:
                    this.inputState.left = true;
                    this.startKeyRepeat('left');
                    break;
                case KeyCode.KEY_D:
                case KeyCode.ARROW_RIGHT:
                    this.inputState.right = true;
                    this.startKeyRepeat('right');
                    break;
                case KeyCode.SPACE:
                    this.inputState.jump = true;
                    this.eventSystem?.emit('input:jump', true);
                    break;
                case KeyCode.KEY_J:
                case KeyCode.KEY_K:
                    this.inputState.attack = true;
                    this.eventSystem?.emit('input:attack', true);
                    break;
                case KeyCode.ESCAPE:
                case KeyCode.KEY_P:
                    if (!this.inputState.pause) {
                        this.inputState.pause = true;
                        this.eventSystem?.emit('input:pause');
                    }
                    break;
            }
            this.emitDirectionEvent();
        }
        /**
         * 键盘释放
         */
        onKeyUp(event) {
            const keyCode = event.keyCode;
            switch (keyCode) {
                case KeyCode.KEY_W:
                case KeyCode.ARROW_UP:
                    this.inputState.up = false;
                    this.stopKeyRepeat('up');
                    break;
                case KeyCode.KEY_S:
                case KeyCode.ARROW_DOWN:
                    this.inputState.down = false;
                    this.stopKeyRepeat('down');
                    break;
                case KeyCode.KEY_A:
                case KeyCode.ARROW_LEFT:
                    this.inputState.left = false;
                    this.stopKeyRepeat('left');
                    break;
                case KeyCode.KEY_D:
                case KeyCode.ARROW_RIGHT:
                    this.inputState.right = false;
                    this.stopKeyRepeat('right');
                    break;
                case KeyCode.SPACE:
                    this.inputState.jump = false;
                    this.eventSystem?.emit('input:jump', false);
                    break;
                case KeyCode.KEY_J:
                case KeyCode.KEY_K:
                    this.inputState.attack = false;
                    this.eventSystem?.emit('input:attack', false);
                    break;
                case KeyCode.ESCAPE:
                case KeyCode.KEY_P:
                    this.inputState.pause = false;
                    break;
            }
            this.emitDirectionEvent();
        }
        /**
         * 触摸开始
         */
        onTouchStart(event) {
            const touch = event.getAllTouches()[0];
            const location = touch.getLocation();
            this.touchPos.startX = location.x;
            this.touchPos.startY = location.y;
            this.touchPos.currentX = location.x;
            this.touchPos.currentY = location.y;
            this.touchPos.delta.set(0, 0);
            this.eventSystem?.emit('input:touch-start', {
                x: location.x,
                y: location.y
            });
        }
        /**
         * 触摸移动
         */
        onTouchMove(event) {
            const touch = event.getAllTouches()[0];
            const location = touch.getLocation();
            this.touchPos.currentX = location.x;
            this.touchPos.currentY = location.y;
            this.touchPos.delta.set((location.x - this.touchPos.startX) * this.touchSensitivity, (location.y - this.touchPos.startY) * this.touchSensitivity);
            this.eventSystem?.emit('input:touch-move', {
                x: location.x,
                y: location.y,
                deltaX: this.touchPos.delta.x,
                deltaY: this.touchPos.delta.y
            });
        }
        /**
         * 触摸结束
         */
        onTouchEnd(event) {
            const touch = event.getAllTouches()[0];
            const location = touch.getLocation();
            // 检测滑动
            const swipeDelta = new Vec2(location.x - this.touchPos.startX, location.y - this.touchPos.startY);
            if (swipeDelta.length() > 50) {
                // 识别滑动方向
                if (Math.abs(swipeDelta.x) > Math.abs(swipeDelta.y)) {
                    this.eventSystem?.emit('input:swipe', swipeDelta.x > 0 ? 'right' : 'left');
                }
                else {
                    this.eventSystem?.emit('input:swipe', swipeDelta.y > 0 ? 'down' : 'up');
                }
            }
            this.eventSystem?.emit('input:touch-end', {
                x: location.x,
                y: location.y
            });
            this.touchPos.delta.set(0, 0);
        }
        /**
         * 鼠标按下
         */
        onMouseDown(event) {
            const button = event.getButton();
            const location = event.getLocation();
            this.eventSystem?.emit('input:mouse-down', {
                button,
                x: location.x,
                y: location.y
            });
            // 鼠标左键作为攻击
            if (button === 0) {
                this.inputState.attack = true;
                this.eventSystem?.emit('input:attack', true);
            }
        }
        /**
         * 鼠标释放
         */
        onMouseUp(event) {
            const button = event.getButton();
            const location = event.getLocation();
            this.eventSystem?.emit('input:mouse-up', {
                button,
                x: location.x,
                y: location.y
            });
            if (button === 0) {
                this.inputState.attack = false;
                this.eventSystem?.emit('input:attack', false);
            }
        }
        /**
         * 鼠标移动
         */
        onMouseMove(event) {
            const location = event.getLocation();
            this.mousePos.set(location.x, location.y);
            this.eventSystem?.emit('input:mouse-move', {
                x: location.x,
                y: location.y
            });
        }
        /**
         * 鼠标滚轮
         */
        onMouseWheel(event) {
            const scrollY = event.getScrollY();
            this.eventSystem?.emit('input:mouse-wheel', {
                deltaY: scrollY
            });
        }
        /**
         * 获取移动方向
         */
        getMoveDirection() {
            const dir = new Vec3(0, 0, 0);
            if (this.inputState.up)
                dir.z -= 1;
            if (this.inputState.down)
                dir.z += 1;
            if (this.inputState.left)
                dir.x -= 1;
            if (this.inputState.right)
                dir.x += 1;
            // 触摸输入
            if (this.touchPos.delta.length() > 0) {
                dir.x += this.touchPos.delta.x / 100;
                dir.z -= this.touchPos.delta.y / 100;
            }
            if (dir.length() > 1) {
                dir.normalize();
            }
            return dir;
        }
        /**
         * 检查是否正在移动
         */
        isMoving() {
            return this.inputState.up || this.inputState.down ||
                this.inputState.left || this.inputState.right ||
                this.touchPos.delta.length() > 0.1;
        }
        /**
         * 获取输入状态
         */
        getInputState() {
            return { ...this.inputState };
        }
        /**
         * 获取触摸位置
         */
        getTouchPosition() {
            return {
                x: this.touchPos.currentX,
                y: this.touchPos.currentY,
                deltaX: this.touchPos.delta.x,
                deltaY: this.touchPos.delta.y
            };
        }
        /**
         * 获取鼠标位置
         */
        getMousePosition() {
            return new Vec2(this.mousePos.x, this.mousePos.y);
        }
        /**
         * 开始按键重复
         */
        startKeyRepeat(key) {
            this.stopKeyRepeat(key);
            const timer = setTimeout(() => {
                this.eventSystem?.emit(`input:key-repeat:${key}`);
            }, this.keyRepeatDelay * 1000);
            this.keyRepeatTimers.set(key, timer);
        }
        /**
         * 停止按键重复
         */
        stopKeyRepeat(key) {
            const timer = this.keyRepeatTimers.get(key);
            if (timer) {
                clearTimeout(timer);
                this.keyRepeatTimers.delete(key);
            }
        }
        /**
         * 发射方向事件
         */
        emitDirectionEvent() {
            const dir = this.getMoveDirection();
            this.eventSystem?.emit('input:direction', dir);
        }
        /**
         * 重置输入状态
         */
        reset() {
            this.inputState = {
                up: false,
                down: false,
                left: false,
                right: false,
                jump: false,
                attack: false,
                pause: false
            };
            this.touchPos.delta.set(0, 0);
        }
        onDestroy() {
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
            input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
            input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
            input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
            input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
            this.keyRepeatTimers.forEach(timer => clearTimeout(timer));
            this.keyRepeatTimers.clear();
            InputManager.instance = null;
        }
    };
    __setFunctionName(_classThis, "InputManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _keyRepeatDelay_decorators = [property];
        _touchSensitivity_decorators = [property];
        _mouseSensitivity_decorators = [property];
        __esDecorate(null, null, _keyRepeatDelay_decorators, { kind: "field", name: "keyRepeatDelay", static: false, private: false, access: { has: obj => "keyRepeatDelay" in obj, get: obj => obj.keyRepeatDelay, set: (obj, value) => { obj.keyRepeatDelay = value; } }, metadata: _metadata }, _keyRepeatDelay_initializers, _keyRepeatDelay_extraInitializers);
        __esDecorate(null, null, _touchSensitivity_decorators, { kind: "field", name: "touchSensitivity", static: false, private: false, access: { has: obj => "touchSensitivity" in obj, get: obj => obj.touchSensitivity, set: (obj, value) => { obj.touchSensitivity = value; } }, metadata: _metadata }, _touchSensitivity_initializers, _touchSensitivity_extraInitializers);
        __esDecorate(null, null, _mouseSensitivity_decorators, { kind: "field", name: "mouseSensitivity", static: false, private: false, access: { has: obj => "mouseSensitivity" in obj, get: obj => obj.mouseSensitivity, set: (obj, value) => { obj.mouseSensitivity = value; } }, metadata: _metadata }, _mouseSensitivity_initializers, _mouseSensitivity_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InputManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.instance = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InputManager = _classThis;
})();
export { InputManager };
