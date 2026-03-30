Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c ""cd /d """ & Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\")) & """ && set PATH=C:\Program Files\nodejs;%PATH% && set NODE_ENV=production && npx electron .""", 0, False
