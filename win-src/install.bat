@echo off
if exist c:\nginx\nginx.exe (
  xcopy nginx.conf C:\nginx\conf\ /y
  if not exist "C:\nginx\conf\conf.d" mkdir C:\nginx\conf\conf.d
  xcopy vasya.conf C:\nginx\conf\conf.d /y
) else (
  tar xf ./nginx-1.24.0.zip
  mkdir C:\nginx
  xcopy nginx-1.24.0\* C:\nginx\ /e /s /y
  mkdir C:\nginx\conf\conf.d
  xcopy nginx.bat C:\nginx\ /y
  xcopy nginx.conf C:\nginx\conf\ /y
  xcopy vasya.conf C:\nginx\conf\conf.d /y
  rem powershell -command "Start-Process cmd -ArgumentList '/c cd /d %CD% && install_autorun.bat' -Verb runas"
  rem schtasks /run /tn "NGINX\NginxStart"
)
