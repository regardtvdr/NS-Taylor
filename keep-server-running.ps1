# Keep Server Running Script
# This script will restart the server if it stops

Write-Host "Starting Premium Dental Booking Server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    $server = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.MainWindowTitle -like "*vite*" }
    $port = netstat -ano | Select-String ":3000"
    
    if (-not $port) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Server not detected, restarting..." -ForegroundColor Yellow
        Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm.cmd run dev" -WindowStyle Minimized
        Start-Sleep -Seconds 8
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Server is running on http://localhost:3000" -ForegroundColor Green
    }
    
    Start-Sleep -Seconds 10
}

