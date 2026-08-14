# build-dist.ps1 — 从仓库内容构建一键安装包 zip（输出 dist/dsh-session-kanban-installer.zip）
# 用法: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-dist.ps1 [-OutDir <dir>]
[CmdletBinding()]
param([string]$OutDir = "")
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not $OutDir) { $OutDir = Join-Path $Root "dist" }
$Stage = Join-Path $OutDir "_stage"
Remove-Item $Stage -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "patch"), (Join-Path $Stage "plugin\lib") | Out-Null

# 1) 补丁基线
Copy-Item (Join-Path $Root "patch\layout.old.js"),(Join-Path $Root "patch\layout.new.js"),(Join-Path $Root "patch\sidebar.old.js"),(Join-Path $Root "patch\sidebar.new.js"),(Join-Path $Root "patch\workspace.old.js"),(Join-Path $Root "patch\workspace.new.js") (Join-Path $Stage "patch\") -Force

# 2) 插件包（安装器布局：package.json + lib/）
Copy-Item (Join-Path $Root "plugin\package.json") (Join-Path $Stage "plugin\package.json") -Force
Copy-Item (Join-Path $Root "plugin\index.js") (Join-Path $Stage "plugin\lib\index.js") -Force
Copy-Item (Join-Path $Root "plugin\client.js") (Join-Path $Stage "plugin\lib\client.js") -Force

# 3) 安装/卸载/自检/重启脚本放到 zip 根（脚本以自身目录为根解析 patch/plugin/manifest）
foreach ($name in @("install", "uninstall", "verify", "restart")) {
    Copy-Item (Join-Path $Root "scripts\$name.ps1") (Join-Path $Stage "$name.ps1") -Force
    Copy-Item (Join-Path $Root "scripts\$name.cmd") (Join-Path $Stage "$name.cmd") -Force
}
Copy-Item (Join-Path $Root "scripts\dsh-root.ps1") (Join-Path $Stage "dsh-root.ps1") -Force

# 4) 清单与说明
Copy-Item (Join-Path $Root "manifest.json") (Join-Path $Stage "manifest.json") -Force
Copy-Item (Join-Path $Root "README.md") (Join-Path $Stage "README.md") -Force
Copy-Item (Join-Path $Root "README.zh-CN.md") (Join-Path $Stage "README.zh-CN.md") -Force
Copy-Item (Join-Path $Root "yulan.png") (Join-Path $Stage "yulan.png") -Force

# 5) .ps1 统一转 UTF-8 BOM（兼容 PowerShell 5.1）
$utf8Bom = New-Object System.Text.UTF8Encoding $true
Get-ChildItem $Stage -Filter *.ps1 -Recurse | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($_.FullName, $c, $utf8Bom)
}

# 6) 打包
$zip = Join-Path $OutDir "dsh-session-kanban-installer.zip"
Remove-Item $zip -Force -ErrorAction SilentlyContinue
Compress-Archive -Path (Join-Path $Stage "*") -DestinationPath $zip -CompressionLevel Optimal
Remove-Item $Stage -Recurse -Force
$size = [math]::Round((Get-Item $zip).Length / 1KB, 1)
Write-Host "构建完成: $zip ($size KB)"
Write-Host "提示: 安装包目标版本为 @deepseek-ai/dsh 0.1.0-rc.6，见 manifest.json"
