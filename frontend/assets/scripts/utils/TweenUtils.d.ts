/**
 * 缓动工具类
 * 基于 Cocos Tween 的动画工具
 */
import { Tween, Vec3, Node } from 'cc';
export declare class TweenUtils {
    /**
     * 移动缓动
     */
    static move(node: Node, targetPos: Vec3, duration: number, callback?: () => void): Tween<Node>;
    /**
     * 缩放缓动
     */
    static scale(node: Node, targetScale: Vec3, duration: number, callback?: () => void): Tween<Node>;
    /**
     * 旋转缓动
     */
    static rotate(node: Node, targetEuler: Vec3, duration: number, callback?: () => void): Tween<Node>;
    /**
     * 淡入
     */
    static fadeIn(node: Node, duration: number, callback?: () => void): Tween<Node>;
    /**
     * 淡出
     */
    static fadeOut(node: Node, duration: number, callback?: () => void): Tween<Node>;
    /**
     * 弹跳效果
     */
    static bounce(node: Node, duration: number, callback?: () => void): Tween<Node>;
    /**
     * 抖动效果
     */
    static shake(node: Node, duration: number, intensity?: number, callback?: () => void): Tween<Node>;
    /**
     * 脉冲效果
     */
    static pulse(node: Node, duration: number, scale?: number, callback?: () => void): Tween<Node>;
    /**
     * 序列动画
     */
    static sequence(actions: Array<{
        type: 'move' | 'scale' | 'rotate' | 'fade' | 'delay' | 'call';
        target?: Node;
        value?: any;
        duration?: number;
        callback?: () => void;
    }>, callback?: () => void): Tween<Node>;
    /**
     * 并行动画
     */
    static parallel(tweens: Tween<Node>[]): void;
    /**
     * UI 弹出效果
     */
    static popupUI(node: Node, callback?: () => void): Tween<Node>;
    /**
     * UI 关闭效果
     */
    static closeUI(node: Node, callback?: () => void): Tween<Node>;
    /**
     * 进度条动画
     */
    static progressBar(node: Node, fromWidth: number, toWidth: number, duration: number, callback?: () => void): Tween<Node>;
    /**
     * 数字滚动效果
     */
    static scrollNumber(label: any, from: number, to: number, duration: number, callback?: () => void): Tween<any>;
}
