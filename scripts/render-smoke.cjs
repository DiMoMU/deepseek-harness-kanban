// render-smoke.cjs — 服务端真实渲染 KanbanPanel，捕获渲染期崩溃（TDZ、引用错误等）。
// 用法: node scripts/render-smoke.cjs [可选的 plugin/client.js 路径]
// 依赖: 本机 DSH 安装树中的 react / react-dom（自动探测 npm-cache）；找不到时给出提示。
"use strict";
const path = require("path");
const fs = require("fs");

function findDshNodeModules() {
  const npxRoot = path.join(process.env.LOCALAPPDATA || "", "npm-cache", "_npx");
  if (!fs.existsSync(npxRoot)) return null;
  for (const dir of fs.readdirSync(npxRoot)) {
    const cand = path.join(npxRoot, dir, "node_modules");
    if (fs.existsSync(path.join(cand, "@deepseek-ai", "dsh", "lib", "bin.js"))) return cand;
  }
  return null;
}

const clientPath = path.resolve(process.argv[2] || path.join(__dirname, "..", "plugin", "client.js"));
const nm = findDshNodeModules();
if (!nm) {
  console.error("未找到 DSH 安装树（npm-cache），无法解析 react。请先启动过一次 dsh web，或传入插件路径。");
  process.exit(2);
}
const req = (id) => require(require.resolve(id, { paths: [nm] }));

// 浏览器桩（物化 bundle 需要）
global.window = {
  __ModuleLoader__: { load: (m) => { global.__registered = m; } },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  dispatchEvent: () => {}, addEventListener: () => {}, removeEventListener: () => {}
};
global.document = {
  querySelector: () => null,
  createElement: () => ({ dataset: {}, set textContent(v) {}, appendChild() {} }),
  head: { appendChild() {} }
};
global.CustomEvent = class { constructor(type) { this.type = type; } };

require(clientPath);
const m = global.__registered;
if (!m || m.id !== "@deepseek-ai/dsh-client-ui-kanban") throw new Error("bundle 未注册或 id 不匹配");

const surf = m.factory(req);
let comp = null;
const ctx = {
  slots: {
    inject: (name, cb) => cb(), // 立即执行，模拟 slot 已声明
    register: (spec, C) => { comp = C; return () => {}; }
  }
};
surf.apply(ctx);
if (typeof comp !== "function") throw new Error("未能捕获 KanbanPanel（register 未执行）");

// 看板状态与运行时数据桩
global.window.localStorage.getItem = () => JSON.stringify({
  meta: { s1: { status: "todo", module: "模块A" }, s2: { status: "doing", module: null } },
  modules: { w1: ["模块A", "模块B"] },
  filter: { w1: null },
  current: "w1"
});
const now = Date.now();
const sessionsState = {
  byId: {
    s1: { id: "s1", title: "会话1：环境搭建", blank: false, updatedAt: now - 120000 },
    s2: { id: "s2", title: "会话2：接口联调", blank: false, updatedAt: now - 60000 }
  },
  current: "s1",
  phase: "ready"
};
const workspacesState = { items: [{ workspaceId: "w1", title: "项目A", sessionIds: ["s1", "s2"] }] };
const useSessions = (sel) => sel(sessionsState);
const useWorkspaces = (sel) => sel(workspacesState);

const React = req("react");
const { renderToString } = req("react-dom/server");
const html = renderToString(React.createElement(comp, {
  useSessions, useWorkspaces, startSession() {}, open() {}, toggleKanban() {}
}));

if (!html.includes("dsh-kb-list") || !html.includes("dsh-kb-card")) {
  throw new Error("渲染输出缺少看板结构（三列/卡片）");
}
console.log("render-smoke OK — 输出 " + html.length + " 字符，含三列与卡片");
