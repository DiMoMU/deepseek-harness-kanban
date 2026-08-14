# dsh-kanban-installer — 重启 dsh web（通用版，供同事使用）
# 用法: powershell -NoProfile -ExecutionPolicy Bypass -File .\restart.ps1 [-Workspace <目录>]
# 说明: 找到占用 3080 端口的 dsh web 进程并停止，然后用 `node <dsh>/lib/bin.js web`
#       重新启动（工作目录默认当前目录，可用 -Workspace 指定，决定沙箱工作区）。
#       若同事使用自己的桌面启动器管理 dsh，也可以直接用它重启，效果相同。
[CmdletBinding()]
param(
    [string]$DshRoot = "",
    [string]$Workspace = "",
    [int]$TimeoutSec = 90,
    [int]$Port = 3080
)
$ErrorActionPreference = "Stop"

function Resolve-DshRoot {
    if ($DshRoot) { return $DshRoot }
    $glob = Get-ChildItem (Join-Path $env:LOCALAPPDATA "npm-cache\_npx") -Directory -ErrorAction SilentlyContinue |
        ForEach-Object {
            $p = Join-Path $_.FullName "node_modules\@deepseek-ai\dsh\lib\bin.js"
            if (Test-Path $p) { return $_.FullName }
        } | Select-Object -First 1
    if (-not $glob) { throw "无法定位 DSH 安装树，请用 -DshRoot 指定" }
    return $glob
}

$DshRoot = Resolve-DshRoot
$entry = Join-Path $DshRoot "node_modules\@deepseek-ai\dsh\lib\bin.js"
if (-not (Test-Path $entry)) { throw "未找到 dsh 入口: $entry" }
if (-not $Workspace) { $Workspace = (Get-Location).Path }

# 停止旧进程（按端口）
$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    foreach ($l in $listener) {
        Stop-Process -Id $l.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "已停止旧 dsh 进程 PID $($l.OwningProcess)"
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "端口 $Port 当前无 dsh 在运行，直接启动。"
}

# 启动新进程
$env:DSH_HOME = Join-Path $env:USERPROFILE ".dsh"
$log = Join-Path $env:TEMP "dsh-kanban-web.log"
$err = Join-Path $env:TEMP "dsh-kanban-web.err.log"
Write-Host "启动: node $entry web (cwd=$Workspace)"
$proc = Start-Process -FilePath "node.exe" `
    -ArgumentList @("`"$entry`"", "web") `
    -WorkingDirectory $Workspace `
    -WindowStyle Hidden `
    -RedirectStandardOutput $log `
    -RedirectStandardError $err `
    -PassThru
Write-Host "新进程 PID $($proc.Id)，等待就绪…"

$deadline = (Get-Date).AddSeconds($TimeoutSec)
$ready = $false
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch { }
}
if ($ready) { Write-Host "服务已就绪: http://127.0.0.1:$Port （请刷新浏览器页面 F5）" }
else { Write-Warning "服务在 $TimeoutSec 秒内未就绪，请查看日志: $err" }
