@echo off
title SecureAuth UI - Local Server (Port 8000)
echo ========================================================
echo   Menjalankan Server Web UI/UX Verifikasi OTP
echo   Akses di Browser: http://127.0.0.1:8000/
echo ========================================================
echo.
start http://127.0.0.1:8000/
php -S 127.0.0.1:8000
pause
