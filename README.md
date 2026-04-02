# Game Project - 前后端分离游戏框架

## 项目结构

```
game-project/
├── frontend/                 # 前端 TypeScript (MVVC + 分包)
│   ├── src/
│   │   ├── core/            # 核心框架
│   │   ├── mvc/             # MVVC 基础类
│   │   ├── modules/         # 分包模块
│   │   └── utils/           # 工具类
│   └── config/
├── backend/                  # 后端 Go
│   ├── server/              # 服务器核心
│   ├── game/                # 游戏逻辑
│   └── network/             # 网络通信
└── docs/                    # 文档
```

## 技术栈

- **前端**: TypeScript + MVVC 框架 + 分包模式
- **后端**: Go + WebSocket
- **通信**: WebSocket 双向通信
- **资源**: 异步加载与引用计数释放

## 快速开始

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
go mod tidy
go run main.go
```

## 已完成功能

- [x] 主体框架搭建
- [x] 网络通信 (WebSocket)
- [x] 语音控制模块
- [x] 资源加载与释放系统
- [x] MVVC 基础架构
- [x] 分包模块系统
