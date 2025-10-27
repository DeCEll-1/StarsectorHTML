function Remove-HashCommentsFromJson {
    param(
        [string] $text
    )

    $out = New-Object System.Text.StringBuilder
    $inString = $false
    $escaped = $false
    $len = $text.Length
    $i = 0

    while ($i -lt $len) {
        $ch = $text[$i]

        if ($inString) {
            $out.Append($ch) | Out-Null

            if ($escaped) {
                $escaped = $false
            } elseif ($ch -eq '\') {
                $escaped = $true
            } elseif ($ch -eq '"') {
                $inString = $false
            }

            $i++
            continue
        }

        if ($ch -eq '"') {
            $inString = $true
            $out.Append($ch) | Out-Null
            $i++
            continue
        }

        if ($ch -eq '#') {
            while ($i -lt $len -and $text[$i] -ne "`n") {
                $i++
            }
            if ($i -lt $len -and $text[$i] -eq "`n") {
                $out.Append("`n") | Out-Null
                $i++
            }
            continue
        }

        $out.Append($ch) | Out-Null
        $i++
    }

    return $out.ToString()
}

$InputDirectory = "./"
$OutputFile = "./merged_game_sources.json"
$Columns =
# ship_data
"name", "id", "designation", "tech/manufacturer", "system id", "fleet pts", "hitpoints", "armor rating", "max flux", "8/6/5/4%", "flux dissipation", "ordnance points", "fighter bays", "max speed", "acceleration", "deceleration", "max turn rate", "turn acceleration", "mass", "shield type", "defense id", "shield arc", "shield upkeep", "shield efficiency", "phase cost", "phase upkeep", "min crew", "max crew", "cargo", "fuel", "fuel/ly", "range", "max burn", "base value", "cr %/day", "CR to deploy", "peak CR sec", "CR loss/sec", "supplies/rec", "supplies/mo", "c/s", "c/f", "f/s", "f/f", "crew/s", "crew/f", "hints", "tags", "logistics n/a reason", "codex variant id", "rarity", "breakProb", "minPieces", "maxPieces", "travel drive", "number",
# descriptions
"type", "text1", "text2", "text3", "text4", "text5", "notes",
# hull mods
"name", "id", "tier", "rarity", "tech/manufacturer", "tags", "uiTags", "base value", "unlocked", "hidden", "hiddenEverywhere", "cost_frigate", "cost_dest", "cost_cruiser", "cost_capital", "script", "desc", "short", "sModDesc", "sprite",
# ship systems
"name", "id", "flux/second", "f/s (base rate)", "f/s (base cap)", "flux/use", "f/u (base rate)", "f/u (base cap)", "cr/u", "max uses", "regen", "charge up", "active", "down", "cooldown", "toggle", "noDissipation", "noHardDissipation", "hardFlux", "noFiring", "noTurning", "noStrafing", "noAccel", "noShield", "noVent", "isPhaseCloak", "tags", "icon",
# colors
"type", "hex",
# weapon data
"name", "id", "tier", "rarity", "base value", "range", "damage/second", "damage/shot", "emp", "impact", "turn rate", "OPs", "ammo", "ammo/sec", "reload size", "type", "energy/shot", "energy/second", "chargeup", "chargedown", "burst size", "burst delay", "min spread", "max spread", "spread/shot", "spread decay/sec", "beam speed", "proj speed", "launch speed", "flight time", "proj hitpoints", "autofireAccBonus", "extraArcForAI", "hints", "tags", "groupTag", "tech/manufacturer", "for weapon tooltip>>", "primaryRoleStr", "speedStr", "trackingStr", "turnRateStr", "accuracyStr", "customPrimary", "customPrimaryHL", "customAncillary", "customAncillaryHL", "noDPSInTooltip", "number",
# wing data
"id", "variant", "tags", "tier", "rarity", "fleet pts", "op cost", "formation", "range", "attackRunRange", "attackPositionOffset", "num", "role", "role desc", "refit", "base value", "", "", "", "", "", "", "", "", "", "", "", "", "number"

$csvFiles = Get-ChildItem -Path $InputDirectory -Filter *.csv -Recurse
$shipFiles = Get-ChildItem -Path $InputDirectory -Filter *.ship -Recurse
$skinFiles = Get-ChildItem -Path $InputDirectory -Filter *.skin -Recurse

$groupedData = @{}

# --- Process CSV files ---
foreach ($file in $csvFiles) {
    Write-Host "Processing CSV $($file.FullName)..."
    try {
        $data = Import-Csv -Path $file.FullName

        # Only keep columns that exist in this file
        $availableCols = ($Columns | Where-Object { $_ -in $data[0].PsObject.Properties.Name }) | Select-Object -Unique

        if ($availableCols.Count -eq 0) {
            Write-Warning "Skipping $($file.Name): no matching columns."
            continue
        }

        $filtered = $data | Select-Object -Property @($availableCols)
        $key = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $groupedData[$key] = $filtered
    } catch {
        Write-Warning "Failed to process CSV: $($file.FullName) — $_"
    }
}

$shipsData = @()
foreach ($file in $shipFiles) {
    Write-Host "Processing SHIP $($file.FullName)..."
    try {
        $jsonContent = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
        $shipsData += $jsonContent
    } catch {
        Write-Warning "Failed to process SHIP file: $($file.FullName) — $_"
    }
}

if ($shipsData.Count -gt 0) {
    $groupedData["ships"] = $shipsData
}

$skinData = @()

foreach ($file in $skinFiles) {
    Write-Host "Processing SKIN $($file.FullName)..."
    try {
        $raw = Get-Content -Path $file.FullName -Raw
        $clean = Remove-HashCommentsFromJson -text $raw

        $clean = $clean.Replace("CIVILIAN", "`"CIVILIAN`"")

        $fixup_json = [regex]::Replace($clean, '(?<!")(?<=[:\[\s,])([A-Za-z_][A-Za-z0-9_]*)(?=[\s,\]\}])(?!")
', '"$1"')
        $fixup_json_2 = [regex]::Replace($fixup_json, '(".*?":)\s*([A-Za-z_][A-Za-z0-9_]*)(?=[\s,\]}])', '$1"$2"')
        $fixup_json_3 = [regex]::Replace($fixup_json_2, ',\s*(?=[}\]])', '')

        $jsonContent = $fixup_json_3 | ConvertFrom-Json
        $skinData += $jsonContent
    } catch {
        Write-Warning "Failed to process SHIP file: $($file.FullName) — $_"
    }
}

if ($skinData.Count -gt 0) {
    $groupedData["skins"] = $skinData
}


# --- Export everything to JSON ---
if ($groupedData.Count -eq 0) {
    Write-Host "No data found to export."
    exit
}

$groupedData | ConvertTo-Json -Depth 10 -Compress | Set-Content -Path $OutputFile -Encoding UTF8

Write-Host "✅ Exported CSVs and SHIP files into JSON: '$OutputFile'"