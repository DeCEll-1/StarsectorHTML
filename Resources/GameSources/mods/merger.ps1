function Remove-HashCommentsFromJson {
    param(
        [Parameter(
            ValueFromPipeline 
        )]
        [string] $text
    )
    begin { $full = @() }
    process { $full += $text }
    end {
        $full = $full -join '' 
        $out = New-Object System.Text.StringBuilder
        $inString = $false
        $escaped = $false
        $len = $full.Length
        $i = 0

        while ($i -lt $len) {
            $ch = $full[$i]

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
                while ($i -lt $len -and $full[$i] -ne "`n") {
                    $i++
                }
                if ($i -lt $len -and $full[$i] -eq "`n") {
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
}

function Remove-FloatSuffix {
    param(
        [Parameter(ValueFromPipeline)]
        [string] $text
    )

    begin { $full = @() }
    process { $full += $text }
    end {
        $full = $full -join ''

        $full = [regex]::Replace($full, '\b(\d+(?:\.\d+)?|\.\d+)f\b', '$1')

        return $full
    }
}

function Convert-HashTableToColor {
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [hashtable] $InputHashtable
    )
    process {
        $result = @{}

        foreach ($key in $InputHashtable.Keys) {
            $col = $InputHashtable[$key]

            $result[$key] = "#" + $col[0].ToString("X2") + $col[1].ToString("X2") + $col[2].ToString("X2") 
        }

        return $result
    }
}

function Convert-PropertiesToHashTable {
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        $properties
    )
    begin { $full = @() }
    process { $full += $properties }
    end {
        $result = @{}

        foreach ($prop in $full) {
            $name = $prop.Name
            $val = $prop.Value  # This is already @(r,g,b)
            $result[$name] = $val
        }

        return $result
    }
}

function Merge-Hashtable {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [hashtable[]] $InputObject
    )

    begin {
        $merged = @{}
    }

    process {
        foreach ($ht in $InputObject) {
            foreach ($key in $ht.Keys) {
                $merged[$key] = $ht[$key]  # Last value wins
            }
        }
    }

    end {
        return $merged
    }
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
# "type", "hex",
# weapon data
"name", "id", "tier", "rarity", "base value", "range", "damage/second", "damage/shot", "emp", "impact", "turn rate", "OPs", "ammo", "ammo/sec", "reload size", "type", "energy/shot", "energy/second", "chargeup", "chargedown", "burst size", "burst delay", "min spread", "max spread", "spread/shot", "spread decay/sec", "beam speed", "proj speed", "launch speed", "flight time", "proj hitpoints", "autofireAccBonus", "extraArcForAI", "hints", "tags", "groupTag", "tech/manufacturer", "for weapon tooltip>>", "primaryRoleStr", "speedStr", "trackingStr", "turnRateStr", "accuracyStr", "customPrimary", "customPrimaryHL", "customAncillary", "customAncillaryHL", "noDPSInTooltip", "number",
# wing data
"id", "variant", "tags", "tier", "rarity", "fleet pts", "op cost", "formation", "range", "attackRunRange", "attackPositionOffset", "num", "role", "role desc", "refit", "base value", "", "", "", "", "", "", "", "", "", "", "", "", "number"

# $variantFiles = Get-ChildItem -Path $InputDirectory -Filter *.variant -Recurse


$hullmods_cvs_path = "\data\hullmods\hull_mods.csv"

$ship_cvs_path = "\data\hulls\ship_data.csv"
$wing_cvs_path = "\data\hulls\wing_data.csv"

$shipsystems_csv_path = "\data\shipsystems\ship_systems.csv"

$descriptions_cvs_path = "\data\strings\descriptions.csv"

$weapons_cvs_path = "\data\weapons\weapon_data.csv"

$csvFiles = @(
    $hullmods_cvs_path,
    $ship_cvs_path,
    $wing_cvs_path,
    $shipsystems_csv_path,
    $descriptions_cvs_path,
    $weapons_cvs_path
)


$mods = Get-ChildItem -Directory

$groupedData = @{}

$groupedData["colors"] = @()

foreach ($mod in $mods) {
    $modData = @{}
    
    $shipFiles = @()
    $shipFiles = Get-ChildItem -Path $mod -Filter *.ship -Recurse

    $skinFiles = @()
    $skinFiles = Get-ChildItem -Path $mod -Filter *.skin -Recurse

    
    $mod_info_object = ((Get-Content -Path ($mod.FullName + "\mod_info.json") -Raw) | ConvertFrom-Json)
    $lunaConfigPath = $mod.FullName + "\" + "\data\config\LunaSettingsConfig.json"
    if ([System.IO.File]::Exists($lunaConfigPath)) {
        $lunaConfigFileContent = Get-Content $lunaConfigPath -Raw
        $mod_info_object | Add-Member -NotePropertyName icon -NotePropertyValue (($mod.Name + ("/" + [regex]::new('"iconPath"\s*:\s*"([^"#]*)"').Match($lunaConfigFileContent).Groups[1].Value)))
    }
    $mod_info_object | Add-Member -NotePropertyName directory -NotePropertyValue $mod.Name

    $modData = $mod_info_object
    $commented_json = (Get-Content -Path ($mod.FullName + "\data\config\settings.json") -Raw).Replace(";", ",")
    $uncommented_json = ($commented_json | Remove-HashCommentsFromJson | Remove-FloatSuffix)
    $groupedData["colors"] += (($uncommented_json | ConvertFrom-Json).designTypeColors.PSObject.Properties) | Convert-PropertiesToHashTable | Convert-HashTableToColor

    #region csvs
    foreach ($file in $csvFiles) {
        $file = [System.IO.DirectoryInfo]($mod.FullName + $file)
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
            $filtered | Add-Member -NotePropertyName owner -NotePropertyValue $mod_info_object.id
            $groupedData[$key] += $filtered
        } catch {
            Write-Warning "Failed to process CSV: $($file.FullName) — $_"
        }
    }
    #endregion

    #region ships
    $shipsData = @()
    foreach ($file in $shipFiles) {
        Write-Host "Processing SHIP $($file.FullName)..."
        try {
            $jsonContent = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
            $jsonContent | Add-Member -NotePropertyName owner -NotePropertyValue $mod_info_object.id
            $shipsData += $jsonContent
        } catch {
            Write-Warning "Failed to process SHIP file: $($file.FullName) — $_"
        }
    }
    $groupedData["ships"] += $shipsData
    #endregion

    #region skins
    $skinData = @()
    foreach ($file in $skinFiles) {
        Write-Host "Processing SKIN $($file.FullName)..."
        try {
            $raw = Get-Content -Path $file.FullName -Raw
            $clean = $raw | Remove-HashCommentsFromJson | Remove-FloatSuffix

            # $fixup_json = [regex]::Replace($clean, '(?<!")(?<=[:\[\s,])([A-Za-z_][A-Za-z0-9_]*)(?=[\s,\]\}])(?!")', '"$1"')
            $fixup_json_2 = [regex]::Replace($clean, '(".*?":)\s*([A-Za-z_][A-Za-z0-9_]*)(?=[\s,\]}])', '$1"$2"')
            $fixup_json_3 = [regex]::Replace($fixup_json_2, ',\s*(?=[}\]])', '')
            $fixup_json_4 = [regex]::Replace($fixup_json_3, '(?m)^(?!.*\baddHints\b).*$\n?|"(?:\\.|[^"\\])*"(?=\s*:)|(\b(?:\w+(?:\.\w+)*|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b)', { 
                    param($m)
                    if ($m.Groups[1].Success) {
                        '"' + $m.Value + '"' 
                    } else {
                        $m.Value
                    }

                }
            )

            $fixup_json_5 = [regex]::Replace($fixup_json_4, '(?m)^(?!.*\bremoveHints\b).*$\n?|"(?:\\.|[^"\\])*"(?=\s*:)|(\b(?:\w+(?:\.\w+)*|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b)', { 
                    param($m)
                    if ($m.Groups[1].Success) {
                        '"' + $m.Value + '"' 
                    } else {
                        $m.Value
                    }
                }
            )


            $jsonContent = $fixup_json_5 | ConvertFrom-Json
            $jsonContent | Add-Member -NotePropertyName owner -NotePropertyValue $mod_info_object.id
            $skinData += $jsonContent
        } catch {
            Write-Warning "Failed to process SKIN file: $($file.FullName) — $_"
        }
    }
    $groupedData["skins"] += $skinData

    #endregion
    

    
    $groupedData[$mod_info_object.id] = $modData

}

$groupedData["colors"] = $groupedData["colors"] | Merge-Hashtable

$groupedData | ConvertTo-Json -Depth 10  | Set-Content -Path $OutputFile -Encoding UTF8
