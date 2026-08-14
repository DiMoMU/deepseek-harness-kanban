<p align="center">
  <img src="yulan.png" alt="yulan" />
</p>

# dsh-session-kanban · DSH Session Kanban

**Language: [English](README.md) · [中文](README.zh-CN.md)**

> A session kanban column for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) Web UI — three scrollable lists (To-do / Doing / Done), per-project module filtering, drag & drop, and a one-click installer that patches the stock `dsh web` bundles.

## Features

- **Four-column layout**: `Projects | Kanban | Chat | Details` — the kanban sits to the right of the project list, resizable (480–760px), collapsible, auto-hidden on narrow screens.
- **Projects → module checkboxes**: projects no longer list sessions directly; expand a project to see its modules as checkbox rows (multi-select / select-all / create module), **single-project view**.
- **Three equal lists** (To-do / Doing / Done), each scrolls independently; sessions grouped by module, "Ungrouped" always visible.
- **Card actions**: full-row session title; click to open (highlighted when open); drag between lists (ghost + target highlight + drop hint + flash); the `⋯` menu supports **Rename / Fork / Archive** and module selection (closes on outside click or Esc).
- **Persistence**: status / module / filter stored in browser `localStorage` (`dsh.kanban.v1`), synced across tabs; session logs untouched.

```
Projects | Kanban (3 equal scrollable lists) | Chat | Details
 project │  To-do │ Doing │ Done
  ├ module│  card: status dot + title (full row)
  ├ check │        module chip / time / drag / ⋯ menu
  └ create│  · click opens · drag moves · ＋ new session
```

Interactive layout demo (pure HTML): [docs/example.html](docs/example.html)

## Compatibility

- Targets `@deepseek-ai/dsh` **0.1.0-rc.6** (Windows + Node.js). The installer verifies the local bundle version against pinned baselines and refuses on mismatch (use `-Force` at your own risk).
- Upgrading `@deepseek-ai/dsh` overwrites the patched bundles — re-run `install.cmd` to re-apply.

## Quick start

```powershell
# build the installer zip -> dist/dsh-session-kanban-installer.zip
npm run build:dist

# or run directly in the repo
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/install.ps1 -Restart
# then refresh the browser (F5)
```

| Script | Purpose |
|---|---|
| `scripts/install.ps1` / `install.cmd` | one-click install (idempotent) |
| `scripts/uninstall.ps1` / `uninstall.cmd` | one-click uninstall |
| `scripts/verify.ps1` / `verify.cmd` | self-check install state |
| `scripts/restart.ps1` / `restart.cmd` | restart dsh web |

## How it works

See [docs/architecture.md](docs/architecture.md) — slot wiring, the `dsh.kanban.v1` storage contract, performance notes, and cross-version baseline regeneration.

## FAQ

| Symptom | Fix |
|---|---|
| "Version mismatch" | Align dsh to 0.1.0-rc.6 and re-run; or wait for a baseline for the new version |
| "Baselines do not match" | Run `verify.ps1`, then `install.ps1 -Force` |
| No change after install | Restart dsh → Ctrl+F5 → check `%TEMP%\dsh-kanban-web.err.log` |
| Blank kanban / can't re-expand | Hard refresh; else uninstall then reinstall |
| Broken after upgrading dsh | Re-run `install.cmd` |

## License & disclaimer

MIT (see [LICENSE](LICENSE)). This is a third-party modification of npm-installed `@deepseek-ai` bundles (MIT), not affiliated with DeepSeek. Installing rewrites files inside your local DSH installation tree; uninstall restores the pinned originals.
