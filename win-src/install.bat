@echo off
tar xf ./nginx-1.24.0.zip
mkdir C:\nginx
xcopy nginx-1.24.0\* C:\nginx\ /e /s /y
xcopy nginx.bat C:\nginx\ /y
xcopy nginx.conf C:\nginx\conf\ /y
powershell -command "Start-Process cmd -ArgumentList '/c cd /d %CD% && install_autorun.bat' -Verb runas"
schtasks /run /tn "NGINX\NginxStart"