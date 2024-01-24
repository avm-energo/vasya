reg add HKLM\Software\Microsoft\Windows\CurrentVersion\Run /v Nginx /d C:\nginx\nginx.bat /f
rem SCHTASKS /CREATE /SC ONSTART /TN "NGINX\NginxStart" /TR "C:\nginx\nginx.bat" /f