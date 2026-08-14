function Get-FileSha256 {
    param([string]$Path)

    $stream = [System.IO.File]::OpenRead($Path)
    try {
        $sha256 = [System.Security.Cryptography.SHA256]::Create()
        try {
            return ([System.BitConverter]::ToString($sha256.ComputeHash($stream))).Replace("-", "")
        } finally {
            $sha256.Dispose()
        }
    } finally {
        $stream.Dispose()
    }
}

function Get-DshEntryPath {
    param([string]$DshRoot)

    return Join-Path $DshRoot "node_modules\@deepseek-ai\dsh\lib\bin.js"
}

function Get-DshModulePath {
    param(
        [string]$DshRoot,
        [string]$Name,
        [string]$RelativePath = ""
    )

    $packageRoots = @(
        (Join-Path $DshRoot "node_modules\@deepseek-ai\dsh\node_modules\@deepseek-ai\$Name"),
        (Join-Path $DshRoot "node_modules\@deepseek-ai\$Name")
    )
    $paths = $packageRoots | ForEach-Object {
        if ($RelativePath) { Join-Path $_ $RelativePath } else { $_ }
    }
    $resolved = $paths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if ($resolved) { return $resolved }
    return $paths[0]
}

function Test-DshRoot {
    param([string]$Path)

    if (-not $Path) { return $false }
    $entry = Get-DshEntryPath $Path
    return Test-Path -LiteralPath $entry -PathType Leaf
}

function Resolve-DshRoot {
    param([string]$ExplicitRoot = "")

    if ($ExplicitRoot) {
        if (-not (Test-DshRoot $ExplicitRoot)) {
            throw "Invalid DSH root: $ExplicitRoot"
        }
        return $ExplicitRoot
    }

    $candidates = @()
    $dshCommand = Get-Command dsh.cmd, dsh.ps1 -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($dshCommand) {
        $candidates += Split-Path -Parent $dshCommand.Source
    }

    $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
    $npmCache = ""
    if ($npmCommand) {
        $npmPrefix = (& $npmCommand.Source prefix -g 2>$null | Select-Object -Last 1)
        if ($LASTEXITCODE -eq 0 -and $npmPrefix) { $candidates += $npmPrefix.Trim() }

        $npmCache = (& $npmCommand.Source config get cache 2>$null | Select-Object -Last 1)
        if ($LASTEXITCODE -eq 0 -and $npmCache) { $npmCache = $npmCache.Trim() }
    }
    if (-not $npmCache -and $env:LOCALAPPDATA) {
        $npmCache = Join-Path $env:LOCALAPPDATA "npm-cache"
    }

    if ($npmCache) {
        $npxRoot = Join-Path $npmCache "_npx"
        $candidates += Get-ChildItem -LiteralPath $npxRoot -Directory -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending |
            Select-Object -ExpandProperty FullName
    }

    $resolved = $candidates | Where-Object { Test-DshRoot $_ } | Select-Object -First 1
    if (-not $resolved) {
        throw "Cannot locate the DSH installation. Install @deepseek-ai/dsh or specify the npm prefix with -DshRoot."
    }
    return $resolved
}
