# Game Project - Cocos Creator 游戏框架

## 项目定位

基于 Cocos Creator 3.8 理念构建的跨平台游戏框架，采用**组件化**、**数据驱动**的开发模式。

## 技术栈

- **引擎**: Cocos Creator 3.8 (TypeScript)
- **架构**: 组件化 + 场景管理
- **通信**: WebSocket 双向通信
- **发布平台**: Web、iOS、Android、小游戏、PC

## 核心特性

- 🧩 **组件化开发** - 游戏逻辑通过脚本组件挂载到场景节点
- 📐 **数据驱动** - 脚本属性可在编辑器中可视化调整
- 🎬 **场景为中心** - 场景是游戏内容的基本组织方式
- 📦 **资源管理** - 异步加载 + 引用计数 + 自动释放
- 🚀 **一键发布** - 多平台构建支持

## 项目结构

```
game-project/
├── assets/                    # Cocos 资源目录
│   ├── scenes/               # 场景文件
│   │   ├── boot.scene        # 启动场景
│   │   ├── main-menu.scene   # 主菜单场景
│   │   └── game.scene        # 游戏场景
│   ├── scripts/              # TypeScript 脚本
│   │   ├── core/             # 核心框架
│   │   │   ├── GameManager.ts      # 游戏管理器
│   │   │   ├── SceneManager.ts     # 场景管理
│   │   │   ├── ResourceManager.ts  # 资源管理
│   │   │   ├── EventSystem.ts      # 事件系统
│   │   │   └── NetworkManager.ts   # 网络通信
│   │   ├── components/       # 可复用组件
│   │   │   ├── AudioController.ts  # 音频控制
│   │   │   ├── UIController.ts     # UI 控制
│   │   │   └── PlayerController.ts # 玩家控制
│   │   └── modules/          # 功能模块
│   │       ├── auth/         # 认证模块
│   │       ├── mainmenu/     # 主菜单模块
│   │       └── gameplay/     # 游戏玩法模块
│   ├── textures/             # 图片资源
│   ├── audio/                # 音频资源
│   ├── animations/           # 动画资源
│   └── prefabs/              # 预制体
├── backend/                  # 后端 Go 服务
│   ├── server/               # 服务器核心
│   └── game/                 # 游戏逻辑
└── docs/                     # 文档
```

## 快速开始

### 1. 使用 Cocos Creator 打开项目

```bash
# 启动 Cocos Creator，打开项目目录
```

### 2. 前端开发

```bash
cd assets/scripts
# 在 Cocos Creator 编辑器中开发
```

### 3. 后端开发

```bash
cd backend
go mod tidy
go run main.go
```

### 4. 预览与发布

- **预览**: 点击编辑器预览按钮，或扫码手机预览
- **发布**: 构建发布面板 → 选择目标平台 → 一键发布

## 核心模块说明

### GameManager (游戏管理器)
单例模式，管理游戏生命周期、状态切换、全局配置。

### SceneManager (场景管理)
负责场景加载、切换、预加载，支持场景间数据传递。

### ResourceManager (资源管理)
- 异步加载资源（图片、音频、预制体等）
- 引用计数管理，自动释放
- 资源预加载队列

### EventSystem (事件系统)
全局事件总线，模块间松耦合通信。

### NetworkManager (网络管理)
- WebSocket 连接管理
- 消息序列化/反序列化
- 自动重连、消息队列缓存

## 组件开发示例

```typescript
// 组件化脚本示例
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    speed: number = 5;
    
    @property
    jumpForce: number = 10;
    
    start() {
        // 组件初始化
    }
    
    update(deltaTime: number) {
        // 每帧更新
    }
}
```

## 已完成功能

- [x] 项目结构搭建
- [x] 核心框架设计
- [x] 网络通信模块
- [x] 资源管理系统
- [x] 场景管理
- [x] 组件化架构
- [x] 登录界面 UI（完整可运行）
- [x] 游戏主菜单 UI（完整可运行）
- [x] UI 自动生成器（LoginUIBuilder、GameMainMenuBuilder）
- [x] 场景启动脚本（BootController、MainMenuController）
- [x] 缓动动画工具（TweenUtils）

## 待实现功能

### 优先级高
- [ ] 用户认证系统
- [ ] 游戏存档系统
- [ ] 排行榜系统
- [ ] 错误处理与日志

### 优先级中
- [ ] 聊天系统
- [ ] 好友系统
- [ ] 成就系统
- [ ] 配置系统

## 开发规范

1. **组件命名**: PascalCase，如 `PlayerController`
2. **脚本属性**: 使用 `@property` 装饰器，支持编辑器可视化配置
3. **场景命名**: 小写 + 中划线，如 `main-menu.scene`
4. **资源命名**: 小写 + 下划线，如 `player_sprite.png`

## 相关链接

- [Cocos Creator 官方文档](https://docs.cocos.com/creator/3.8/manual/zh/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
