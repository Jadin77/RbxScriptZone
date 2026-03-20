@echo off
echo Starting Live Test Server...
echo Keep this window open while testing your website!
echo You can close this window when you are done.
echo.

:: Open the browser silently
start http://localhost:8080

:: Run the python HTTP server
python -m http.server 8080
