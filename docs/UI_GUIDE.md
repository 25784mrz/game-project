# UI 界面搭建指南

本指南说明如何在 Cocos Creator 中创建完整的登录界面和游戏主菜单界面。

---

## 方法一：使用 UI Builder 脚本（推荐）

### 登录界面

1. **创建空节点**
   - 打开 `boot.scene` 或新建场景
   - 在层级管理器中创建空节点 `LoginUI`

2. **添加 Builder 组件**
   - 选中 `LoginUI` 节点
   - 添加组件 → `scripts/modules/auth/LoginUIBuilder`

3. **生成 UI**
   - 在属性检查器中找到 `LoginUIBuilder` 组件
   - 点击 **buildLoginUI** 按钮（需要在编辑器模式下）
   - 或者在控制台运行：
   ```typescript
   const builder = node.getComponent(LoginUIBuilder);
   builder.buildLoginUI();
   ```

4. **保存为预制体**
   - 将生成的 `LoginUI` 节点拖拽到 `assets/prefabs/` 文件夹
   - 命名为 `LoginUI.prefab`

### 游戏主菜单界面

1. **创建空节点**
   - 打开 `main-menu.scene`
   - 创建空节点 `MainMenuUI`

2. **添加 Builder 组件**
   - 添加组件 → `scripts/modules/mainmenu/GameMainMenuBuilder`

3. **生成 UI**
   - 点击 **buildMainMenu** 按钮
   - 或在控制台运行：
   ```typescript
   const builder = node.getComponent(GameMainMenuBuilder);
   builder.buildMainMenu();
   ```

4. **保存为预制体**
   - 拖拽到 `assets/prefabs/` → `MainMenuUI.prefab`

---

## 方法二：手动搭建

### 登录界面结构

```
LoginUI (Node)
├── Background (Sprite)              # 全屏背景
├── Title (Label)                    # "游戏登录" 标题
├── FormContainer (Node + Layout)    # 表单容器，垂直布局
│   ├── UsernameInput (EditBox)      # 用户名输入框
│   │   └── Background (Sprite)      # 输入框背景
│   ├── PasswordInput (EditBox)      # 密码输入框
│   │   └── Background (Sprite)      # 输入框背景
│   ├── LoginButton (Button)         # 登录按钮
│   │   └── Label                    # "登录" 文本
│   ├── RegisterButton (Button)      # 注册按钮
│   │   └── Label                    # "注册" 文本
│   ├── ToggleLabel (Label)          # "没有账号？点击切换"
│   └── ErrorLabel (Label)           # 错误提示（默认隐藏）
└── AuthController (Component)       # 控制器组件
```

### 主菜单界面结构

```
MainMenuUI (Node)
├── Background (Sprite)              # 全屏背景
├── GameTitle (Node)                 # 游戏标题
│   ├── Label                        # "我的游戏"
│   └── Shadow (Label)               # 阴影效果
├── PlayerInfo (Node)                # 玩家信息面板
│   ├── Background (Sprite)          # 面板背景
│   ├── NameLabel (Label)            # 玩家名称
│   └── LevelLabel (Label)           # 玩家等级
├── MenuContainer (Node)             # 菜单按钮容器
│   ├── PlayButton (Button)          # 开始游戏
│   │   └── Label                    # 按钮文本
│   ├── ShopButton (Button)          # 商店
│   │   └── Label                    # 按钮文本
│   ├── SettingsButton (Button)      # 设置
│   │   └── Label                    # 按钮文本
│   └── LogoutButton (Button)        # 登出
│       └── Label                    # 按钮文本
├── Copyright (Label)                # 版权信息
└── MainMenuController (Component)   # 控制器组件
```

---

## UI 设计规范

### 设计分辨率
- **宽度**: 1920px
- **高度**: 1080px
- **适配策略**: 适配宽度，高度可能裁剪

### 颜色方案

#### 登录界面
| 元素 | 颜色 | RGB |
|------|------|-----|
| 背景 | 深色 | (40, 40, 40) |
| 登录按钮 | 皇家蓝 | (65, 105, 225) |
| 注册按钮 | 海洋绿 | (46, 139, 87) |
| 文本（主） | 白色 | (255, 255, 255) |
| 文本（次） | 灰色 | (200, 200, 200) |
| 错误提示 | 红色 | (255, 69, 0) |

#### 主菜单界面
| 元素 | 颜色 | RGB |
|------|------|-----|
| 开始游戏 | 深红色 | (220, 20, 60) |
| 商店 | 橙色 | (255, 140, 0) |
| 设置 | 钢蓝色 | (70, 130, 180) |
| 登出 | 灰色 | (128, 128, 128) |
| 标题 | 金色 | (255, 215, 0) |
| 等级 | 金色 | (255, 215, 0) |

### 字体大小
| 元素 | 字号 |
|------|------|
| 游戏标题 | 96px |
| 界面标题 | 72px |
| 按钮文本 | 48px |
| 玩家名称 | 36px |
| 输入框 | 32px |
| 等级标签 | 32px |
| 提示文本 | 28px |
| 错误提示 | 24px |
| 版权信息 | 24px |

### 间距规范
- 按钮高度：90-100px
- 输入框高度：80px
- 按钮间距：30px
- 表单内边距：50px
- Widget 对齐边距：30-50px

---

## 组件绑定说明

### AuthController 绑定

在 Cocos Creator 编辑器中：

1. 选中 `LoginUI` 节点
2. 找到 `AuthController` 组件
3. 拖拽对应节点到属性槽：

| 属性 | 类型 | 拖拽节点 |
|------|------|---------|
| usernameInput | EditBox | UsernameInput 节点 |
| passwordInput | EditBox | PasswordInput 节点 |
| loginButton | Node | LoginButton 节点 |
| registerButton | Node | RegisterButton 节点 |
| errorLabel | Label | ErrorLabel 节点 |
| titleLabel | Label | Title 节点 |

### MainMenuController 绑定

1. 选中 `MainMenuUI` 节点
2. 找到 `MainMenuController` 组件
3. 拖拽对应节点：

| 属性 | 类型 | 拖拽节点 |
|------|------|---------|
| playButton | Node | PlayButton 节点 |
| settingsButton | Node | SettingsButton 节点 |
| shopButton | Node | ShopButton 节点 |
| logoutButton | Node | LogoutButton 节点 |
| playerNameLabel | Label | PlayerInfo/NameLabel |
| playerLevelLabel | Label | PlayerInfo/LevelLabel |

---

## 动画效果

### 入场动画

在场景脚本中调用：

```typescript
// 登录界面
const builder = this.getComponent(LoginUIBuilder);
builder.playEnterAnimation(this.node);

// 主菜单界面
const builder = this.getComponent(GameMainMenuBuilder);
builder.playEnterAnimation(this.node);
```

### 动画效果说明

| 元素 | 动画类型 | 持续时间 |
|------|---------|---------|
| 标题 | 弹出（缩放） | 0.4s |
| 表单容器 | 淡入 | 0.5s |
| 按钮 | 依次弹出 | 0.3s × 数量 |

---

## 资源替换

### 背景图片

1. 准备图片资源（推荐 1920x1080）
2. 放入 `assets/textures/` 文件夹
3. 在编辑器中选中 Background 节点
4. 在 Sprite 组件中设置 SpriteFrame

### 按钮图片

可以替换纯色背景为图片：

1. 准备按钮图片（正常/按下/禁用状态）
2. 在 Button 组件中设置：
   - Normal Sprite
   - Pressed Sprite
   - Disabled Sprite

---

## 测试检查清单

- [ ] UI 在 1920x1080 分辨率下显示正常
- [ ] UI 在手机屏幕（16:9）上适配良好
- [ ] 所有按钮可点击并有反馈
- [ ] 输入框可以正常输入
- [ ] 错误提示显示正确
- [ ] 入场动画流畅
- [ ] 控制器绑定正确
- [ ] 保存为预制体后可复用

---

## 常见问题

### Q: UI 位置偏移？
A: 检查 Widget 组件设置，确保 align 正确。

### Q: 按钮点击无响应？
A: 检查 Button 组件是否添加，Click Events 是否绑定。

### Q: 输入框无法输入？
A: 检查 EditBox 组件，确保 inputFlag 和 returnType 设置正确。

### Q: 文字显示不全？
A: 检查 Label 的 Overflow 设置，建议使用 CLAMP 模式。

---

## 下一步

创建完 UI 后：
1. 保存场景
2. 保存为预制体
3. 在场景中实例化预制体
4. 运行测试

详细场景搭建参考 [SCENES.md](./SCENES.md)
