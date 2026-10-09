' Runs recall-launch.ps1 with no console flash. Args: Distro, StartScript, Port
Set a = WScript.Arguments
ps = CreateObject("WScript.Shell").ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Recall\recall-launch.ps1"
cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps & """ -Distro """ & a(0) & """ -StartScript """ & a(1) & """ -Port " & a(2)
CreateObject("WScript.Shell").Run cmd, 0, False
