<p align="center">
  <img src="yulan.png" alt="yulan" />
</p>

# dsh-session-kanban · DSH 会话看板

**语言：[English](README.md) · [中文](README.zh-CN.md)**

> 为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）Web GUI 添加左侧“会话看板”列，附带一键安装 / 卸载 / 自检脚本，方便团队同步。

## 设计理念

- **项目 = DSH 工作区**：一个 Workspace 对应一个「项目」，每个会话就是一张任务卡片。
- **三列工作流**：待执行 / 执行中 / 已完毕是用户自定义的工作流状态，与 DSH 运行时状态（运行中 / 等待审批等）解耦。
- **模块 = 功能模块**：项目内的二级分组；看板严格「单项目」，避免跨项目信息噪音。
- **会话卡片 = 唯一交互入口**：点击打开、拖拽换状态、菜单做生命周期操作（重命名 / 分叉 / 归档 / 删除）。
- **对 DSH 数据只读**：状态 / 模块 / 筛选只存浏览器 localStorage，绝不改写会话日志；纯客户端插件 + 少量补丁，一键安装 / 卸载 / 回滚。

## 优势（项目管理）

- **项目全貌一眼可见**：某项目下所有会话按状态分列三列，进度一目了然。
- **模块化组织**：按功能模块分组 + 多选筛选，大型项目也能快速定位到某个模块的会话。
- **单项目聚焦**：一次只看一个项目，切换项目即切换看板，降低上下文切换成本。
- **拖拽即流转**：把卡片拖到「执行中 / 已完毕」即更新状态，比菜单操作更直观、更快。
- **会话即资产**：保留 DSH 原生重命名 / 分叉 / 归档并新增删除；看板只加一层工作流视图，不复制数据。
- **团队友好**：一键安装器、状态存浏览器、版本锁定的补丁基线可回滚，便于团队推广。

## 功能特性

- **四栏布局**：`项目列表 | 看板 | 对话 | 详情`——看板列位于项目列表右侧，480–760px 可拖拽调宽、可折叠、窄屏自动隐藏。
- **项目（一级）→ 模块复选框（二级）**：项目不再直接平铺会话；展开项目勾选模块（多选 / 全选 / 新建模块），**单项目查看**，不跨项目合并模块。
- **三列看板**（待执行 / 执行中 / 已完毕）：各列等宽、独立滚动；会话按模块分组，「未分组」始终显示；**归档后会话从看板隐藏**。
- **卡片操作**：会话名称独占整行；点击打开（打开后高亮）；拖拽换列（幽灵卡片 + 目标列高亮 + “松开以移动到…” + 落位闪烁）；`⋯` 菜单支持 **重命名 / 分叉 / 归档** 与模块选择，点外部或 Esc 即可关闭。
- **持久化**：状态 / 模块 / 筛选存浏览器 `localStorage`（`dsh.kanban.v1`），多标签页同步；不影响会话日志。

```
项目列表 | 看板（三列均分，各自滚动） | 对话 | 详情
  项目   │  待执行 │ 执行中 │ 已完毕
  ├ 模块 │  卡片: 状态点 + 会话名称(独占整行)
  ├ 勾选 │        模块徽标 / 时间 / 拖拽柄 / ⋯ 菜单
  └ 新建 │  · 点击打开 · 拖拽换列 · ＋新建会话
```

交互式布局示例（纯 HTML）：[docs/example.html](docs/example.html)

## 兼容性

- 目标版本 `@deepseek-ai/dsh` **0.1.0-rc.6**（Windows + Node.js）；安装脚本核验版本，不一致会明确提示（`-Force` 强制，风险自负）。
- 升级 dsh 会覆盖补丁 bundle，重跑 `install.cmd` 即可。

## 快速开始

```powershell
npm run build:dist   # 构建安装包 dist/dsh-session-kanban-installer.zip
# 或直接在仓库内执行
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/install.ps1 -Restart
# 然后刷新浏览器（F5）
```

| 脚本 | 作用 |
|---|---|
| `scripts/install.ps1` / `install.cmd` | 一键安装（幂等） |
| `scripts/uninstall.ps1` / `uninstall.cmd` | 一键卸载，恢复原界面 |
| `scripts/verify.ps1` / `verify.cmd` | 自检安装状态 |
| `scripts/restart.ps1` / `restart.cmd` | 重启 dsh web |

## 工作原理

见 [docs/architecture.md](docs/architecture.md)：slot 接线、`dsh.kanban.v1` 存储契约、性能方案、跨版本重建基线步骤。

## 常见问题

| 现象 | 处理 |
|---|---|
| 提示「版本不一致」 | 对齐 dsh 0.1.0-rc.6 后重装；或等维护者发布适配新版基线 |
| 提示「与基线均不匹配」 | `verify.ps1` 检查后 `install.ps1 -Force` |
| 安装后页面没变化 | 重启 dsh（配置行需重启）→ Ctrl+F5 → 看 `%TEMP%\dsh-kanban-web.err.log` |
| 看板空白 / 折叠后打不开 | 强制刷新；仍不行则 uninstall 后重装 |
| 升级 dsh 后失效 | 重跑 `install.cmd` |

## 许可与免责声明

MIT（见 [LICENSE](LICENSE)）。本仓库是对 npm 安装的 `@deepseek-ai` 包（MIT）的第三方改造，与 DeepSeek 官方无关联。安装会改写本机 DSH 安装树；卸载脚本与原始基线可完整还原。
