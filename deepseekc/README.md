# DSH 会话看板改造 · 一键安装包（v1.1.0）

为 DSH Web GUI（http://127.0.0.1:3080）新增左侧「会话看板」：

```
项目列表(最左) │ 看板(三列均分，各自滚动) │ 对话 │ 详情
  项目(一级)   │  待执行 │ 执行中 │ 已完毕
   ├ 模块复选框 │  卡片两行排版:
   ├ 全选/新建  │   第一行: 状态点 + 会话名称(独占整行)
   └ 新建模块   │   第二行: 模块徽标 / 时间 / 拖拽柄 / 菜单
               │  · 点击卡片打开会话（打开后高亮）
               │  · 拖拽换列：幽灵卡片 + 目标列高亮 + “松开以移动到…”提示
               │  · ＋新建会话（落入当前项目·待执行）
```

- 项目列表不再直接平铺会话；展开项目显示**模块复选框（二级）**，勾选决定看板显示哪些模块的会话（多选/全选/新建模块），**单项目查看**。
- 看板列在**项目列表右侧**，可拖拽调宽（480–760px）、可折叠，窄屏自动隐藏。
- 看板状态/模块/筛选保存在浏览器 `localStorage`（键 `dsh.kanban.v1`），不影响会话本身。

## 环境要求

- Windows + 已安装 Node.js
- 已用 `npx @deepseek-ai/dsh`（或 `dsh`）启动过至少一次 **web** 界面
- 目标版本：`@deepseek-ai/dsh` **0.1.0-rc.6**（安装脚本会核验，版本不同会提示）

## 安装（一键）

1. 解压本安装包到任意目录（如 `D:\dsh-kanban-installer`）；
2. 双击 **`install.cmd`**（或命令行执行 `powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1`）；
3. 脚本自动：从 npm 全局安装或 npx 缓存探测 DSH 安装树 → 核验版本 → 应用两份补丁 → 安装看板插件 → 写入 profile 配置；
4. 默认会**自动重启 dsh web** 并等待就绪；
5. 刷新浏览器页面（**F5**），左侧即为「项目列表 + 看板」。

> 不想要自动重启：命令行执行 `install.ps1` 不带 `-Restart`，之后用你自己的启动器重启 dsh，或双击 `restart.cmd`。

## 卸载（恢复原界面）

双击 **`uninstall.cmd`**，或 `powershell -NoProfile -ExecutionPolicy Bypass -File .\uninstall.ps1`。
会恢复原始布局/会话浏览器、移除配置行、删除插件包；**看板数据保留在浏览器**（如需清空，删除浏览器 localStorage 键 `dsh.kanban.v1` 即可）。

## 自检

双击 **`verify.cmd`**（或 `powershell -NoProfile -ExecutionPolicy Bypass -File .\verify.ps1`），查看四项目前状态：布局补丁 / 项目列表补丁 / 插件包 / 配置行，并给出总体结论。

## 重启（单独使用）

双击 **`restart.cmd`**，或 `powershell -NoProfile -ExecutionPolicy Bypass -File .\restart.ps1 -Workspace <你平时启动dsh的目录>`。
`-Workspace` 决定重启后 dsh 的沙箱工作目录（默认脚本所在目录）。

## 常见问题

| 现象 | 处理 |
|---|---|
| 提示「版本不一致」 | 本机 dsh 不是 0.1.0-rc.6。先 `npm i -g @deepseek-ai/dsh@0.1.0-rc.6` 或 `npx -p @deepseek-ai/dsh@0.1.0-rc.6 dsh web` 对齐版本后重装；或让维护者发布适配新版基线 |
| 提示「与基线均不匹配」 | bundle 可能被其他工具改过或版本不同。确认版本后加 `-Force` 重装；不确定就先 `verify.cmd` 检查 |
| 安装后页面没变化 | ① 确认已重启 dsh（配置行需要重启加载）；② 强制刷新（Ctrl+F5）；③ 看 `%TEMP%\dsh-kanban-web.err.log` |
| 看板列在最左侧（顺序反了） | 本包内补丁基线已是正确顺序（项目列表在前、看板在右侧）。重跑一次 `install.cmd` 会按基线校验并修正 |
| 看板空白（渲染失败） | 多为旧版缓存或加载异常：强制刷新（Ctrl+F5）；仍不行则 `uninstall.cmd` 后再 `install.cmd` |
| 升级了 @deepseek-ai/dsh | bundle 会被覆盖，**重新运行 `install.cmd` 即可**（基线不匹配会明确提示） |
| 想手动看改动内容 | 补丁/插件源码在 `patch/` 与 `plugin/`，基线成对（`*.old.js`=原始，`*.new.js`=改后） |

## 文件说明

```
install.cmd / install.ps1      一键安装（核验版本→打补丁→装插件→写配置→可选重启）
dsh-root.ps1                   npm 全局安装 / npx 缓存的统一 DSH 路径探测
uninstall.cmd / uninstall.ps1  卸载回滚
verify.cmd / verify.ps1        自检当前安装状态
restart.cmd / restart.ps1      重启 dsh web
manifest.json                  目标版本与文件清单
patch/layout.old.js            dsh-client-ui-layout 原始 bundle
patch/layout.new.js            四栏化补丁 bundle（项目列表|看板|对话|详情）
patch/workspace.old.js         dsh-client-ui-workspace 原始 bundle
patch/workspace.new.js         项目→模块复选框二级列表补丁 bundle
plugin/                        @deepseek-ai/dsh-client-ui-kanban 看板插件包
```

## 免责提示

安装包直接改写 DSH 安装树（npm-cache 下 `@deepseek-ai/dsh-client-ui-layout` / `dsh-client-ui-workspace` 的 bundle）并新增插件包与 profile 配置，属于对第三方 npm 安装内容的修改：升级 dsh 会覆盖改动，需重装；回滚脚本与原始基线可完整还原。安装前建议确认本机 dsh 版本为 0.1.0-rc.6。
