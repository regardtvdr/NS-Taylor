# PowerShell script to start the development server
# This bypasses PowerShell execution policy issues

Write-Host "Starting Premium Dental Booking System..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    & npm.cmd install
    Write-Host ""
}

Write-Host "Starting Vite dev server..." -ForegroundColor Green
Write-Host "The app will open at http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

& npm.cmd run dev

