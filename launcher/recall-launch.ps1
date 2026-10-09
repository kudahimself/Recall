# Windows side of the Recall launcher. Starts the WSL server if needed, then opens
# http://localhost:<port> in a normal Firefox window (default profile).
param(
  [Parameter(Mandatory=$true)][string]$Distro,
  [Parameter(Mandatory=$true)][string]$StartScript,  # Linux path to recall-start.sh
  [Parameter(Mandatory=$true)][int]$Port             # from launcher/port
)
$ErrorActionPreference = 'Stop'
$url = "http://localhost:$Port"

function Test-Port {
  try { $c = New-Object Net.Sockets.TcpClient; $r = $c.BeginConnect('localhost', $Port, $null, $null)
        $ok = $r.AsyncWaitHandle.WaitOne(500) -and $c.Connected; $c.Close(); return $ok } catch { return $false }
}

if (-not (Test-Port)) {
  # Hidden. The script builds if needed, then stays alive as the server: WSL stops servers that outlive their wsl.exe session.
  Start-Process -WindowStyle Hidden -FilePath wsl.exe -ArgumentList @('-d', $Distro, '--', 'bash', $StartScript, '--foreground')
  $deadline = (Get-Date).AddMinutes(10)   # first run may include a production build
  while (-not (Test-Port) -and (Get-Date) -lt $deadline) { Start-Sleep -Milliseconds 500 }
  if (-not (Test-Port)) {
    Add-Type -AssemblyName PresentationFramework
    [void][Windows.MessageBox]::Show("Recall did not start. See ~/.local/state/recall/server.log in WSL.", 'Recall')
    exit 1
  }
}

$ff = $null
foreach ($k in 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\firefox.exe','HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\firefox.exe') {
  $p = (Get-ItemProperty $k -ErrorAction SilentlyContinue).'(default)'
  if ($p -and (Test-Path $p)) { $ff = $p; break }
}
if (-not $ff) { foreach ($p in "$env:ProgramFiles\Mozilla Firefox\firefox.exe","${env:ProgramFiles(x86)}\Mozilla Firefox\firefox.exe") { if (Test-Path $p) { $ff = $p; break } } }
if (-not $ff) {
  Add-Type -AssemblyName PresentationFramework
  [void][Windows.MessageBox]::Show("Firefox was not found. Recall is running at $url - open it in Firefox yourself (another browser starts with empty progress).", 'Recall')
  exit 1
}
# No -P / --profile: uses the default profile (or the already running one), so localStorage for this origin persists between launches.
Start-Process -FilePath $ff -ArgumentList @('-new-window', $url)
