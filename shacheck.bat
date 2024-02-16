type conf\version > tmpFile
set /p vers= < tmpFile
echo Version=%vers% > win-src\A
C:\SHA256Calculator\SHA256Calculator.exe --directory .\dist --except defaults.json > tmpFile
set /p sha= < tmpFile
del tmpFile
echo SHA256=%sha% >> win-src\A