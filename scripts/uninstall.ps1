# dsh-kanban-installer — 卸载/回滚 DSH 会话看板改造
# 用法: powershell -NoProfile -ExecutionPolicy Bypass -File .\uninstall.ps1 [-Restart]
# 说明: 恢复原始 bundle、移除 ui-kanban 配置行、删除插件包（可选 -KeepPlugin 保留）。
#       看板数据（浏览器 localStorage dsh.kanban.v1）不受影响。
[CmdletBinding()]
param(
    [string]$DshRoot = "",
    [string]$Profile = "",
    [switch]$Restart,
    [switch]$KeepPlugin
)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
. (Join-Path $Root "dsh-root.ps1")
function Restore-Bundle {
    param([string]$Name, [string]$Live, [string]$Old, [string]$New)
    if (-not (Test-Path $Live)) { Write-Warning "$Name 目标文件不存在，跳过"; return }
    $hLive = Get-FileSha256 $Live
    if ($hLive -eq (Get-FileSha256 $Old)) { Write-Host "[跳过] $Name 已是原始版本"; return }
    if ($hLive -eq (Get-FileSha256 $New)) { Copy-Item $Old $Live -Force; Write-Host "[完成] $Name 已恢复原始版本"; return }
    Write-Warning "$Name 与已补丁基线不匹配，未覆盖（可能被其他修改占用）"
}

$DshRoot = Resolve-DshRoot -ExplicitRoot $DshRoot
if (-not $Profile) { $Profile = Join-Path $env:USERPROFILE ".dsh\profiles\web" }
$LayoutLive = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-client-ui-layout" -RelativePath "lib\client.js"
$WorkspaceLive = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-client-ui-workspace" -RelativePath "lib\client.js"
$SidebarLive = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-client-ui-sidebar" -RelativePath "lib\client.js"
$PluginDest = Join-Path $env:USERPROFILE ".dsh\profiles\node_modules\@deepseek-ai\dsh-client-ui-kanban"
$PatchYml = Join-Path $Profile "cordis.patch.yml"

Write-Host "== DSH 会话看板卸载 =="
Restore-Bundle -Name "dsh-client-ui-layout" -Live $LayoutLive -Old (Join-Path $Root "patch\layout.old.js") -New (Join-Path $Root "patch\layout.new.js")
Restore-Bundle -Name "dsh-client-ui-workspace" -Live $WorkspaceLive -Old (Join-Path $Root "patch\workspace.old.js") -New (Join-Path $Root "patch\workspace.new.js")
Restore-Bundle -Name "dsh-client-ui-sidebar" -Live $SidebarLive -Old (Join-Path $Root "patch\sidebar.old.js") -New (Join-Path $Root "patch\sidebar.new.js")

if ($KeepPlugin) {
    Write-Host "[保留] 插件包未删除（-KeepPlugin）"
} elseif (Test-Path $PluginDest) {
    Remove-Item $PluginDest -Recurse -Force
    Write-Host "[完成] 已删除插件包 $PluginDest"
} else {
    Write-Host "[跳过] 插件包不存在"
}

if (Test-Path $PatchYml) {
    $content = Get-Content $PatchYml -Raw -Encoding UTF8
    $newContent = $content -replace '(?ms)^- insert:\r?\n\s+- id: ui-kanban\r?\n\s+name: ''@deepseek-ai/dsh-client-ui-kanban''\r?\n', ''
    if ($newContent -ne $content) {
        $body = ($newContent -split "`r?`n" | Where-Object { $_ -notmatch '^\s*#' -and $_.Trim() -ne "" }) -join "`n"
        if ($body.Trim() -eq "") { $newContent = $newContent.TrimEnd() + "`n[]`n" }
        Set-Content -Path $PatchYml -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "[完成] cordis.patch.yml 已移除 ui-kanban 行"
    } else {
        Write-Host "[跳过] cordis.patch.yml 无 ui-kanban 行"
    }
}

Write-Host ""
Write-Host "卸载完成。"
if ($Restart) { & (Join-Path $Root "restart.ps1") }
else { Write-Host "重启 dsh web 后刷新页面即恢复原界面（看板数据保留在浏览器，如需清空请删除 localStorage 键 dsh.kanban.v1）。" }
