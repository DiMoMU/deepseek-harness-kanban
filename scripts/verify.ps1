# dsh-kanban-installer — 检查当前安装状态（自检）
# 用法: powershell -NoProfile -ExecutionPolicy Bypass -File .\verify.ps1
[CmdletBinding()]
param(
    [string]$DshRoot = "",
    [string]$Profile = ""
)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

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
function Get-Hash($p) { (Get-FileHash $p -Algorithm SHA256).Hash }
function StateOf($Live, $Old, $New) {
    if (-not (Test-Path $Live)) { return "缺失" }
    $h = Get-Hash $Live
    if ($h -eq (Get-Hash $New)) { return "已安装" }
    if ($h -eq (Get-Hash $Old)) { return "原始未装" }
    return "不匹配(可能被改)"
}

$DshRoot = Resolve-DshRoot
if (-not $Profile) { $Profile = Join-Path $env:USERPROFILE ".dsh\profiles\web" }
$LayoutLive = Join-Path $DshRoot "node_modules\@deepseek-ai\dsh-client-ui-layout\lib\client.js"
$WorkspaceLive = Join-Path $DshRoot "node_modules\@deepseek-ai\dsh-client-ui-workspace\lib\client.js"
$PluginDest = Join-Path $env:USERPROFILE ".dsh\profiles\node_modules\@deepseek-ai\dsh-client-ui-kanban"
$PatchYml = Join-Path $Profile "cordis.patch.yml"

Write-Host "== DSH 会话看板安装状态自检 =="
Write-Host "DSH 安装树 : $DshRoot"
Write-Host "Profile     : $Profile"
Write-Host ""
Write-Host ("布局外壳 dsh-client-ui-layout : " + (StateOf $LayoutLive (Join-Path $Root "patch\layout.old.js") (Join-Path $Root "patch\layout.new.js")))
Write-Host ("项目列表 dsh-client-ui-workspace: " + (StateOf $WorkspaceLive (Join-Path $Root "patch\workspace.old.js") (Join-Path $Root "patch\workspace.new.js")))
$pluginOk = Test-Path (Join-Path $PluginDest "lib\client.js")
Write-Host ("看板插件包                    : " + $(if ($pluginOk) { "已安装" } else { "未安装" }))
$cfgOk = (Test-Path $PatchYml) -and ((Get-Content $PatchYml -Raw -ErrorAction SilentlyContinue) -match "ui-kanban")
Write-Host ("配置行 ui-kanban              : " + $(if ($cfgOk) { "已写入" } else { "未写入" }))

$installed = ((StateOf $LayoutLive (Join-Path $Root "patch\layout.old.js") (Join-Path $Root "patch\layout.new.js")) -eq "已安装") -and
             ((StateOf $WorkspaceLive (Join-Path $Root "patch\workspace.old.js") (Join-Path $Root "patch\workspace.new.js")) -eq "已安装") -and
             $pluginOk -and $cfgOk
Write-Host ""
if ($installed) {
    Write-Host "状态：已完整安装。重启 dsh web 并刷新页面即可使用。"
} else {
    Write-Host "状态：未完整安装。运行 install.cmd 完成安装（版本不匹配会明确提示）。"
}
