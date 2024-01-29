#define EngName "sonica.vasya"
#define Publisher "AVM-Energo"
#define URL "info@avmenergo.ru"
#define AppVersion "{code:GetVersionFromFile|'..\conf\version'}"
#define InstallDirName "c:\www\vasya"

[Setup]
AppName={#EngName}
AppCopyright="Copyright (c) 2024 {#Publisher}"
AppVersion={#AppVersion}
AppVerName={#EngName} {#AppVersion}
DefaultDirName={#InstallDirName}
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
OutputBaseFilename="{#EngName}"
OutputDir="..\output"
UsePreviousLanguage=No
LicenseFile="license.txt"
// AlwaysRestart=yes

[Languages]
Name: Russian; MessagesFile: "compiler:Languages\Russian.isl" 

[Dirs]
Name: "{tmp}"; Flags: deleteafterinstall;

[Files]
Source: "..\dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
Source: "preuninstall.bat"; DestDir: "{app}";
Source: "nginx-1.24.0.zip"; DestDir: "{tmp}";
Source: "install.bat"; DestDir: "{tmp}";
// Source: "install_autorun.bat"; DestDir: "{tmp}";
Source: "nginx.bat"; DestDir: "{tmp}";
Source: "*.conf"; DestDir: "{tmp}";
Source: "settings.ini"; DestDir: "{localappdata}\Sonica\Vasya\Settings";
Source: "A"; DestDir: "{localappdata}\Sonica\Vasya\Settings";

[Run]
Filename: "{tmp}\install.bat"; StatusMsg: "Installing Nginx...";
Filename: "C:\nginx\nginx.bat";

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "Nginx"; ValueData: "C:\nginx\nginx.bat"; Flags: uninsdeletekey

[UninstallRun]
Filename: "{app}\preuninstall.bat"; RunOnceId: "DelService";

[Code]
function GetVersionFromFile(Param: String) : String;
var
  fileName, tempStr:String;
  svArray: TArrayOfString;
  bExist:Boolean;
  nLines:Integer;
begin
  fileName := Param;
  bExist := FileExists(fileName);
  if (bExist = True) then
  begin
    LoadStringsFromFile(fileName, svArray);
    nLines := GetArrayLength(svArray);
    if (nLines > 0) then
    begin
      tempStr := svArray[0];
      Result := tempStr;
    end;
  end;
end;