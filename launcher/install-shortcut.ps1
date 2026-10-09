# Run once (via install-desktop-shortcut.sh). Copies launcher files to %LOCALAPPDATA%\Recall
# and creates a "Recall" shortcut on the Windows Desktop.
param(
  [Parameter(Mandatory=$true)][string]$Distro,
  [Parameter(Mandatory=$true)][string]$StartScript,
  [Parameter(Mandatory=$true)][int]$Port,
  [Parameter(Mandatory=$true)][string]$LogoPng        # Windows path to app/public/logo192.png
)
$ErrorActionPreference = 'Stop'
$dir = Join-Path $env:LOCALAPPDATA 'Recall'
New-Item -ItemType Directory -Force $dir | Out-Null
Copy-Item (Join-Path $PSScriptRoot 'recall-launch.ps1') $dir -Force
Copy-Item (Join-Path $PSScriptRoot 'recall-launch.vbs') $dir -Force

# Build an .ico that wraps the app's PNG logo.
$png = [IO.File]::ReadAllBytes($LogoPng)
$ms = New-Object IO.MemoryStream; $bw = New-Object IO.BinaryWriter $ms
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]1)
$bw.Write([byte]192); $bw.Write([byte]192); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32); $bw.Write([uint32]$png.Length); $bw.Write([uint32]22)
$bw.Write($png); $bw.Flush()
$ico = Join-Path $dir 'recall.ico'
[IO.File]::WriteAllBytes($ico, $ms.ToArray())

$desktop = [Environment]::GetFolderPath('Desktop')
$lnk = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $desktop 'Recall.lnk'))
$lnk.TargetPath = Join-Path $env:SystemRoot 'System32\wscript.exe'
$lnk.Arguments = '"' + (Join-Path $dir 'recall-launch.vbs') + '" "' + $Distro + '" "' + $StartScript + '" ' + $Port
$lnk.IconLocation = $ico
$lnk.WorkingDirectory = $dir
$lnk.Description = "Recall (opens http://localhost:$Port in Firefox)"
$lnk.Save()
Write-Output "Created $(Join-Path $desktop 'Recall.lnk')"
