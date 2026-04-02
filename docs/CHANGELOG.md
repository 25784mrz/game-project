# 更新日志

## 2026-04-02 - 登录功能和主界面完成

### 新增功能

#### 1. 认证模块 (`src/modules/auth/AuthModule.ts`)
- ✅ 用户登录（用户名 + 密码）
- ✅ 用户注册（用户名 + 邮箱 + 密码）
- ✅ 游客模式
- ✅ 自动登录（本地存储 Token）
- ✅ 登出功能
- ✅ 登录状态持久化

**UI 特性：**
- 现代化渐变背景
- 毛玻璃效果卡片
- 登录/注册切换
- 表单验证
- 错误提示
- 加载状态

#### 2. 主界面模块 (`src/modules/mainmenu/MainMenuModule.ts`)
- ✅ 玩家信息展示（头像、用户名、等级）
- ✅ 开始游戏按钮
- ✅ 继续游戏按钮（有存档时显示）
- ✅ 排行榜入口
- ✅ 个人中心入口
- ✅ 设置面板
  - 音量调节
  - 画质选择
  - 语音控制开关
- ✅ 通知系统
- ✅ 退出登录

**UI 特性：**
- 渐变背景 + 粒子动画
- 顶部信息栏
- 动态按钮（悬停效果）
- 通知徽章
- 模态设置面板

#### 3. 后端认证服务 (`backend/server/auth_service.go`)
- ✅ 用户登录验证
- ✅ 用户注册
- ✅ Token 生成与验证
- ✅ 游客登录
- ✅ 会话管理
- ✅ 测试用户（test / 123456）

#### 4. WebSocket 认证消息
- ✅ `auth_login` - 登录请求/响应
- ✅ `auth_register` - 注册请求/响应
- ✅ `auth_logout` - 登出通知
- ✅ `auth_token` - Token 验证

#### 5. 应用路由系统
- ✅ 屏幕导航（auth → main → game）
- ✅ 模块懒加载
- ✅ 屏幕切换动画
- ✅ 状态管理

### 文件变更

**新增文件：**
- `frontend/src/modules/auth/AuthModule.ts` - 认证模块
- `frontend/src/modules/mainmenu/MainMenuModule.ts` - 主界面模块
- `frontend/public/index.html` - HTML 入口
- `backend/server/auth_service.go` - 认证服务

**修改文件：**
- `frontend/src/main.ts` - 添加路由系统
- `frontend/src/modules/network/NetworkManager.ts` - 添加认证消息类型
- `backend/server/server.go` - 集成认证服务
- `backend/server/server.go` - 添加认证消息处理

### 使用说明

#### 启动后端
```bash
cd backend
go mod tidy
go run main.go
```

#### 启动前端
```bash
cd frontend
npm install
npm run dev
```

#### 测试账号
- **正式登录**: 注册新账号
- **测试账号**: test / 123456
- **游客模式**: 点击"游客模式"按钮

### 下一步计划

1. **游戏存档系统** - 保存/读取游戏进度
2. **排行榜系统** - 分数排名
3. **个人中心** - 查看/编辑个人资料
4. **设置持久化** - 保存用户设置
5. **实际游戏内容** - 游戏逻辑实现

### 技术亮点

1. **MVVC 架构** - 清晰的分离关注点
2. **模块化设计** - 可独立加载/卸载
3. **事件驱动** - 松耦合通信
4. **本地持久化** - 自动登录
5. **响应式 UI** - 流畅的交互体验
6. **安全性** - Token 验证（生产环境需加强）
