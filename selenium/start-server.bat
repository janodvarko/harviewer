set FIREFOX_PATH=c:\apps\Mozilla Firefox 37
set IE_DRIVER_PATH=d:\dev\git_repos\harviewer2\selenium\iedriver\2.45.0
set CHROME_DRIVER_EXE=d:\dev\git_repos\harviewer2\selenium\chromedriver\2.15\chromedriver.exe

set path=%FIREFOX_PATH%;%IE_DRIVER_PATH%;%PATH%

set CHROME_DRIVER_ARG=-Dwebdriver.chrome.driver="%CHROME_DRIVER_EXE%"

REM java -jar server/selenium-server.jar -debug
java -jar server/selenium-server.jar %CHROME_DRIVER_ARG% -debug
