@echo off
echo Setting up Rust environment...

REM Find Rust installation directory
for /d %%i in ("C:\Program Files\Rust*") do set RUST_PATH=%%i\bin

REM Add Rust to PATH for this session
set PATH=%PATH%;%RUST_PATH%

echo Rust environment configured!
echo Cargo version:
cargo --version
echo Rustc version:
rustc --version

echo.
echo Starting Tauri development server...
npm run tauri dev

pause 