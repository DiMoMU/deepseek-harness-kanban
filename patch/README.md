# patch/ — 补丁基线（原始 / 补丁后 bundle 成对存放）

安装脚本通过 **SHA-256 哈希** 比对本机 bundle 与基线：等于 `.new.js` 视为已安装（跳过），等于 `.old.js` 视为未安装（覆盖），都不匹配则警告（版本不一致或被其他工具改过）。

| 文件 | 说明 |
|---|---|
| `layout.old.js` | `@deepseek-ai/dsh-client-ui-layout@0.1.0-rc.6` 原始 `lib/client.js` |
| `layout.new.js` | 补丁后：三栏 → 四栏（`项目列表｜看板｜对话｜详情`） |
| `workspace.old.js` | `@deepseek-ai/dsh-client-ui-workspace@0.1.0-rc.6` 原始 `lib/client.js` |
| `workspace.new.js` | 补丁后：项目组内渲染模块复选框二级列表 |

## layout.new.js 改了什么

1. **grid 四轨**：`computeColumns(viewport, kanban, sidebar, details)`；`gridTemplateColumns: sidebar | kanban | center | details`；看板 0 时整列隐藏（无轨道）。
2. **新增 `kanban` slot**：`register()` 的 children 增加 `"kanban": { kind: "single", scope: "root" }`；AppFrame 在 sidebar 之后渲染 `renderSlot("kanban", …)`。
3. **布局 store**：`init` 增加 `kanban: 600`；`actions` 增加 `setKanban(px)`（clamp 480–760）、`toggleKanban()`。
4. **拖拽手柄**：看板手柄位于看板/对话交界（`left: sidebar + kanban`），侧栏手柄移到项目列表/看板交界（`left: sidebar`）。
5. **窄屏折叠**：viewport < 1024 时看板列自动收起；CSS 增加 `.kanbanCol` 与 `[data-kanban-collapsed]` 规则。
6. **`LayoutController`** 增加 `toggleKanban()`（供看板头部折叠按钮调用）。

## workspace.new.js 改了什么

1. 在 `WorkspaceBrowser` 的组渲染处，当 `kanbanMode()` 为真且组是真实工作区时，用 `KanbanModules` 替代会话行：
   - 二级列表 = 模块复选框（全选 / 每模块一行 / 新建模块输入）；
   - 勾选写入 `dsh.kanban.v1` 的 `filter[workspaceId]` 并派发 `dsh:kanban-change`；
   - 监听 `dsh:kanban-change` / `storage` 自行重渲染。
2. `ProjectRowItem` 的 `onToggle` 同时调用 `kanbanSetCurrent(workspaceId)`，实现“点项目 = 单项目切换看板”。
3. 看板模式开关：`localStorage["dsh.kanban.v1.enabled"] !== "false"` 时启用（默认开）。
4. Ungrouped 组（无 workspaceId）在看板模式下保留原会话行渲染，避免会话不可达。

## 如何为上游新版本重新生成基线

```powershell
# 1) 取新版本原始 bundle
npm pack @deepseek-ai/dsh-client-ui-layout@<版本> @deepseek-ai/dsh-client-ui-workspace@<版本>
tar -xzf <pkg>.tgz; cp package/lib/client.js patch/layout.old.js   # 同理 workspace

# 2) 手工把上述改动重放到新 bundle（CSS 哈希类名随构建变化，字符串锚点需按版本调整）

# 3) 更新 patch/layout.new.js、patch/workspace.new.js 与 manifest.json 的 target 版本

# 4) 运行 scripts/render-smoke.cjs（服务端渲染 KanbanPanel）与 install.ps1 -Force 自检
```

> 注：`layout.new.js` 中的 CSS 类名为构建期哈希（如 `pI_x6G_kanbanCol`），不同版本可能不同；补丁基于**代码结构锚点**而非类名，跨版本需人工核对。
