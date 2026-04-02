# 项目开发日志

## 2026-04-02 - 初始框架搭建

### 完成内容

#### 前端 (TypeScript)
1. **核心框架**
   - EventSystem.ts - 全局事件总线，支持订阅/发布模式
   - ResourceManager.ts - 资源管理器，引用计数 + 异步加载
   - ModuleLoader.ts - 模块加载器，支持分包和依赖管理

2. **MVVC 架构**
   - Model.ts - 数据层基类
   - View.ts - 视图层基类
   - ViewModel.ts - 视图模型基类
   - Controller.ts - 控制器基类

3. **功能模块**
   - NetworkManager.ts - WebSocket 客户端，自动重连
   - AudioController.ts - 语音控制 (TTS/STT/音效)
   - GameModule.ts - 游戏模块示例 (完整 MVVC 实现)

4. **工具**
   - helpers.ts - 常用工具函数 (防抖/节流/深拷贝等)
   - types/index.ts - TypeScript 类型定义

#### 后端 (Go)
1. **服务器核心**
   - server.go - WebSocket 服务器，支持多客户端
   - main.go - 程序入口

2. **游戏管理**
   - game.go - 游戏实例管理 (状态/玩家/分数)
   - game_manager.go - 游戏管理器

3. **服务**
   - resource_manager.go - 资源管理
   - audio_service.go - 语音服务

### 技术特点

1. **前后端分离** - 清晰的分层架构
2. **分包模式** - 模块可独立加载/卸载
3. **解耦设计** - 事件驱动，模块间低耦合
4. **语音控制** - 完整的语音输入输出支持
5. **资源管理** - 引用计数，自动释放

### 文件路径

```
game-project/
├── frontend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── core/
│   │   ├── mvc/
│   │   ├── modules/
│   │   ├── utils/
│   │   └── types/
│   ├── public/
│   └── config/
├── backend/
│   ├── server/
│   └── game/
└── docs/
```

### 下一步计划

1. 实现用户认证系统
2. 添加游戏存档功能
3. 实现排行榜系统
4. 完善错误处理和日志
5. 添加性能监控

### 备注

- 前端需要运行 `npm install` 安装依赖
- 后端需要运行 `go mod tidy` 下载依赖
- WebSocket 端口：8080
- 前端开发服务器端口：3000
