type conf\version > tmpFile
set /p myvar= < tmpFile
del tmpFile
rename ".\output\sonica.vasya.exe" "sonica.vasya-%myvar%-all.exe"