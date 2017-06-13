REM NOTE!
REM The preferred way to install Selenium and the drivers is to use the following commands
REM from the HAR Viewer project root.

REM   npm run selenium:install

REM And then start Selenium with

REM   npm run selenium:start

REM Assumes IEDriverServer.exe and chromedriver.exe are in the same folder as this batch file.

set          FIREFOX_EXE=c:\apps\Mozilla Firefox\47\firefox.exe
set        IE_DRIVER_EXE=%~dp0IEDriverServer.exe
set    CHROME_DRIVER_EXE=%~dp0chromedriver.exe
set        PHANTOMJS_EXE=c:\apps\phantomjs\2.1.1\bin\phantomjs.exe
set     GECKO_DRIVER_EXE=%~dp0geckodriver.exe

set    CHROME_DRIVER_ARG=-Dwebdriver.chrome.driver="%CHROME_DRIVER_EXE%"
set        IE_DRIVER_ARG=-Dwebdriver.ie.driver="%IE_DRIVER_EXE%"
set   FIREFOX_DRIVER_ARG=-Dwebdriver.firefox.bin="%FIREFOX_EXE%"
set PHANTOMJS_DRIVER_ARG=-Dphantomjs.binary.path="%PHANTOMJS_EXE%"
set     GECKO_DRIVER_ARG=-Dwebdriver.gecko.driver="%GECKO_DRIVER_EXE%"

set  FIREFOX_PROFILE_ARG=-Dwebdriver.firefox.profile=ff47

set DRIVER_ARGS=%FIREFOX_DRIVER_ARG% %CHROME_DRIVER_ARG% %IE_DRIVER_ARG% %PHANTOMJS_DRIVER_ARG% %GECKO_DRIVER_ARG% %FIREFOX_PROFILE_ARG%

REM java -jar server/selenium-server.jar -debug
java -jar %~dp0server\selenium-server.jar %DRIVER_ARGS% -debug
