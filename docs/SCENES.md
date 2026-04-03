# 场景搭建指南

## 场景列表

### 1. Boot Scene (启动场景)
**路径**: `assets/scenes/boot.scene`

**用途**: 游戏启动时的第一个场景，负责资源预加载和初始化。

**节点结构**:
```
boot (Scene)
├── Canvas
│   ├── Camera
│   ├── LoadingUI
│   │   ├── ProgressBar
│   │   └── LoadingText
│   └── GameManager (Node)
│       └── GameManager (Component)
└── SceneManager (Node)
    └── SceneManager (Component)
```

**脚本组件**:
- `GameManager` - 初始化游戏状态
- `SceneManager` - 预加载主菜单场景

---

### 2. Main Menu Scene (主菜单场景)
**路径**: `assets/scenes/main-menu.scene`

**用途**: 游戏主菜单，玩家在此选择开始游戏、设置等。

**节点结构**:
```
main-menu (Scene)
├── Canvas
│   ├── Camera
│   ├── Background
│   ├── Title
│   ├── PlayerInfo
│   │   ├── NameLabel
│   │   └── LevelLabel
│   ├── MenuButtons
│   │   ├── PlayButton
│   │   ├── SettingsButton
│   │   ├── ShopButton
│   │   └── LogoutButton
│   └── AudioController (Node)
│       └── AudioController (Component)
└── MainMenuController (Node)
    └── MainMenuController (Component)
```

**脚本组件**:
- `MainMenuController` - 处理菜单按钮点击
- `AudioController` - 播放背景音乐

---

### 3. Game Scene (游戏场景)
**路径**: `assets/scenes/game.scene`

**用途**: 实际游戏玩法场景。

**节点结构**:
```
game (Scene)
├── Canvas
│   ├── Camera
│   ├── GameUI
│   │   ├── HealthBar
│   │   ├── ScoreLabel
│   │   └── PauseButton
│   └── AudioController (Node)
├── World
│   ├── Ground
│   ├── Player
│   │   └── PlayerModel
│   └── Enemies (Node)
└── GameplayController (Node)
    └── GameplayController (Component)
```

**脚本组件**:
- `GameplayController` - 玩家输入和游戏逻辑
- `AudioController` - 游戏音效

---

## 搭建步骤

### 创建新场景

1. 在 Cocos Creator 中，右键 `assets/scenes` → 创建 → Scene
2. 命名为对应场景名（如 `main-menu`）
3. 双击打开场景进行编辑

### 添加 Canvas

1. 右键场景根节点 → 创建 → 渲染对象 → Canvas
2. Canvas 会自动包含 Camera 节点

### 添加 UI 元素

1. 右键 Canvas → 创建 → 渲染对象 → Sprite (图片)
2. 右键 Canvas → 创建 → UI → Label (文本)
3. 右键 Canvas → 创建 → UI → Button (按钮)

### 添加脚本组件

1. 创建空节点（右键 → 创建空节点）
2. 选中节点，在 Inspector 面板 → 添加组件 → 选择对应的 TypeScript 脚本
3. 配置脚本属性（如速度、音量等）

### 设置场景为启动场景

1. 打开 `assets/settings/project.json`
2. 修改 `startScene` 为 `db://assets/scenes/boot.scene`

---

## 预制体 (Prefabs)

### 创建预制体

1. 在场景中配置好节点和组件
2. 将节点拖拽到 `assets/prefabs` 文件夹
3. 预制体可在多个场景中复用

### 常用预制体

- `Player.prefab` - 玩家角色
- `Enemy.prefab` - 敌人
- `UI_Button.prefab` - 通用按钮
- `UI_Panel.prefab` - 通用面板

---

## 注意事项

1. **节点命名**: 使用小写 + 中划线（如 `player-node`）
2. **脚本属性**: 使用 `@property` 装饰器，可在编辑器中可视化配置
3. **资源引用**: 使用 `db://` 协议引用资源
4. **场景切换**: 使用 `SceneManager.loadScene()` 方法
5. **持久化节点**: 使用 `game.addPersistRootNode()` 保持跨场景存在

---

## 调试技巧

1. **预览**: 点击编辑器顶部预览按钮
2. **手机预览**: 扫描二维码在手机上测试
3. **控制台**: 预览窗口底部的 Console 面板
4. **断点调试**: 在 Chrome DevTools 中设置断点
