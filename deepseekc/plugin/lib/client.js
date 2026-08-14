window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-kanban",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		/* ── styles ─────────────────────────────────────────── */
		const css = ".dsh-kb{display:flex;flex-direction:column;height:100%;min-width:0}.dsh-kb-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:13px;font-weight:600;white-space:nowrap;flex:none}.dsh-kb-head-spacer{flex:1}.dsh-kb-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);border-radius:8px;height:26px;padding:0 8px;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}.dsh-kb-btn:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}.dsh-kb-btn.primary{background:var(--dsw-alias-accent,#2f6fed);border-color:transparent;color:#fff}.dsh-kb-btn:disabled{opacity:.5;cursor:default}.dsh-kb-hint{color:var(--dsw-alias-label-secondary);font-size:12.5px;padding:18px 16px;text-align:center;line-height:1.7}.dsh-kb-lists{flex:1;display:flex;overflow:hidden;min-height:0}.dsh-kb-lists.dragging .dsh-kb-list{opacity:.5;transition:opacity .15s ease}.dsh-kb-lists.dragging .dsh-kb-list.drag-over{opacity:1}.dsh-kb-list{flex:1 1 0;min-width:0;display:flex;flex-direction:column;border-right:1px solid var(--dsw-alias-border-l1)}.dsh-kb-list:last-child{border-right:none}.dsh-kb-list.drag-over{background:rgba(47,111,237,.05)}.dsh-kb-list-head{display:flex;align-items:center;gap:6px;padding:8px 10px;font-size:12px;font-weight:700;letter-spacing:.02em;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;transition:background .12s ease,border-color .12s ease}.dsh-kb-list.drag-over .dsh-kb-list-head{background:rgba(47,111,237,.16);border-color:var(--dsw-alias-accent,#2f6fed)}.dsh-kb-dot{width:8px;height:8px;border-radius:50%;flex:none}.dsh-kb-count{margin-left:auto;color:var(--dsw-alias-label-secondary);font-weight:600;font-size:11px}.dsh-kb-drop-hint{box-sizing:border-box;flex:none;height:0;overflow:hidden;margin:0 6px;padding:0 8px;font-size:11.5px;line-height:16px;color:var(--dsw-alias-accent,#2f6fed);border:1.5px dashed transparent;border-radius:8px;opacity:0;transition:height .12s ease,padding .12s ease,opacity .12s ease}.dsh-kb-drop-hint.show{height:30px;padding:5px 8px;opacity:1;border-color:var(--dsw-alias-accent,#2f6fed);background:rgba(47,111,237,.06)}.dsh-kb-list-body{flex:1;overflow-y:auto;padding:6px;display:flex;flex-direction:column;gap:6px;min-height:0}.dsh-kb-empty{color:var(--dsw-alias-label-secondary);font-size:11px;text-align:center;padding:12px 0}.dsh-kb-group{font-size:11px;color:var(--dsw-alias-label-secondary);padding:4px 2px 0;font-weight:600;flex:none}.dsh-kb-card{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:7px 9px;font-size:12.5px;cursor:grab;position:relative;display:flex;flex-direction:column;gap:5px;flex:none;transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease,opacity .12s ease}.dsh-kb-card:hover{border-color:var(--dsw-alias-accent,#2f6fed);box-shadow:0 2px 8px rgba(27,36,54,.1);transform:translateY(-1px)}.dsh-kb-card.open{border-color:var(--dsw-alias-accent,#2f6fed);background:rgba(47,111,237,.08);box-shadow:0 0 0 1px rgba(47,111,237,.22)}.dsh-kb-card.open .dsh-kb-card-title{color:var(--dsw-alias-accent,#2f6fed)}.dsh-kb-card.dragging{opacity:.35;transform:rotate(2deg) scale(.98)}.dsh-kb-card.flash{animation:dsh-kb-flash .9s ease}.dsh-kb-card-row1{display:flex;align-items:center;gap:6px;min-width:0}.dsh-kb-card-row2{display:flex;align-items:center;gap:6px;min-width:0}.dsh-kb-card-grow{flex:1}.dsh-kb-card-dot{width:7px;height:7px;border-radius:50%;flex:none}.dsh-kb-card-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary)}.dsh-kb-grip{opacity:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1;cursor:grab;flex:none;transition:opacity .12s ease;user-select:none}.dsh-kb-card:hover .dsh-kb-grip,.dsh-kb-card.dragging .dsh-kb-grip{opacity:1}.dsh-kb-chip{font-size:10.5px;color:var(--dsw-alias-accent,#2f6fed);background:rgba(47,111,237,.1);border-radius:999px;padding:1px 7px;white-space:nowrap;flex:none}.dsh-kb-chip.none{color:var(--dsw-alias-label-secondary);background:rgba(27,36,54,.06)}.dsh-kb-card-time{font-size:10.5px;color:var(--dsw-alias-label-secondary)}.dsh-kb-menu-btn{border:none;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:5px;width:20px;height:20px;font-size:13px;line-height:1;flex:none;padding:0}.dsh-kb-menu-btn:hover{background:rgba(27,36,54,.08);color:var(--dsw-alias-label-primary)}.dsh-kb-menu{position:absolute;right:8px;top:32px;z-index:30;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;box-shadow:0 12px 32px rgba(27,36,54,.14);padding:8px;display:flex;flex-direction:column;gap:6px;width:160px}.dsh-kb-menu label{font-size:11px;color:var(--dsw-alias-label-secondary)}.dsh-kb-menu select{width:100%;font-size:12px;padding:3px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}.dsh-kb-foot{padding:6px 10px;font-size:11px;color:var(--dsw-alias-label-secondary);border-top:1px solid var(--dsw-alias-border-l1);flex:none;text-align:center;user-select:none}@keyframes dsh-kb-flash{0%{background:rgba(47,111,237,.28);box-shadow:0 0 0 2px rgba(47,111,237,.35)}100%{background:var(--dsw-alias-bg-base);box-shadow:none}}";
		const tagId = "@deepseek-ai/dsh-client-ui-kanban/kanban.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-kanban";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		/* ── shared storage contract (also read by the ui-workspace patch) ── */
		const KANBAN_KEY = "dsh.kanban.v1";
		const ZONES = [
			{ id: "todo", label: "待执行", color: "#2f6fed" },
			{ id: "doing", label: "执行中", color: "#d97706" },
			{ id: "done", label: "已完毕", color: "#0f766e" }
		];
		function readState() {
			try {
				const raw = window.localStorage.getItem(KANBAN_KEY);
				if (raw) {
					const p = JSON.parse(raw);
					if (p && typeof p === "object") return p;
				}
			} catch (e) { /* ignore */ }
			return {};
		}
		function writeState(next) {
			try { window.localStorage.setItem(KANBAN_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
			window.dispatchEvent(new CustomEvent("dsh:kanban-change"));
		}
		/* ── helpers ────────────────────────────────────────── */
		function timeAgo(ts, now) {
			if (!ts) return "";
			const diff = Math.max(0, now - ts);
			const m = Math.floor(diff / 60000);
			if (m < 1) return "刚刚";
			if (m < 60) return m + "分钟前";
			const h = Math.floor(m / 60);
			if (h < 24) return h + "小时前";
			const d = Math.floor(h / 24);
			if (d < 30) return d + "天前";
			const mo = Math.floor(d / 30);
			if (mo < 12) return mo + "个月前";
			return Math.floor(mo / 12) + "年前";
		}
		function displayTitle(node) {
			return node.blank ? "新会话" : node.title || node.id;
		}
		/* ── components ─────────────────────────────────────── */
		function KanbanCard({ id, node, module, time, zoneColor, mods, current, flash, onOpen, onSetModule }) {
			const [menuOpen, setMenuOpen] = react.useState(false);
			const title = displayTitle(node);
			const onDragStart = (e) => {
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", id);
				e.currentTarget.classList.add("dragging");
				const ghost = e.currentTarget.cloneNode(true);
				ghost.style.position = "fixed";
				ghost.style.left = "-9999px";
				ghost.style.top = "0";
				ghost.style.width = "230px";
				ghost.style.opacity = ".92";
				ghost.style.transform = "rotate(2deg)";
				ghost.style.pointerEvents = "none";
				ghost.style.zIndex = "9999";
				document.body.appendChild(ghost);
				e.dataTransfer.setDragImage(ghost, 16, 16);
				window.setTimeout(() => { ghost.remove(); }, 0);
			};
			return react_jsx_runtime.jsx("div", {
				className: "dsh-kb-card" + (current === id ? " open" : "") + (flash ? " flash" : ""),
				draggable: true,
				"data-session": id,
				title: "点击打开会话；拖拽可移动到其他列表",
				onClick: () => onOpen(id),
				onDragStart,
				onDragEnd: (e) => {
					e.currentTarget.classList.remove("dragging");
				},
				children: [
					react_jsx_runtime.jsx("div", {
						className: "dsh-kb-card-row1",
						children: [
							react_jsx_runtime.jsx("span", {
								className: "dsh-kb-card-dot",
								style: { background: zoneColor }
							}, "kb-dot"),
							react_jsx_runtime.jsx("span", {
								className: "dsh-kb-card-title",
								children: title
							}, "kb-title")
						]
					}),
					react_jsx_runtime.jsx("div", {
						className: "dsh-kb-card-row2",
						children: [
							react_jsx_runtime.jsx("span", {
								className: "dsh-kb-chip" + (module ? "" : " none"),
								children: module || "未分组"
							}, "kb-chip"),
							react_jsx_runtime.jsx("span", {
								className: "dsh-kb-card-time",
								children: time
							}, "kb-time"),
							react_jsx_runtime.jsx("span", { className: "dsh-kb-card-grow" }, "kb-grow"),
							react_jsx_runtime.jsx("span", {
								className: "dsh-kb-grip",
								"aria-hidden": true,
								children: "⠿"
							}, "kb-grip"),
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: "dsh-kb-menu-btn",
								"aria-label": "卡片菜单",
								onClick: (e) => {
									e.stopPropagation();
									setMenuOpen((v) => !v);
								},
								children: "⋯"
							}, "kb-menu-btn")
						]
					}),
					menuOpen && react_jsx_runtime.jsx("div", {
						className: "dsh-kb-menu",
						children: [
							react_jsx_runtime.jsx("label", { children: "功能模块" }, "kb-menu-label"),
							react_jsx_runtime.jsx("select", {
								value: module || "__none__",
								onChange: (e) => {
									onSetModule(id, e.target.value === "__none__" ? null : e.target.value);
									setMenuOpen(false);
								},
								children: [
									react_jsx_runtime.jsx("option", { value: "__none__", children: "未分组" }, "kb-opt-none"),
									mods.map((m) => react_jsx_runtime.jsx("option", { value: m, children: m }, m))
								]
							}, "kb-menu-select")
						]
					})
				]
			});
		}
		const KanbanList = react.memo(function KanbanList({ zone, items, mods, sel, current, flash, hovered, onOpen, onSetModule, onDropSession, onHover }) {
			const now = Date.now();
			const groups = [];
			const ungrouped = [];
			for (const item of items) {
				if (item.mod) {
					let g = groups.find((x) => x.name === item.mod);
					if (!g) {
						g = { name: item.mod, items: [] };
						groups.push(g);
					}
					g.items.push(item);
				} else {
					ungrouped.push(item);
				}
			}
			groups.sort((a, b) => mods.indexOf(a.name) - mods.indexOf(b.name));
			const card = (item) => react_jsx_runtime.jsx(KanbanCard, {
				id: item.id,
				node: item.node,
				module: item.mod,
				time: timeAgo(item.node && item.node.updatedAt, now),
				zoneColor: zone.color,
				mods,
				current,
				flash: flash === item.id,
				onOpen,
				onSetModule
			}, item.id);
			return react_jsx_runtime.jsx("div", {
				className: "dsh-kb-list" + (hovered ? " drag-over" : ""),
				children: [
					react_jsx_runtime.jsx("div", {
						className: "dsh-kb-list-head",
						children: [
							react_jsx_runtime.jsx("span", { className: "dsh-kb-dot", style: { background: zone.color } }),
							react_jsx_runtime.jsx("span", { children: zone.label }),
							react_jsx_runtime.jsx("span", { className: "dsh-kb-count", children: items.length })
						]
					}),
					react_jsx_runtime.jsx("div", {
						className: "dsh-kb-drop-hint" + (hovered ? " show" : ""),
						children: "松开以移动到「" + zone.label + "」"
					}),
					react_jsx_runtime.jsx("div", {
						className: "dsh-kb-list-body",
						onDragOver: (e) => {
							e.preventDefault();
							e.dataTransfer.dropEffect = "move";
							onHover(zone.id);
						},
						onDrop: (e) => {
							e.preventDefault();
							const id = e.dataTransfer.getData("text/plain");
							if (id) onDropSession(id, zone.id);
						},
						children: [
							items.length === 0 && react_jsx_runtime.jsx("div", { className: "dsh-kb-empty", children: "无会话" }),
							groups.map((g) => react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
								children: [
									react_jsx_runtime.jsx("div", { className: "dsh-kb-group", children: "▸ " + g.name }, g.name),
									g.items.map(card)
								]
							}, g.name)),
							ungrouped.length > 0 && react_jsx_runtime.jsx("div", { className: "dsh-kb-group", children: "未分组" }),
							ungrouped.map(card)
						]
					})
				]
			});
		});
		function KanbanPanel({ useSessions, useWorkspaces, startSession, open, toggleKanban }) {
			const [st, setSt] = react.useState(readState);
			const [dragActive, setDragActive] = react.useState(false);
			const [hoverZone, setHoverZone] = react.useState(null);
			const [flash, setFlash] = react.useState(null);
			const hoverRaf = react.useRef(0);
			react.useEffect(() => {
				const on = () => setSt(readState());
				window.addEventListener("dsh:kanban-change", on);
				window.addEventListener("storage", on);
				return () => {
					window.removeEventListener("dsh:kanban-change", on);
					window.removeEventListener("storage", on);
				};
			}, []);
			react.useEffect(() => {
				const onStart = (e) => {
					if (e.target && e.target.closest && e.target.closest(".dsh-kb-card")) setDragActive(true);
				};
				const onEnd = () => {
					setDragActive(false);
					setHoverZone(null);
				};
				document.addEventListener("dragstart", onStart);
				document.addEventListener("dragend", onEnd);
				document.addEventListener("drop", onEnd);
				return () => {
					document.removeEventListener("dragstart", onStart);
					document.removeEventListener("dragend", onEnd);
					document.removeEventListener("drop", onEnd);
					if (hoverRaf.current) cancelAnimationFrame(hoverRaf.current);
				};
			}, []);
			const list = useSessions((s) => s);
			const workspaces = useWorkspaces((s) => s.items);
			const current = st.current || null;
			const ws = current === null ? void 0 : workspaces.find((w) => w.workspaceId === current);
			const mods = (st.modules && st.modules[current]) || [];
			const filter = st.filter && st.filter[current];
			const sel = filter === void 0 || filter === null ? mods : filter;
			const meta = st.meta || {};
			const hidden = st.hidden || [];
			const mutate = react.useCallback((fn) => {
				const next = readState();
				fn(next);
				writeState(next);
				setSt(next);
			}, []);
			const setStatus = react.useCallback((sessionId, status) => mutate((d) => {
				d.meta = d.meta || {};
				const m = d.meta[sessionId] = d.meta[sessionId] || {};
				m.status = status;
				d.hidden = (d.hidden || []).filter((x) => x !== sessionId);
			}), [mutate]);
			const setModule = react.useCallback((sessionId, module) => mutate((d) => {
				d.meta = d.meta || {};
				const m = d.meta[sessionId] = d.meta[sessionId] || {};
				m.module = module;
				const mods = d.modules && d.modules[current] ? d.modules[current] : [];
				if (module && !mods.includes(module)) {
					d.modules = d.modules || {};
					d.modules[current] = d.modules[current] || [];
					if (!d.modules[current].includes(module)) d.modules[current].push(module);
				}
			}), [mutate, current]);
			const handleDrop = react.useCallback((sessionId, status) => {
				setStatus(sessionId, status);
				setHoverZone(null);
				setFlash(sessionId);
				window.setTimeout(() => setFlash(null), 900);
			}, [setStatus]);
			const onHover = react.useCallback((zoneId) => {
				if (hoverRaf.current) return;
				hoverRaf.current = requestAnimationFrame(() => {
					hoverRaf.current = 0;
					setHoverZone(zoneId);
				});
			}, []);
			const onOpen = react.useCallback((sessionId) => {
				open(sessionId);
			}, [open]);
			const zoneItems = react.useMemo(() => {
				const out = { todo: [], doing: [], done: [] };
				if (ws) {
					for (const id of ws.sessionIds || []) {
						if (hidden.includes(id)) continue;
						const node = list.byId[id];
						if (!node) continue;
						const m = meta[id];
						const status = m && m.status ? m.status : "todo";
						const mod = m && m.module ? m.module : null;
						if (mod && !sel.includes(mod)) continue;
						out[status] = out[status] || [];
						out[status].push({ id, node, mod });
					}
				}
				return out;
			}, [ws, list, meta, sel, hidden]);
			return react_jsx_runtime.jsx("div", {
				className: "dsh-kb",
				children: [
					react_jsx_runtime.jsx("div", {
						className: "dsh-kb-head",
						children: [
							react_jsx_runtime.jsx("span", {
								children: "看板" + (ws ? " · " + (ws.title || ws.path || current) : "")
							}),
							react_jsx_runtime.jsx("span", { className: "dsh-kb-head-spacer" }),
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: "dsh-kb-btn primary",
								disabled: !current,
								title: "在看板中新建会话",
								onClick: () => {
									if (current) startSession(current);
								},
								children: "＋新建会话"
							}),
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: "dsh-kb-btn",
								title: "折叠看板列",
								onClick: () => toggleKanban(),
								children: "»"
							})
						]
					}, "kb-head"),
					current === null
						? react_jsx_runtime.jsx("div", {
							className: "dsh-kb-hint",
							children: "请在左侧项目列表选择一个项目，看板将展示该项目的会话"
						}, "kb-hint")
						: react_jsx_runtime.jsx("div", {
							className: "dsh-kb-lists" + (dragActive ? " dragging" : ""),
							children: ZONES.map((z) => react_jsx_runtime.jsx(KanbanList, {
								zone: z,
								items: zoneItems[z.id] || [],
								mods,
								sel,
								current: list.current,
								flash,
								hovered: hoverZone === z.id,
								onOpen,
								onSetModule: setModule,
								onDropSession: handleDrop,
								onHover
							}, z.id))
						}, "kb-lists"),
					react_jsx_runtime.jsx("div", {
						className: "dsh-kb-foot",
						children: "点击卡片打开会话 · 拖拽卡片可移动到其他列表"
					}, "kb-foot")
				]
			});
		}
		/* ── plugin body ─────────────────────────────────────── */
		/** Required services (cordis fiber inject). */
		const inject = ["slots", "sessions", "workspaces", "layout"];
		/**
		* Register the kanban panel once the layout shell declares the 'kanban'
		* slot (the ui-layout patch). Inject factories return plain callbacks;
		* session/workspace data reads use the framework's global hooks.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.slots.inject("kanban", () => ctx.slots.register({
				name: "kanban",
				inject: () => ({
					startSession: (workspaceId) => {
						ctx.workspaces.startSession(workspaceId);
					},
					open: (sessionId) => {
						ctx.sessions.open(sessionId);
					},
					toggleKanban: () => {
						ctx.layout.toggleKanban();
					}
				})
			}, KanbanPanel));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
