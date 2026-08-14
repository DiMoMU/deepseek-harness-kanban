# dsh-kanban-installer — DSH 会话看板一键安装脚本
# 用法:
#   双击 install.cmd，或:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 [-Restart] [-Workspace <启动dsh的目录>]
# 参数:
#   -Restart    安装完成后自动重启 dsh web（推荐）
#   -Workspace  重启时作为 dsh 工作目录（决定沙箱工作区；默认当前目录）
#   -DshRoot    DSH 安装树路径（缺省自动探测 npm 全局安装和 npx 缓存）
#   -Profile    dsh web profile 目录（缺省 %USERPROFILE%\.dsh\profiles\web）
#   -Force      本机 bundle 与基线不匹配时仍强制覆盖（版本不一致风险自负）
[CmdletBinding()]
param(
    [string]$DshRoot = "",
    [string]$Profile = "",
    [switch]$Restart,
    [string]$Workspace = "",
    [switch]$Force
)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
. (Join-Path $Root "dsh-root.ps1")
function Apply-Bundle {
    param([string]$Name, [string]$Live, [string]$Old, [string]$New)
    if (-not (Test-Path $Live)) { throw "缺少文件: $Live（DSH 安装树不完整？）" }
    $hLive = Get-FileSha256 $Live
    if ($hLive -eq (Get-FileSha256 $New)) { Write-Host "[跳过] $Name 已安装补丁"; return $true }
    if ($hLive -eq (Get-FileSha256 $Old)) { Copy-Item $New $Live -Force; Write-Host "[完成] $Name 已应用补丁"; return $true }
    if ($Force) { Copy-Item $New $Live -Force; Write-Host "[强制] $Name 与基线不匹配，已强制覆盖"; return $true }
    Write-Warning "$Name 与安装包基线（版本 $($manifest.target.layout) 原始/已补丁）均不匹配——可能已被上游升级或人工修改。"
    Write-Warning "如确定本机就是目标版本，可加 -Force 强制覆盖（若版本不同，UI 可能异常，请先卸载）。"
    return $false
}

$DshRoot = Resolve-DshRoot -ExplicitRoot $DshRoot
if (-not $Profile) { $Profile = Join-Path $env:USERPROFILE ".dsh\profiles\web" }
if (-not $Workspace) { $Workspace = (Get-Location).Path }

$manifest = Get-Content (Join-Path $Root "manifest.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$LayoutLive = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-client-ui-layout" -RelativePath "lib\client.js"
$WorkspaceLive = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-client-ui-workspace" -RelativePath "lib\client.js"
$SidebarLive = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-client-ui-sidebar" -RelativePath "lib\client.js"
$ApiRemotesLive = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-api-remotes" -RelativePath "lib\client.js"
$PluginDest = Join-Path $env:USERPROFILE ".dsh\profiles\node_modules\@deepseek-ai\dsh-client-ui-kanban"
$PatchYml = Join-Path $Profile "cordis.patch.yml"

Write-Host ""
Write-Host "== DSH 会话看板一键安装 =="
Write-Host "DSH 安装树 : $DshRoot"
Write-Host "Profile     : $Profile"
Write-Host "工作目录    : $Workspace"
Write-Host ""

# 0) 版本核验
$layoutPkg = Get-DshModulePath -DshRoot $DshRoot -Name "dsh-client-ui-layout" -RelativePath "package.json"
if (Test-Path $layoutPkg) {
    $ver = (Get-Content $layoutPkg -Raw | ConvertFrom-Json).version
    Write-Host "本机 dsh-client-ui-layout 版本: $ver （安装包支持: $($manifest.target.layout)）"
    if ($ver -ne $manifest.target.layout) {
        Write-Warning "版本不一致！补丁基线按 $($manifest.target.layout) 构建，直接安装可能导致 UI 异常。建议先升级/对齐 dsh 版本。"
        if (-not $Force) { Write-Host "已中止（确认无误可加 -Force 强制）。"; exit 1 }
    }
} else {
    Write-Warning "未找到 dsh-client-ui-layout 包，DSH 安装树可能不完整，继续尝试。"
}

# 1) 布局外壳四栏化（项目列表 | 看板 | 对话 | 详情）
$ok1 = Apply-Bundle -Name "dsh-client-ui-layout" -Live $LayoutLive -Old (Join-Path $Root "patch\layout.old.js") -New (Join-Path $Root "patch\layout.new.js")
# 2) 项目列表：项目→模块复选框二级列表
$ok2 = Apply-Bundle -Name "dsh-client-ui-workspace" -Live $WorkspaceLive -Old (Join-Path $Root "patch\workspace.old.js") -New (Join-Path $Root "patch\workspace.new.js")
$ok3 = Apply-Bundle -Name "dsh-client-ui-sidebar" -Live $SidebarLive -Old (Join-Path $Root "patch\sidebar.old.js") -New (Join-Path $Root "patch\sidebar.new.js")
$ok4 = Apply-Bundle -Name "dsh-api-remotes" -Live $ApiRemotesLive -Old (Join-Path $Root "patch\api-remotes.old.js") -New (Join-Path $Root "patch\api-remotes.new.js")
if (-not ($ok1 -and $ok2 -and $ok3 -and $ok4)) { Write-Host "安装中止：bundle 基线不匹配（可用 -Force 强制，但仅在版本一致时推荐）。"; exit 1 }

# 3) 安装看板插件包（flat fallback，profile 可解析）
New-Item -ItemType Directory -Force -Path (Join-Path $PluginDest "lib") | Out-Null
Copy-Item (Join-Path $Root "plugin\package.json") (Join-Path $PluginDest "package.json") -Force
Copy-Item (Join-Path $Root "plugin\lib\index.js") (Join-Path $PluginDest "lib\index.js") -Force
Copy-Item (Join-Path $Root "plugin\lib\client.js") (Join-Path $PluginDest "lib\client.js") -Force
Write-Host "[完成] 插件包已安装 -> $PluginDest"

# 3.5) 安装宿主删除插件（dsh-session-delete，真删除会话日志）
$HostPluginDest = Join-Path $env:USERPROFILE ".dsh\profiles\node_modules\@deepseek-ai\dsh-session-delete"
New-Item -ItemType Directory -Force -Path (Join-Path $HostPluginDest "lib") | Out-Null
Copy-Item (Join-Path $Root "host-plugin\package.json") (Join-Path $HostPluginDest "package.json") -Force
Copy-Item (Join-Path $Root "host-plugin\lib\index.js") (Join-Path $HostPluginDest "lib\index.js") -Force
Copy-Item (Join-Path $Root "host-plugin\lib\typert.host.js") (Join-Path $HostPluginDest "lib\typert.host.js") -Force
Copy-Item (Join-Path $Root "host-plugin\lib\typert.remote-client.js") (Join-Path $HostPluginDest "lib\typert.remote-client.js") -Force
Write-Host "[完成] 宿主删除插件已安装 -> $HostPluginDest"

# 4) profile 配置：cordis.patch.yml 追加 ui-kanban 行（幂等；profile 未初始化则创建）
if (-not (Test-Path $Profile)) { New-Item -ItemType Directory -Force -Path $Profile | Out-Null }
if (-not (Test-Path $PatchYml)) {
    Set-Content -Path $PatchYml -Value "# Your patch layer for this dsh profile, applied after every bundle layer:`n# a top-level YAML array of loader patch entries.`n[]" -Encoding UTF8
    Write-Host "[创建] 已初始化 profile 补丁文件 $PatchYml"
}
$content = Get-Content $PatchYml -Raw -Encoding UTF8
if ($content -match "session-delete") {
    Write-Host "[跳过] cordis.patch.yml 已包含 ui-kanban 与 session-delete"
} else {
    $row = "- insert:`n    - id: ui-kanban`n      name: '@deepseek-ai/dsh-client-ui-kanban'`n    - id: session-delete`n      name: '@deepseek-ai/dsh-session-delete'"
    if ($content -match '(?m)^\[\]\s*$') {
        $content = $content -replace '(?m)^\[\]\s*$', $row
    } elseif ($content -match "ui-kanban") {
        $content = $content -replace "(?m)      name: '@deepseek-ai/dsh-client-ui-kanban'\s*$", "      name: '@deepseek-ai/dsh-client-ui-kanban'`n    - id: session-delete`n      name: '@deepseek-ai/dsh-session-delete'"
    } else {
        $content = $content.TrimEnd() + "`n" + $row + "`n"
    }
    Set-Content -Path $PatchYml -Value $content -Encoding UTF8 -NoNewline
    Write-Host "[完成] cordis.patch.yml 已追加 ui-kanban + session-delete 行"
}

Write-Host ""
Write-Host "安装完成！"
if ($Restart) {
    Write-Host "正在重启 dsh web…"
    & (Join-Path $Root "restart.ps1") -Workspace $Workspace
} else {
    Write-Host "下一步：重启 dsh web（双击 restart.cmd 或运行 restart.ps1，或用你自己的启动器重启），然后刷新浏览器页面（F5）。"
}
