# 架构说明

本文解释看板改造如何接入 DSH 的浏览器插件系统，以及数据契约。适合想二次开发或移植到新版本的读者。

## 1. 总览

```
┌─ 浏览器 ────────────────────────────────────────────────────────────┐
│ AppFrame(ui-layout 补丁)                                            │
│   grid: sidebar | kanban | conversation | details                   │
│     ├─ sidebar.workspaces  ← WorkspaceBrowser(ui-workspace 补丁)     │
│     │     项目(一级) → 模块复选框(二级) KanbanModules                 │
│     └─ kanban(新 slot)    ← KanbanPanel(本插件)                      │
│           三列: 待执行 | 执行中 | 已完毕                              │
│           存储契约: localStorage["dsh.kanban.v1"] + 事件              │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Slot 接线

- `ui-layout` 补丁在 `register({ name: "root", children: { kanban: {...}, sidebar, conversation, details, "shell.overlay" } })` 中声明 `kanban` slot（single, scope root）。
- 插件 `apply(ctx)` 调用 `ctx.slots.inject("kanban", () => ctx.slots.register({ name: "kanban", inject: … }, KanbanPanel))`——slot 声明在账本上后注册即生效，声明折叠自动注销。
- `register` 的组件会收到四类 props：
  - 全局 hooks：`useSessions` / `useWorkspaces`（运行时绑定 selector）；
  - 业务 props：inject factory 返回的 `startSession(workspaceId)`、`open(sessionId)`、`toggleKanban()`；
  - 服务注入声明：`const inject = ["slots", "sessions", "workspaces", "layout"]`。

## 3. 存储契约（插件与 ui-workspace 补丁共享）

`localStorage["dsh.kanban.v1"]`（单 JSON 对象）：

```jsonc
{
  "meta":    { "<sessionId>": { "status": "todo|doing|done", "module": "<模块名>|null" } },
  "modules": { "<workspaceId>": ["模块A", "模块B"] },   // 每项目模块注册表（用户新建）
  "filter":  { "<workspaceId>": ["模块A"] | null },     // null = 全选
  "current": "<workspaceId>",                           // 看板当前单项目
  "hidden":  ["<sessionId>"]                            // （预留）从看板隐藏
}
```

同步事件：

- 同页：任意写后 `window.dispatchEvent(new CustomEvent("dsh:kanban-change"))`；
- 跨标签页：浏览器 `storage` 事件；
- 双方（插件 / 项目列表补丁）都监听并重读，写入时若内容未变则不重复派发。

看板模式开关：`localStorage["dsh.kanban.v1.enabled"] !== "false"`（默认开）。

## 4. 状态语义

- 三区是**用户自定义工作流状态**，与 DSH 运行时状态（running / pendingInteraction）相互独立；
- 无 meta 的会话默认视为「待执行」，因此选中模块后其全部会话都会出现在看板；
- 模块为 null 的会话归「未分组」，**始终显示**（不受模块筛选影响）；
- 看板为**单项目视图**：只渲染 `current` 工作区的会话；项目列表里其他项目的会话不进入看板（跨项目拖拽被忽略）。

## 5. 渲染与性能

- 三列表等宽（`flex: 1 1 0`），各自 `overflow-y: auto` 独立滚动；
- `zoneItems` 用 `useMemo`（依赖 `ws/list/meta/sel/hidden`），跨渲染引用稳定；
- `KanbanList` 用 `react.memo` 包裹，回调全部 `useCallback` 稳定化 → 悬停切换只重渲染受影响的一列；
- **拖拽悬停**：不做 DOM 增删。提示条常驻挂载（`.show` 切换 `height/opacity`）；“当前悬停列”为插件级状态，取**最后一次 dragover**（rAF 节流到每帧一次），不存在 dragleave 抖动；
- 拖拽图像：`setDragImage` 使用克隆的卡片节点；原卡片加 `.dragging`（变淡 + 微旋转）。

## 6. 关键教训（防回归）

1. **TDZ（暂时性死区）**：hooks 依赖数组引用其后 `const` 声明的变量会在定义时抛错——派生值必须先于依赖它的 `useCallback` 声明。回归防护：`scripts/render-smoke.cjs` 用 `react-dom/server` 真实渲染 `KanbanPanel`（桩掉 hooks 与业务 props）。
2. **React key 警告**：children 数组字面量需显式 key（开发模式噪音，不影响功能）。
3. **编码**：PowerShell 5.1 读无 BOM 的 UTF-8 中文会乱码——.ps1 用 UTF-8 BOM，JSON 读取显式 `-Encoding UTF8`。
4. **基线哈希**：补丁跨版本必须重建基线（`.old/.new`），安装脚本以哈希比对为准，不做盲覆盖。

## 7. 安装器如何工作

`scripts/install.ps1`：

1. 探测 DSH 安装树（npm-cache 下含 `@deepseek-ai/dsh/lib/bin.js` 的目录）；
2. 核验 `dsh-client-ui-layout` 版本 = `manifest.json` 的 `target.layout`；
3. 对两个 bundle 做哈希比对（已装跳过 / 未装覆盖 / 不匹配警告或 `-Force`）；
4. 拷贝插件包到 `%USERPROFILE%\.dsh\profiles\node_modules\@deepseek-ai\dsh-client-ui-kanban`（flat fallback，profile 可解析）；
5. 幂等写入 `cordis.patch.yml` 的 `ui-kanban` 行；
6. `-Restart` 时调用 `restart.ps1`（按端口 3080 重启并健康探测）。

回滚（`uninstall.ps1`）反向执行：恢复 `.old.js`、删配置行、删插件包；浏览器 localStorage 数据保留。
