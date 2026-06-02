@echo off
REM Abre o LUMA (app desktop) em modo desenvolvimento.
REM Duplo-clique neste arquivo e DEIXE esta janela preta aberta enquanto usa o app.
REM Fechar esta janela = fechar o servidor do app.

title LUMA - servidor (nao feche enquanto usar o app)
cd /d "%~dp0apps\desktop"
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

echo.
echo   Iniciando o LUMA... a primeira vez compila o Rust (pode demorar).
echo   Quando a janela do pet abrir, pode usar normalmente.
echo.

call pnpm tauri dev

echo.
echo   O LUMA foi encerrado. Pode fechar esta janela.
pause
