# 组件开发指南

## 什么是组件

在 Cocos Creator 中，**组件**是附加到节点上的功能模块。游戏逻辑通过组合多个组件来实现。

## 创建组件

### 基本结构

```typescript
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MyComponent')
export class MyComponent extends Component {
    // 组件逻辑
}
```

### 添加属性（可在编辑器中配置）

```typescript
@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    speed: number = 5;
    
    @property
    jumpForce: number = 10;
    
    @property(Node)
    targetNode: Node | null = null;
    
    @property(AudioClip)
    jumpSound: AudioClip | null = null;
}
```

### 生命周期方法

```typescript
@ccclass('Example')
export class Example extends Component {
    // 组件加载时调用（只一次）
    onLoad() {}
    
    // 场景首次激活时调用
    start() {}
    
    // 每帧调用
    update(deltaTime: number) {}
    
    // 组件销毁时调用
    onDestroy() {}
    
    // 组件启用时调用
    onEnable() {}
    
    // 组件禁用时调用
    onDisable() {}
}
```

---

## 核心组件说明

### GameManager

**路径**: `assets/scripts/core/GameManager.ts`

**功能**: 游戏状态管理、全局数据

**使用示例**:
```typescript
const gameManager = GameManager.getInstance();
gameManager.changeState(GameState.GAME);
gameManager.setGameData('score', 100);
```

### SceneManager

**路径**: `assets/scripts/core/SceneManager.ts`

**功能**: 场景加载和切换

**使用示例**:
```typescript
const sceneManager = SceneManager.getInstance();
await sceneManager.loadScene('main-menu');
await sceneManager.preloadScene('game');
```

### ResourceManager

**路径**: `assets/scripts/core/ResourceManager.ts`

**功能**: 资源加载和管理

**使用示例**:
```typescript
const resourceManager = ResourceManager.getInstance();
const texture = await resourceManager.load('textures/player', 'image');
await resourceManager.preload([
    { path: 'audio/bgm', type: 'audio' }
]);
```

### EventSystem

**路径**: `assets/scripts/core/EventSystem.ts`

**功能**: 全局事件总线

**使用示例**:
```typescript
const eventSystem = EventSystem.getInstance();

// 监听
eventSystem.on('player:hit', (damage: number) => {
    console.log('Player hit:', damage);
});

// 触发
eventSystem.emit('player:hit', 10);
```

### NetworkManager

**路径**: `assets/scripts/core/NetworkManager.ts`

**功能**: WebSocket 通信

**使用示例**:
```typescript
const network = NetworkManager.getInstance();
await network.connect('ws://localhost:8080');

// 发送
network.send('player:move', { x: 10, y: 20 });

// 请求 - 响应
const response = await network.request('auth:login', { username, password });

// 监听
network.on('game:update', (data) => {
    console.log('Game update:', data);
});
```

---

## 组件通信

### 方式 1: 事件系统（推荐）

```typescript
// 组件 A - 触发事件
this.eventSystem.emit('player:scored', 100);

// 组件 B - 监听事件
this.eventSystem.on('player:scored', (score: number) => {
    this.updateScore(score);
});
```

### 方式 2: 单例模式

```typescript
const gameManager = GameManager.getInstance();
gameManager.setGameData('key', 'value');
```

### 方式 3: 组件引用

```typescript
@property(AudioController)
audioController: AudioController | null = null;

start() {
    this.audioController?.playSFX(this.clickSound);
}
```

---

## 最佳实践

### 1. 组件职责单一

每个组件只做一件事：
- `PlayerMovement` - 只负责移动
- `PlayerHealth` - 只负责血量
- `PlayerAnimation` - 只负责动画

### 2. 使用属性装饰器

让设计人员可在编辑器中调整参数：

```typescript
@property({
    tooltip: '玩家移动速度',
    min: 1,
    max: 20,
    step: 0.1
})
speed: number = 5;
```

### 3. 资源异步加载

```typescript
async start() {
    const clip = await this.loadAudio('jump_sound');
    if (clip) {
        this.audioSource.playOneShot(clip);
    }
}
```

### 4. 清理资源

```typescript
onDestroy() {
    // 移除事件监听
    this.eventSystem.off('player:hit', this.onHit, this);
    
    // 释放资源
    this.resourceManager.release('textures/temp');
}
```

---

## 调试技巧

### 日志输出

```typescript
console.log('[MyComponent] Debug info:', data);
```

### Inspector 调试

在编辑器中选中节点，查看组件属性值。

### 运行时修改

```typescript
// 在 Chrome 控制台
cc.find('Canvas/Player').getComponent('PlayerController').speed = 10;
```
