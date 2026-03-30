@echo off
title M6 GARAGE
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
set NODE_ENV=production
set CSC_IDENTITY_AUTO_DISCOVERY=false

echo Building Next.js...
call npm run build

echo Starting M6 GARAGE Desktop...
npx electron .
