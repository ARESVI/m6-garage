@echo off
title M6 GARAGE
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
set NODE_ENV=production
start /min npx electron .
