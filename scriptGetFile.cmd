@echo off
setlocal
set SRC_DIR=%~dp0src
set OUTPUT_FILE=%~dp0src_combined.txt

if exist "%OUTPUT_FILE%" del "%OUTPUT_FILE%"

for /R "%SRC_DIR%" %%f in (*.ts *.tsx *.js *.json *.css *.md) do (
    echo ----- Archivo: %%~nxf ----- >> "%OUTPUT_FILE%"
    type "%%f" >> "%OUTPUT_FILE%" 2>>nul
    echo. >> "%OUTPUT_FILE%"
)

echo Código exportado en: %OUTPUT_FILE%
pause
