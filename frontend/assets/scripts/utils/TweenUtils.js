/**
 * 缓动工具类
 * 基于 Cocos Tween 的动画工具
 */
import { tween, Vec3, Node, UITransform } from 'cc';
export class TweenUtils {
    /**
     * 移动缓动
     */
    static move(node, targetPos, duration, callback) {
        return tween(node)
            .to(duration, { position: targetPos })
            .call(() => callback?.())
            .start();
    }
    /**
     * 缩放缓动
     */
    static scale(node, targetScale, duration, callback) {
        return tween(node)
            .to(duration, { scale: targetScale })
            .call(() => callback?.())
            .start();
    }
    /**
     * 旋转缓动
     */
    static rotate(node, targetEuler, duration, callback) {
        return tween(node)
            .to(duration, { eulerAngles: targetEuler })
            .call(() => callback?.())
            .start();
    }
    /**
     * 淡入
     */
    static fadeIn(node, duration, callback) {
        return tween(node)
            .to(duration, { opacity: 255 })
            .call(() => callback?.())
            .start();
    }
    /**
     * 淡出
     */
    static fadeOut(node, duration, callback) {
        return tween(node)
            .to(duration, { opacity: 0 })
            .call(() => callback?.())
            .start();
    }
    /**
     * 弹跳效果
     */
    static bounce(node, duration, callback) {
        const startPos = node.position.clone();
        const upPos = new Vec3(startPos.x, startPos.y + 50, startPos.z);
        return tween(node)
            .to(duration / 4, { position: upPos })
            .to(duration / 4, { position: startPos })
            .to(duration / 4, { position: upPos })
            .to(duration / 4, { position: startPos })
            .call(() => callback?.())
            .start();
    }
    /**
     * 抖动效果
     */
    static shake(node, duration, intensity = 5, callback) {
        const originalPos = node.position.clone();
        const shakeCount = Math.floor(duration * 60);
        const shakeDuration = duration / shakeCount;
        const chain = tween(node);
        for (let i = 0; i < shakeCount; i++) {
            const randomX = originalPos.x + (Math.random() - 0.5) * intensity;
            const randomY = originalPos.y + (Math.random() - 0.5) * intensity;
            chain.to(shakeDuration / 2, {
                position: new Vec3(randomX, randomY, originalPos.z)
            })
                .to(shakeDuration / 2, { position: originalPos });
        }
        return chain.call(() => callback?.()).start();
    }
    /**
     * 脉冲效果
     */
    static pulse(node, duration, scale = 1.1, callback) {
        const originalScale = node.scale.clone();
        const targetScale = new Vec3(originalScale.x * scale, originalScale.y * scale, originalScale.z * scale);
        return tween(node)
            .to(duration / 2, { scale: targetScale })
            .to(duration / 2, { scale: originalScale })
            .call(() => callback?.())
            .start();
    }
    /**
     * 序列动画
     */
    static sequence(actions, callback) {
        if (actions.length === 0) {
            callback?.();
            return tween(new Node());
        }
        const firstAction = actions[0];
        const target = firstAction.target;
        if (!target)
            return tween(new Node());
        let t;
        switch (firstAction.type) {
            case 'move':
                t = tween(target).to(firstAction.duration, { position: firstAction.value });
                break;
            case 'scale':
                t = tween(target).to(firstAction.duration, { scale: firstAction.value });
                break;
            case 'rotate':
                t = tween(target).to(firstAction.duration, { eulerAngles: firstAction.value });
                break;
            case 'fade':
                t = tween(target).to(firstAction.duration, { opacity: firstAction.value });
                break;
            case 'delay':
                t = tween(target).delay(firstAction.duration);
                break;
            case 'call':
                t = tween(target).call(firstAction.callback);
                break;
            default:
                t = tween(target);
        }
        if (actions.length > 1) {
            t.then(this.sequence(actions.slice(1), callback));
        }
        else if (callback) {
            t.call(callback);
        }
        return t.start();
    }
    /**
     * 并行动画
     */
    static parallel(tweens) {
        tweens.forEach(t => t.start());
    }
    /**
     * UI 弹出效果
     */
    static popupUI(node, callback) {
        node.scale = new Vec3(0, 0, 0);
        node.opacity = 0;
        return tween(node)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1), opacity: 255 }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .call(() => callback?.())
            .start();
    }
    /**
     * UI 关闭效果
     */
    static closeUI(node, callback) {
        return tween(node)
            .to(0.2, { scale: new Vec3(0.8, 0.8, 0.8), opacity: 0 })
            .call(() => callback?.())
            .start();
    }
    /**
     * 进度条动画
     */
    static progressBar(node, fromWidth, toWidth, duration, callback) {
        const uiTransform = node.getComponent(UITransform);
        if (!uiTransform)
            return tween(new Node());
        return tween(node)
            .to(duration, {}, {
            onUpdate: (ratio) => {
                const currentWidth = fromWidth + (toWidth - fromWidth) * ratio;
                uiTransform.setContentSize(currentWidth, uiTransform.height);
            }
        })
            .call(() => callback?.())
            .start();
    }
    /**
     * 数字滚动效果
     */
    static scrollNumber(label, from, to, duration, callback) {
        return tween(label)
            .to(duration, {}, {
            onUpdate: (ratio) => {
                const currentValue = Math.floor(from + (to - from) * ratio);
                if (label.string !== undefined) {
                    label.string = currentValue.toString();
                }
            }
        })
            .call(() => callback?.())
            .start();
    }
}
