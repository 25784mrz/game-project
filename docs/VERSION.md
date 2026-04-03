# Cocos Creator 版本说明

## 当前项目版本

**推荐引擎版本**: Cocos Creator **3.8.8**

## 版本兼容性

| 项目版本 | 最低引擎版本 | 推荐引擎版本 |
|---------|------------|------------|
| 1.0.0 | 3.8.0 | 3.8.8 |

## Cocos Creator 3.8.8 新特性

### 引擎更新

#### 新功能
- ✅ HarmonyOS Next 游戏控制器支持
- ✅ WebGL2/WebGPU 离屏 MSAA 支持
- ✅ Android 平台 16KB 内存页支持
- ✅ 配置更大的 BATCHER2D_MEM_INCREMENT

#### 优化
- ✅ 原生图像格式同步至 TS 层
- ✅ Android 构建动态库压缩控制
- ✅ 自定义管线默认资源和渲染开销优化
- ✅ 合并渲染通道逻辑
- ✅ HarmonyOS Next 平台设备类型属性

#### 修复
- ✅ HarmonyOS Next 音频播放报错
- ✅ HarmonyOS Next WASM 初始化失败
- ✅ Android removeDirectory 崩溃问题
- ✅ Spine skeletonCache 和 animCache 重置问题
- ✅ 精灵透明度无法修改
- ✅ 低帧率下粒子无法播放
- ✅ 物理引擎计算 nan 崩溃问题
- ✅ 更多稳定性修复...

## 升级指南

### 从 3.8.0 升级到 3.8.8

1. **下载 Cocos Creator 3.8.8**
   - 访问：https://www.cocos.com/creator-download
   - 下载并安装 3.8.8 版本

2. **打开项目**
   - 使用 Cocos Creator 3.8.8 打开项目
   - 项目会自动升级配置文件

3. **检查兼容性**
   - 查看控制台是否有升级警告
   - 测试场景和脚本是否正常运行

4. **更新依赖**
   - 检查 Spine 资源版本（建议升级到 4.2）
   - 更新第三方插件到兼容版本

### 从 3.7.x 升级到 3.8.x

参考官方升级指南：https://docs.cocos.com/creator/3.8/manual/zh/release-notes/upgrade-guide-v3.8.html

## 版本选择建议

### 选择 3.8.8 的理由

- ✅ **最新稳定版** - 包含所有最新修复和优化
- ✅ **HarmonyOS Next 支持** - 完整的鸿蒙系统支持
- ✅ **WebGPU 支持** - 实验性但功能完整
- ✅ **性能优化** - 多项渲染和内存优化
- ✅ **Spine 4.2 支持** - 最新骨骼动画版本

### 选择 3.8.0 的理由

- 📌 **稳定性优先** - 经过更长时间验证
- 📌 **兼容性更好** - 第三方插件支持更完善
- 📌 **学习资源多** - 教程和文档更丰富

## 项目配置

在 `assets/settings/project.json` 中设置：

```json
{
  "package_version": 2,
  "engine_version": "3.8.8"
}
```

## 下载链接

- **Cocos Creator 3.8.8**: https://www.cocos.com/creator-download
- **Cocos Dashboard**: https://www.cocos.com/creator-download
- **历史版本**: 通过 Cocos Dashboard 选择

## 更新日志

### 3.8.8 (2025-12-16)
- HarmonyOS Next 游戏控制器支持
- WebGL2/WebGPU 离屏 MSAA
- Android 16KB 内存页支持
- 多项稳定性修复

### 3.8.7 (2025-08-18)
- 2D 渲染排序（Sorting Layer）
- Global Uniform 支持
- 模块条件控制
- Spine 4.2 支持
- JSVM 浏览器调试

### 3.8.6 (2025-03-28)
- Spine 纹理集共享
- UISkew 组件
- Box2D JSB 支持
- Spine 4.2 支持
- Google Play 成就系统

### 3.8.5 (2024-12-26)
- 咪咕小游戏支持
- Google Play 平台支持
- 手动加载 Wasm/AsmJS
- 自定义管线 DOF 后效

### 3.8.4 (2024-10-12)
- WebGPU 实验性支持
- Tween 系统增强
- 可定制管线 Beta
- 淘宝小游戏优化

## 注意事项

### 升级前备份
- 备份项目文件夹
- 备份 git 仓库
- 记录当前版本号

### 已知问题
- Spine 4.2 需要重新导出资源
- WebGPU 仍在实验阶段
- 部分旧插件可能不兼容

### 测试清单
- [ ] 场景加载正常
- [ ] 脚本无报错
- [ ] UI 显示正确
- [ ] 动画播放正常
- [ ] 音频播放正常
- [ ] 构建无错误
- [ ] 目标平台测试通过

## 相关资源

- [官方文档](https://docs.cocos.com/creator/3.8/manual/zh/)
- [API 参考](https://docs.cocos.com/creator/3.8/api/zh/)
- [发布说明](https://www.cocos.com/creator-download)
- [官方论坛](https://forum.cocos.org/)
- [GitHub](https://github.com/cocos/cocos-engine)

---

**最后更新**: 2026-04-03
**维护者**: 项目团队
