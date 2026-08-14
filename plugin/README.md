# plugin/ — 看板插件 `@deepseek-ai/dsh-client-ui-kanban`

本目录是 DSH 浏览器端插件包（browser client plugin）的完整交付物。

## 为什么包名是 `@deepseek-ai/dsh-client-ui-kanban`

DSH 的浏览器插件加载机制以 **Loader 条目名** 为键：

- profile 配置（`cordis.patch.yml`）里的 `name: '@deepseek-ai/dsh-client-ui-kanban'` 决定 Loader 如何解析包；
- `dsh-client-modules` 的 Node 半端扫描启用条目，解析 `exports["./client"]` 并把 bundle 哈希写入启动图；
- 浏览器端 `window.__ModuleLoader__.load({ id, factory })` 的 **`id` 必须与包名一致**（模块表按 id 寻址）。

因此该包名不能随意更改；它是 DSH 模块系统的一部分，而非对官方命名空间的冒用。改名需同步改三处：`package.json`、`client.js` 的 `id`、profile 配置行的 `name`。

## 目录

```
plugin/
├── package.json   插件清单（exports["./client"]、dsh.client.platform: web）
├── index.js       Node 半端（空 apply 占位，使 Loader 条目合法）
└── client.js      浏览器 bundle（可读、未压缩、带注释）——即最终分发物
```

## Bundle 约定（阅读 client.js 前先看）

`client.js` 是手写维护的构建产物，遵循 DSH 惰性 CJS 模块约定：

```js
window.__ModuleLoader__.load({
    id: "@deepseek-ai/dsh-client-ui-kanban",
    factory: (require) => {
        // require 的 id 解析到模块表（平台种子 / 已注册插件 surface）
        let react_jsx_runtime = require("react/jsx-runtime");
        let react = require("react");
        // 物化时注入 CSS（data-plugin-css 防重复）
        // 组件 / 存储契约 / 业务逻辑
        const inject = ["slots", "sessions", "workspaces", "layout"];
        function apply(ctx) { /* ctx.slots.inject('kanban', …) 注册 KanbanPanel */ }
        exports.apply = apply;
        exports.inject = inject;
        return module.exports;
    }
});
```

要点：

- 组件从 `register` 的 props 拿**全局 hooks**（`useSessions` / `useWorkspaces`）与 **inject factory 返回的业务回调**（`startSession` / `open` / `toggleKanban`），不直接 import 运行时；
- `apply` 通过 `ctx.slots.inject("kanban", …)` 等待 `ui-layout` 补丁声明的 `kanban` slot 后再注册；
- 数据读写走 `localStorage["dsh.kanban.v1"]` + 事件 `dsh:kanban-change` / `storage`（契约见 docs/architecture.md）。

## 修改后如何生效

bundle 由 `dsh-client-modules` 按请求从磁盘提供：改完 `client.js`，**刷新浏览器页面即可**，无需重启服务。若改了 profile 配置行或新增服务，则需要重启 `dsh web`。
