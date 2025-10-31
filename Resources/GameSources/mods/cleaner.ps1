param (
    [Parameter(Mandatory = $true)][string]$root
) # use like \.cleaner.ps1 .
# do not, under no circumstances, run this on another folder than 
# \Resources\GameSources\mods
# it can and WİLL delete random files

if (-not (Test-Path -LiteralPath $root)) {
    Write-Error "Root directory does not exist: $root"
    exit
}

$whitelist = @(
    # graphics
    "*\graphics\ships\*",
    "*\graphics\hullmods\*",
    "*\graphics\weapons\*",
    
    # file extensions
    "*.skin",
    "*.ship",
    "*.variant",
    "*.faction",
    "*.ps1"
    "*meta.txt*"
    "*creation_date.txt*"

    # jsons
    "*settings.json",
    "*mod_info.json",
    "*LunaSettingsConfig.json"
    
    # csvs
    "*descriptions.csv",
    "*hull_mods.csv",
    "*ship_data.csv",
    "*ship_systems.csv",
    "*wing_data.csv",
    "*weapon_data.csv"


)

function Get-RelativePath($fullPath, $root) {
    $fullPath.Substring($root.Length).TrimStart('\')
}

function Test-Whitelist($relativePath) {
    foreach ($pattern in $whitelist) {
        if ($relativePath -like $pattern) { return $true }
    }
    return $false
}

if (-not (Test-Path -LiteralPath $root)) {
    Write-Error "Root folder not found: $root"
    exit 1
}

foreach ($line in Get-Content .\meta.txt) {
    if ($line.Contains( "Creation Date: ")) {
        continue
    }

    $lunaConfigPath = $line + "\data\config\LunaSettingsConfig.json"
    # $whitelist += $lunaConfigPath
    if ([System.IO.File]::Exists($lunaConfigPath)) {

        $contents = Get-Content $lunaConfigPath -Raw

        $whitelist += "*\" + [regex]::new('"iconPath"\s*:\s*"([^"#]*)"').Match(($contents)).Groups[1].Value.Replace("/", "\")
    }


}

$allItems = Get-ChildItem -Path $root -Recurse -Force -ErrorAction SilentlyContinue
$rootItems = Get-ChildItem -Path $root -Force | Where-Object { $_.FullName -notin $allItems.FullName }
$allItems = @($allItems) + @($rootItems) | Sort-Object FullName

$keepPaths = @{}
foreach ($item in $allItems) {
    $rel = Get-RelativePath $item.FullName $root
    if (Test-Whitelist $rel) {
        $current = ''
        $parts = $rel -split '\\'
        for ($i = 0; $i -lt $parts.Count; $i++) {
            $current = if ($i -eq 0) { $parts[0] } else { "$current\$($parts[$i])" }
            $keepPaths[$current] = $true
        }
    }
}

$toDelete = $allItems | Where-Object {
    $rel = Get-RelativePath $_.FullName $root
    -not $keepPaths.ContainsKey($rel)
}

$toDelete = $toDelete |
Sort-Object { ($_.FullName -split '\\').Count } -Descending



Write-Host "`n=== KEPT ===" -ForegroundColor Green
Get-ChildItem -Path $root -Recurse -Force |
ForEach-Object {
    $rel = Get-RelativePath $_.FullName $root
    if (Test-Whitelist $rel) {
        Write-Host "Kept: $(([string]($_.FullName)).Replace((Resolve-Path -Path $root), ''))" -ForegroundColor Green
    }
}

Write-Host "`n=== TO DELETE ($($toDelete.Count) items) ===" -ForegroundColor Red

foreach ($item in $toDelete) {
    try {
        Remove-Item -LiteralPath $item.FullName -Recurse -Force -ErrorAction Stop
        Write-Host "Deleted: $(([string]($item.FullName)).Replace((Resolve-Path -Path $root), ''))" -ForegroundColor Red
    } catch {
        Write-Warning "Failed: $($item.FullName) — $($_.Exception.Message)"
    }
}

Write-Host "`nCleanup finished." -ForegroundColor Cyan