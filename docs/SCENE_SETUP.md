# 场景配置说明

本文档说明如何配置游戏的三个核心场景。

---

## 场景列表

| 场景 | 文件路径 | 用途 | 加载时机 |
|------|---------|------|---------|
| Boot | `assets/scenes/boot.scene` | 启动、资源预加载 | 游戏启动 |
| Main Menu | `assets/scenes/main-menu.scene` | 主菜单界面 | 登录成功后 |
| Game | `assets/scenes/game.scene` | 游戏玩法场景 | 点击开始游戏 |

---

## 1. Boot 场景（启动场景）

### 场景结构

```
boot (Scene)
├── Canvas
│   ├── Main Camera (Camera)
│   └── LoadingUI (Node)
│       ├── ProgressBar (ProgressBar)
│       └── LoadingText (Label)
├── GameManager (Node)
│   └── GameManager (Component)
├── SceneManager (Node)
│   └── SceneManager (Component)
└── UIManager (Node)
    └── UIManager (Component)
```

### 组件配置

#### GameManager
```typescript
debugMode: true
version: "1.0.0"
```

#### SceneManager
```typescript
defaultScene: "main-menu"
loadingScene: "loading"
```

### 工作流程

1. 场景加载
2. 显示 Loading UI
3. 预加载资源（图片、音频、预制体）
4. 加载主菜单场景
5. 切换到主菜单

### 脚本示例

```typescript
// BootController.ts
import { _decorator, Component, ProgressBar, Label } from 'cc';
import { SceneManager } from '../core/SceneManager';
import { ResourceManager } from '../core/ResourceManager';

@ccclass('BootController')
export class BootController extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar | null = null;
    
    @property(Label)
    loadingText: Label | null = null;
    
    async start() {
        const resourceManager = ResourceManager.getInstance();
        const sceneManager = SceneManager.getInstance();
        
        // 预加载资源
        const resources = [
            { path: 'textures/background', type: 'image' },
            { path: 'audio/bgm', type: 'audio' },
            { path: 'prefabs/LoginUI', type: 'prefab' }
        ];
        
        for (let i = 0; i < resources.length; i++) {
            await resourceManager.load(resources[i].path, resources[i].type);
            this.updateProgress((i + 1) / resources.length);
        }
        
        // 加载主菜单场景
        await sceneManager.loadScene('main-menu');
    }
    
    updateProgress(progress: number) {
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
        if (this.loadingText) {
            this.loadingText.string = `加载中... ${Math.floor(progress * 100)}%`;
        }
    }
}
```

---

## 2. Main Menu 场景（主菜单）

### 场景结构

```
main-menu (Scene)
├── Canvas
│   ├── Main Camera (Camera)
│   └── MainMenuUI (Node)              # 主菜单预制体
│       ├── Background (Sprite)
│       ├── GameTitle (Node)
│       ├── PlayerInfo (Node)
│       ├── MenuContainer (Node)
│       └── MainMenuController (Component)
├── AudioManager (Node)
│   └── AudioController (Component)
├── InputManager (Node)
│   └── InputManager (Component)
└── UIManager (Node)
    └── UIManager (Component)
```

### 组件配置

#### AudioController
```typescript
bgmVolume: 0.5
sfxVolume: 0.8
bgmClip: [拖拽 BGM 音频资源]
clickClip: [拖拽点击音效资源]
```

### 工作流程

1. 场景加载
2. 播放入场动画
3. 播放背景音乐
4. 显示玩家信息
5. 等待玩家操作

### 按钮事件绑定

在 MainMenuController 组件中绑定：

| 按钮 | 事件 | 响应方法 |
|------|------|---------|
| PlayButton | Click | onPlayClick() |
| SettingsButton | Click | onSettingsClick() |
| ShopButton | Click | onShopClick() |
| LogoutButton | Click | onLogoutClick() |

---

## 3. Game 场景（游戏场景）

### 场景结构

```
game (Scene)
├── Canvas
│   ├── Main Camera (Camera)
│   └── GameUI (Node)
│       ├── HealthBar (ProgressBar)
│       ├── ScoreLabel (Label)
│       └── PauseButton (Button)
├── World (Node)
│   ├── Ground (Node)
│   │   └── Collider (BoxCollider)
│   ├── Player (Node)
│   │   ├── Model (Node)
│   │   ├── PlayerController (Component)
│   │   └── Animator (Animation)
│   └── Enemies (Node)
├── InputManager (Node)
│   └── InputManager (Component)
├── GameManager (Node)
│   └── GameManager (Component)
└── AudioManager (Node)
    └── AudioController (Component)
```

### 组件配置

#### PlayerController
```typescript
moveSpeed: 5
jumpForce: 10
gravity: -20
maxHealth: 100
attackDamage: 10
modelNode: [拖拽玩家模型节点]
animation: [拖拽 Animation 组件]
```

### 工作流程

1. 场景加载
2. 初始化玩家状态
3. 注册输入事件
4. 游戏循环开始
5. 监听游戏结束事件

---

## 场景切换流程

```
┌─────────────┐
│   游戏启动   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Boot 场景    │──→ 预加载资源
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Main Menu   │──→ 显示主菜单
└──────┬──────┘
       │
       │ 点击"开始游戏"
       ▼
┌─────────────┐
│ Game 场景    │──→ 开始游戏
└──────┬──────┘
       │
       │ 游戏结束/返回
       ▼
┌─────────────┐
│ Main Menu   │
└─────────────┘
```

---

## 场景配置步骤

### 步骤 1：创建场景文件

1. 在 Cocos Creator 中
2. 右键 `assets/scenes/` → 创建 → Scene
3. 命名为 `boot`、`main-menu`、`game`

### 步骤 2：添加 Canvas

1. 层级管理器 → + → UI → Canvas
2. 自动创建 Main Camera

### 步骤 3：添加管理器节点

创建空节点并添加组件：
- GameManager
- SceneManager
- UIManager
- InputManager
- AudioManager

### 步骤 4：搭建 UI

参考 [UI_GUIDE.md](./UI_GUIDE.md) 创建界面

### 步骤 5：保存场景

Ctrl+S 保存场景

### 步骤 6：设置启动场景

1. 项目 → 项目设置 → 项目数据
2. 启动场景：`db://assets/scenes/boot.scene`

---

## 场景间数据传递

### 使用 GameManager

```typescript
// 在 Main Menu 场景设置数据
const gameManager = GameManager.getInstance();
gameManager.setGameData('player', {
    name: 'Player1',
    level: 10,
    score: 1000
});

// 切换到 Game 场景
SceneManager.getInstance().loadScene('game');

// 在 Game 场景获取数据
const playerData = gameManager.getGameData('player');
console.log(playerData.name); // "Player1"
```

### 使用事件系统

```typescript
// 发送事件
EventSystem.getInstance().emit('game:start', {
    difficulty: 'normal'
});

// 监听事件
EventSystem.getInstance().on('game:over', (score: number) => {
    console.log('Game over, score:', score);
});
```

---

## 多分辨率适配

### Canvas 设置

在 Canvas 组件中：
- **Design Resolution**: 1920 x 1080
- **Fit Width**: ✓
- **Fit Height**: ✗

### Widget 设置

UI 元素使用 Widget 组件适配：

```typescript
// 顶部对齐
widget.isAlignTop = true;
widget.top = 50;

// 底部对齐
widget.isAlignBottom = true;
widget.bottom = 50;

// 居中
widget.isAlignHorizontalCenter = true;
widget.isAlignVerticalCenter = true;
```

---

## 性能优化

### 场景加载优化

1. **分帧加载**：避免一帧加载过多资源
2. **进度显示**：显示加载进度条
3. **预加载**：在 Boot 场景预加载常用资源

### 资源管理

1. **引用计数**：使用 ResourceManager 管理资源
2. **及时释放**：场景切换时释放不需要的资源
3. **缓存策略**：常用资源保持缓存

---

## 调试技巧

### 场景调试

```typescript
// 在控制台查看当前场景
console.log(cc.director.getScene().name);

// 手动切换场景（调试用）
cc.director.loadScene('game');

// 查看场景中的节点
console.log(cc.director.getScene().children);
```

### 性能检查

1. 打开 Cocos Creator 的 **Profiler** 面板
2. 查看 FPS、DrawCall、内存使用
3. 优化高消耗操作

---

## 检查清单

创建场景前检查：

- [ ] 场景文件已创建
- [ ] Canvas 和 Camera 已添加
- [ ] 管理器节点已创建
- [ ] UI 界面已搭建
- [ ] 组件已绑定
- [ ] 事件已监听
- [ ] 场景已保存
- [ ] 启动场景已设置
- [ ] 多分辨率已测试

---

## 相关文档

- [UI 搭建指南](./UI_GUIDE.md)
- [组件开发指南](./COMPONENTS.md)
- [快速开始](./QUICKSTART.md)
