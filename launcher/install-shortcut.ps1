# Run once (via install-desktop-shortcut.sh). Copies launcher files to %LOCALAPPDATA%\Recall
# and creates a "Recall" shortcut on the Windows Desktop.
param(
  [Parameter(Mandatory=$true)][string]$Distro,
  [Parameter(Mandatory=$true)][string]$StartScript,
  [Parameter(Mandatory=$true)][int]$Port
)
$ErrorActionPreference = 'Stop'
$dir = Join-Path $env:LOCALAPPDATA 'Recall'
New-Item -ItemType Directory -Force $dir | Out-Null
Copy-Item (Join-Path $PSScriptRoot 'recall-launch.ps1') $dir -Force
Copy-Item (Join-Path $PSScriptRoot 'recall-launch.vbs') $dir -Force

# The multi-size elephant icon (16-256 px) that app/scripts/build-icons.js generates.
Copy-Item (Join-Path $PSScriptRoot 'recall-elephant.ico') $dir -Force
$ico = Join-Path $dir 'recall-elephant.ico'

$desktop = [Environment]::GetFolderPath('Desktop')
$lnk = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $desktop 'Recall.lnk'))
$lnk.TargetPath = Join-Path $env:SystemRoot 'System32\wscript.exe'
$lnk.Arguments = '"' + (Join-Path $dir 'recall-launch.vbs') + '" "' + $Distro + '" "' + $StartScript + '" ' + $Port
$lnk.IconLocation = $ico
$lnk.WorkingDirectory = $dir
$lnk.Description = "Recall (opens http://localhost:$Port in Firefox)"
$lnk.Save()
Write-Output "Created $(Join-Path $desktop 'Recall.lnk')"
