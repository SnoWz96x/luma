@echo off
REM Abre o servidor de sincronizacao do LUMA (http://localhost:4000).
REM Opcional — so e preciso se voce quiser sincronizar Desktop <-> Web.
REM Duplo-clique e DEIXE esta janela preta aberta enquanto usa o sync.

title LUMA - sync API (nao feche enquanto sincronizar)
cd /d "%~dp0apps\api"

echo.
echo   Iniciando a API de sync do LUMA em http://localhost:4000 ...
echo   Teste no navegador: http://localhost:4000/health
echo.

call pnpm start

echo.
echo   A API foi encerrada. Pode fechar esta janela.
pause
