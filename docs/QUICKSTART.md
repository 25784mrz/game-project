# 快速开始指南

## 前置要求

- **Cocos Creator 3.8.8**（推荐）
- 最低版本：3.8.0+
- **TypeScript 5.0+**
- **Node.js 16+** (用于后端)
- **Go 1.19+** (用于后端)

---

## 第一步：打开项目

1. 启动 **Cocos Creator 3.8**
2. 点击 **打开项目** → 选择 `game-project` 文件夹
3. 等待资源导入完成

---

## 第二步：创建场景

### 1. Boot 场景（启动场景）

```
assets/scenes/boot.scene
```

**节点结构**:
```
boot (Scene)
├── Canvas
│   ├── Main Camera
│   └── LoadingUI
│       ├── ProgressBar
│       └── LoadingText (Label)
└── GameManager (Node)
    └── GameManager (Component)
```

**步骤**:
1. 右键 `assets/scenes` → 创建 → Scene → 命名 `boot`
2. 创建 Canvas：层级管理器 → + → UI → Canvas
3. 创建 LoadingUI 节点，添加 ProgressBar 和 Label
4. 创建空节点 `GameManager`，添加 `GameManager` 组件
5. 保存场景

---

### 2. Main Menu 场景（主菜单）

```
assets/scenes/main-menu.scene
```

**节点结构**:
```
main-menu (Scene)
├── Canvas
│   ├── Main Camera
│   ├── Background (Sprite)
│   ├── Title (Label)
│   ├── PlayerInfo
│   │   ├── NameLabel (Label)
│   │   └── LevelLabel (Label)
│   └── MenuButtons
│       ├── PlayButton (Button)
│       ├── SettingsButton (Button)
│       └── LogoutButton (Button)
├── AudioManager (Node)
│   └── AudioController (Component)
└── MainMenuController (Node)
    └── MainMenuController (Component)
```

**步骤**:
1. 创建新场景 `main-menu`
2. 添加背景图片（Sprite）
3. 添加标题和按钮
4. 创建 `AudioManager` 节点，添加 `AudioController` 组件
5. 创建 `MainMenuController` 节点，添加 `MainMenuController` 组件
6. 将按钮的 Click Events 绑定到 MainMenuController 的对应方法
7. 保存场景

---

### 3. Game 场景（游戏场景）

```
assets/scenes/game.scene
```

**节点结构**:
```
game (Scene)
├── Canvas
│   ├── Main Camera
│   ├── GameUI
│   │   ├── HealthBar
│   │   └── ScoreLabel
│   └── PauseButton
├── World
│   ├── Ground
│   ├── Player
│   │   ├── Model
│   │   └── PlayerController (Component)
│   └── Enemies
├── InputManager (Node)
│   └── InputManager (Component)
└── GameManager (Node)
    └── GameManager (Component)
```

**步骤**:
1. 创建新场景 `game`
2. 添加地面（Ground）
3. 创建 Player 节点，添加 `PlayerController` 组件
4. 创建 `InputManager` 节点，添加 `InputManager` 组件
5. 添加 UI（血条、分数等）
6. 保存场景

---

## 第三步：配置项目

### 项目设置

1. 菜单栏 → **项目** → **项目设置**
2. **项目数据**:
   - 设计分辨率：1920 x 1080
   - 适配屏幕宽度：✓
   - 适配屏幕高度：✗

3. **功能裁剪**:
   - 根据需求启用 2D/3D 物理
   - 启用音频系统

4. **启动场景**:
   - 设置为 `db://assets/scenes/boot.scene`

---

## 第四步：添加资源

### 图片资源

将图片放入 `assets/textures/` 文件夹，Cocos 会自动导入。

### 音频资源

将音频放入 `assets/audio/` 文件夹，支持 MP3、OGG、WAV。

### 预制体

1. 在场景中配置好节点
2. 拖拽到 `assets/prefabs/` 文件夹
3. 可在其他场景中复用

---

## 第五步：配置组件

### GameManager

```typescript
// 在编辑器中配置
debugMode: true      // 调试模式
version: "1.0.0"     // 游戏版本
```

### PlayerController

```typescript
moveSpeed: 5         // 移动速度
jumpForce: 10        // 跳跃力
maxHealth: 100       // 最大生命值
attackDamage: 10     // 攻击伤害
```

### AudioController

```typescript
bgmVolume: 0.5       // 背景音乐音量
sfxVolume: 0.8       // 音效音量
```

---

## 第六步：测试运行

### 在编辑器中预览

1. 打开任意场景
2. 点击编辑器顶部的 **预览** 按钮
3. 查看 Console 面板的输出

### 在浏览器中预览

1. 菜单栏 → **项目** → **构建发布**
2. 选择平台：**Web Mobile** 或 **Web Desktop**
3. 点击 **构建**
4. 在浏览器中打开构建的 HTML 文件

### 在手机上预览

1. 确保手机和电脑在同一网络
2. 点击预览按钮旁边的 **二维码** 图标
3. 用手机扫描二维码

---

## 第七步：连接后端

### 启动后端服务器

```bash
cd backend
go mod tidy
go run main.go
```

### 配置网络

在 `NetworkManager` 组件中设置：
```typescript
serverUrl: "ws://localhost:8080"
autoReconnect: true
```

---

## 常见问题

### Q: 脚本无法加载？
A: 确保脚本路径正确，使用 `db://` 协议引用资源。

### Q: 组件在编辑器中不显示？
A: 确保类使用了 `@ccclass` 装饰器，属性使用 `@property`。

### Q: 场景切换黑屏？
A: 确保目标场景已保存，并且在构建时包含在场景中。

### Q: 手机预览无法连接？
A: 确保防火墙允许，并且使用电脑的局域网 IP 而不是 localhost。

---

## 下一步

- 阅读 [场景搭建指南](./SCENES.md)
- 阅读 [组件开发指南](./COMPONENTS.md)
- 查看 [Cocos 官方文档](https://docs.cocos.com/creator/3.8/manual/zh/)

---

祝你开发顺利！🎮
