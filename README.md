# dsh-session-kanban

> A session kanban column for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) Web UI — with a one-click installer that patches the stock `dsh web` bundles.
>
> 为 DSH Web GUI 添加左侧“会话看板”列：三列等宽可滚动列表（待执行 / 执行中 / 已完毕）、按项目模块筛选、拖拽换列、看板内新建会话。附带一键安装 / 卸载 / 自检脚本，供团队内快速同步。

## 功能特性

- **四栏布局**：`项目列表 | 看板 | 对话 | 详情`——看板列位于项目列表右侧，480–760px 可拖拽调宽、可折叠、窄屏自动隐藏。
- **项目列表（一级）→ 模块复选框（二级）**：项目不再直接平铺会话；展开项目勾选模块（多选 / 全选 / 新建模块），**单项目查看**，不能跨项目合并模块。
- **三列看板**：待执行 / 执行中 / 已完毕，各列等宽、独立滚动；会话按模块分组展示，「未分组」始终可见。
- **卡片交互**：会话名称独占整行；点击卡片打开会话（打开后高亮）；拖拽换列（幽灵卡片 + 目标列高亮 + “松开以移动到…”提示 + 落位闪烁）；看板内「＋新建会话」。
- **持久化**：状态 / 模块 / 筛选存于浏览器 `localStorage`（键 `dsh.kanban.v1`），多标签页同步；不影响会话日志本身。

```
项目列表(最左) │ 看板(三列均分，各自滚动) │ 对话 │ 详情
  项目(一级)   │  待执行 │ 执行中 │ 已完毕
   ├ 模块复选框 │  卡片两行排版:
   ├ 全选/新建  │   第一行: 状态点 + 会话名称(独占整行)
   └ 新建模块   │   第二行: 模块徽标 / 时间 / 拖拽柄 / 菜单
               │  · 点击卡片打开会话 · 拖拽换列 · ＋新建会话
```

交互式布局示例（纯 HTML，双击打开即可体验拖拽与勾选）：[docs/example.html](docs/example.html)

## 兼容性

- 目标版本：`@deepseek-ai/dsh` **0.1.0-rc.6**（Windows + Node.js）。
- 安装脚本会核验本机 bundle 版本与补丁基线，版本不一致会明确提示（可 `-Force` 强制，风险自负）。
- 升级 `@deepseek-ai/dsh` 会覆盖补丁 bundle，重跑 `install.cmd` 即可重新应用。

## 快速开始

```powershell
# 1. 从源码构建一键安装包（输出 dist/dsh-session-kanban-installer.zip）
npm run build:dist        # 或 powershell -File scripts/build-dist.ps1

# 2. 把 zip 解压到任意目录，双击 install.cmd（自动核验版本→打补丁→装插件→写配置→重启 dsh）
# 3. 刷新浏览器页面（F5）
```

或直接在仓库内执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/install.ps1 -Restart
```

| 脚本 | 作用 |
|---|---|
| `scripts/install.ps1` / `install.cmd` | 一键安装（幂等，可重复执行） |
| `scripts/uninstall.ps1` / `uninstall.cmd` | 一键卸载，恢复原界面 |
| `scripts/verify.ps1` / `verify.cmd` | 自检：布局补丁 / 项目列表补丁 / 插件包 / 配置行 |
| `scripts/restart.ps1` / `restart.cmd` | 重启 dsh web（`-Workspace` 指定工作目录） |

> 想先预览再安装：`docs/example.html` 是完整交互原型（三区拖拽、模块勾选、新建会话、localStorage 持久化）。

## 工作原理（摘要）

详见 [docs/architecture.md](docs/architecture.md)。

- **插件**：`plugin/client.js` 是浏览器端 bundle（遵循 DSH 惰性 CJS 模块约定 `window.__ModuleLoader__.load({id, factory})`），注册进 `ui-layout` 补丁声明的 `kanban` slot；`apply` 通过 `ctx.slots.inject('kanban', …)` 挂载，业务回调（`startSession` / `open` / `toggleKanban`）经 inject factory 注入。
- **布局补丁**（`patch/layout.new.js`）：三栏 grid → 四栏，新增 `kanban` 轨、slot、store（`kanban: 600`，clamp 480–760）、拖拽手柄与窄屏折叠。
- **项目列表补丁**（`patch/workspace.new.js`）：在看板模式下，工作区组内渲染模块复选框二级列表（`KanbanModules`），项目行点击同步“当前项目”。
- **存储契约**：`localStorage["dsh.kanban.v1"]` + 窗口事件 `dsh:kanban-change`（同页）+ `storage`（跨标签页），两个补丁与插件共享。
- **性能**：拖拽提示条常驻挂载（零 DOM 增删）、共享“悬停列”状态 + rAF 节流、列表 `react.memo` 化、分组结果 `useMemo`、稳定回调。

## 目录结构

```
├── plugin/           看板插件（浏览器 bundle + Node 半端 + package.json）
├── patch/            补丁基线：layout / workspace 的原始(.old)与补丁后(.new) bundle
├── scripts/          安装 / 卸载 / 自检 / 重启 + 构建安装包
├── docs/             架构说明 + 交互式示例
├── manifest.json     安装包版本与文件清单
└── package.json      仓库元数据（npm run build:dist）
```

## 常见问题

| 现象 | 处理 |
|---|---|
| 提示「版本不一致」 | 本机 dsh 不是 0.1.0-rc.6，先用 `npx -p @deepseek-ai/dsh@0.1.0-rc.6 dsh web` 对齐，或等维护者发布适配新版基线 |
| 提示「与基线均不匹配」 | bundle 被其他工具改过或版本不同；`verify.ps1` 确认后 `install.ps1 -Force` |
| 安装后页面没变化 | ① 确认已重启 dsh（配置行需重启加载）；② Ctrl+F5 强制刷新；③ 看 `%TEMP%\dsh-kanban-web.err.log` |
| 看板空白（渲染失败） | 多为旧缓存：Ctrl+F5；仍不行则 uninstall 后重装 |
| 看板列顺序反了 | 仓库内 `patch/layout.new.js` 已是正确顺序（项目列表在前）；重跑 install 会按基线校验修正 |

## 许可证与免责声明

- 本仓库 MIT 许可（见 [LICENSE](LICENSE)）。
- 补丁对象为 npm 安装的 `@deepseek-ai/dsh-client-ui-layout` / `dsh-client-ui-workspace`（MIT），本仓库仅包含对既定版本（0.1.0-rc.6）的构建产物改动，与 DeepSeek 官方无关联，不提供官方支持。
- 安装脚本会改写本机 DSH 安装树（npm-cache 下 bundle）并新增插件包与 profile 配置；卸载脚本与原始基线可完整还原。**安装前请确认目标机器 dsh 版本为 0.1.0-rc.6 并自行备份。**
