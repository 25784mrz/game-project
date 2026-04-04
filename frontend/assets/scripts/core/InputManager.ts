/**
 * 输入管理器
 * 统一处理键盘、触摸、鼠标输入
 */

import { _decorator, Component, Node, input, Input, EventKeyboard, EventTouch, EventMouse, KeyCode, Vec2, Vec3, game } from 'cc';
import { EventSystem } from '../core/EventSystem';

const { ccclass, property } = _decorator;

interface InputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    attack: boolean;
    pause: boolean;
}

interface TouchPosition {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    delta: Vec2;
}

@ccclass('InputManager')
export class InputManager extends Component {
    private static instance: InputManager | null = null;
    
    @property
    keyRepeatDelay: number = 0.1;
    
    @property
    touchSensitivity: number = 1.0;
    
    @property
    mouseSensitivity: number = 0.5;
    
    private inputState: InputState = {
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
        attack: false,
        pause: false
    };
    
    private touchPos: TouchPosition = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        delta: new Vec2(0, 0)
    };
    
    private mousePos: Vec2 = new Vec2(0, 0);
    private eventSystem: EventSystem | null = null;
    private keyRepeatTimers: Map<string, NodeJS.Timeout> = new Map();
    
    static getInstance(): InputManager {
        if (!InputManager.instance) {
            const node = new Node('InputManager');
            InputManager.instance = node.addComponent(InputManager) as InputManager;
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
    private registerInput(): void {
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
    private onKeyDown(event: EventKeyboard): void {
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
    private onKeyUp(event: EventKeyboard): void {
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
    private onTouchStart(event: EventTouch): void {
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
    private onTouchMove(event: EventTouch): void {
        const touch = event.getAllTouches()[0];
        const location = touch.getLocation();
        
        this.touchPos.currentX = location.x;
        this.touchPos.currentY = location.y;
        this.touchPos.delta.set(
            (location.x - this.touchPos.startX) * this.touchSensitivity,
            (location.y - this.touchPos.startY) * this.touchSensitivity
        );
        
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
    private onTouchEnd(event: EventTouch): void {
        const touch = event.getAllTouches()[0];
        const location = touch.getLocation();
        
        // 检测滑动
        const swipeDelta = new Vec2(
            location.x - this.touchPos.startX,
            location.y - this.touchPos.startY
        );
        
        if (swipeDelta.length() > 50) {
            // 识别滑动方向
            if (Math.abs(swipeDelta.x) > Math.abs(swipeDelta.y)) {
                this.eventSystem?.emit('input:swipe', swipeDelta.x > 0 ? 'right' : 'left');
            } else {
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
    private onMouseDown(event: EventMouse): void {
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
    private onMouseUp(event: EventMouse): void {
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
    private onMouseMove(event: EventMouse): void {
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
    private onMouseWheel(event: EventMouse): void {
        const scrollY = event.getScrollY();
        
        this.eventSystem?.emit('input:mouse-wheel', {
            deltaY: scrollY
        });
    }
    
    /**
     * 获取移动方向
     */
    getMoveDirection(): Vec3 {
        const dir = new Vec3(0, 0, 0);
        
        if (this.inputState.up) dir.z -= 1;
        if (this.inputState.down) dir.z += 1;
        if (this.inputState.left) dir.x -= 1;
        if (this.inputState.right) dir.x += 1;
        
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
    isMoving(): boolean {
        return this.inputState.up || this.inputState.down || 
               this.inputState.left || this.inputState.right ||
               this.touchPos.delta.length() > 0.1;
    }
    
    /**
     * 获取输入状态
     */
    getInputState(): InputState {
        return { ...this.inputState };
    }
    
    /**
     * 获取触摸位置
     */
    getTouchPosition(): { x: number; y: number; deltaX: number; deltaY: number } {
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
    getMousePosition(): Vec2 {
        return new Vec2(this.mousePos.x, this.mousePos.y);
    }
    
    /**
     * 开始按键重复
     */
    private startKeyRepeat(key: string): void {
        this.stopKeyRepeat(key);
        
        const timer = setTimeout(() => {
            this.eventSystem?.emit(`input:key-repeat:${key}`);
        }, this.keyRepeatDelay * 1000);
        
        this.keyRepeatTimers.set(key, timer);
    }
    
    /**
     * 停止按键重复
     */
    private stopKeyRepeat(key: string): void {
        const timer = this.keyRepeatTimers.get(key);
        if (timer) {
            clearTimeout(timer);
            this.keyRepeatTimers.delete(key);
        }
    }
    
    /**
     * 发射方向事件
     */
    private emitDirectionEvent(): void {
        const dir = this.getMoveDirection();
        this.eventSystem?.emit('input:direction', dir);
    }
    
    /**
     * 重置输入状态
     */
    reset(): void {
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
    
    onDestroy(): void {
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
}
