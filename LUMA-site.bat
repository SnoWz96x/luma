@echo off
REM Abre o site do LUMA em modo desenvolvimento (http://localhost:3000).
REM Duplo-clique e DEIXE esta janela preta aberta enquanto navega.
REM Fechar esta janela = derrubar o site.

title LUMA - site (nao feche enquanto navegar)
cd /d "%~dp0apps\web"

echo.
echo   Limpando cache e iniciando o site do LUMA em http://localhost:3000 ...
echo   Quando aparecer "Ready", abra esse endereco no navegador.
echo.

REM limpa o cache .next para evitar erro de chunk corrompido
if exist ".next" rmdir /s /q ".next"

call pnpm dev

echo.
echo   O site foi encerrado. Pode fechar esta janela.
pause
