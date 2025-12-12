# Push code to GitHub
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing to GitHub Repository" -ForegroundColor Cyan
Write-Host "https://github.com/regardtvdr/dentist-launch-variant" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "[1/6] Initializing git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "[1/6] Git repository already initialized" -ForegroundColor Green
}

# Set remote
Write-Host ""
Write-Host "[2/6] Setting remote URL..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/regardtvdr/dentist-launch-variant.git
Write-Host "Remote set to: " -NoNewline
git remote get-url origin

# Add all files
Write-Host ""
Write-Host "[3/6] Staging all files..." -ForegroundColor Yellow
git add -A
$staged = git diff --cached --name-only
Write-Host "Staged $($staged.Count) files" -ForegroundColor Green

# Commit
Write-Host ""
Write-Host "[4/6] Creating commit..." -ForegroundColor Yellow
$commitMsg = "Initial commit: Frontend prototype with secure contact form, modern scroll animations, and all features"
git commit -m $commitMsg
if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit created successfully" -ForegroundColor Green
} else {
    Write-Host "No changes to commit or commit failed" -ForegroundColor Yellow
}

# Set branch
Write-Host ""
Write-Host "[5/6] Setting branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "Branch set to main" -ForegroundColor Green

# Push
Write-Host ""
Write-Host "[6/6] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for GitHub credentials." -ForegroundColor Cyan
Write-Host ""
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Push failed. Check the error above." -ForegroundColor Red
    Write-Host "You may need to authenticate with GitHub." -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

