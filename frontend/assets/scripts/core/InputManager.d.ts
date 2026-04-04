/**
 * 输入管理器
 * 统一处理键盘、触摸、鼠标输入
 */
import { Component, Vec2, Vec3 } from 'cc';
interface InputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    attack: boolean;
    pause: boolean;
}
export declare class InputManager extends Component {
    private static instance;
    keyRepeatDelay: number;
    touchSensitivity: number;
    mouseSensitivity: number;
    private inputState;
    private touchPos;
    private mousePos;
    private eventSystem;
    private keyRepeatTimers;
    static getInstance(): InputManager;
    onLoad(): void;
    start(): void;
    /**
     * 注册输入事件
     */
    private registerInput;
    /**
     * 键盘按下
     */
    private onKeyDown;
    /**
     * 键盘释放
     */
    private onKeyUp;
    /**
     * 触摸开始
     */
    private onTouchStart;
    /**
     * 触摸移动
     */
    private onTouchMove;
    /**
     * 触摸结束
     */
    private onTouchEnd;
    /**
     * 鼠标按下
     */
    private onMouseDown;
    /**
     * 鼠标释放
     */
    private onMouseUp;
    /**
     * 鼠标移动
     */
    private onMouseMove;
    /**
     * 鼠标滚轮
     */
    private onMouseWheel;
    /**
     * 获取移动方向
     */
    getMoveDirection(): Vec3;
    /**
     * 检查是否正在移动
     */
    isMoving(): boolean;
    /**
     * 获取输入状态
     */
    getInputState(): InputState;
    /**
     * 获取触摸位置
     */
    getTouchPosition(): {
        x: number;
        y: number;
        deltaX: number;
        deltaY: number;
    };
    /**
     * 获取鼠标位置
     */
    getMousePosition(): Vec2;
    /**
     * 开始按键重复
     */
    private startKeyRepeat;
    /**
     * 停止按键重复
     */
    private stopKeyRepeat;
    /**
     * 发射方向事件
     */
    private emitDirectionEvent;
    /**
     * 重置输入状态
     */
    reset(): void;
    onDestroy(): void;
}
export {};
