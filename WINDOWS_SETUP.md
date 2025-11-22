# Windows Setup Guide

## Quick Start

Since you're on Windows with PowerShell execution policy restrictions, use one of these methods:

### Method 1: Use npm.cmd (Recommended)
Instead of `npm`, use `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Method 2: Use the PowerShell Script
Run the provided script:
```powershell
.\start-dev.ps1
```

### Method 3: Fix PowerShell Execution Policy (One-time)
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use `npm` normally:
```powershell
npm install
npm run dev
```

## Current Status

✅ Node.js v24.11.1 - Installed  
✅ npm v11.6.2 - Available  
✅ Dependencies - Installed  
✅ Dev Server - Starting...

## Access the App

Once the dev server starts, open your browser to:
**http://localhost:3000**

The server should automatically open your default browser.

## Troubleshooting

### Port 3000 Already in Use
If you see an error about port 3000, either:
1. Close the other application using port 3000
2. Change the port in `vite.config.ts` (line 14)

### Still Can't Run npm
Use `npm.cmd` instead of `npm` in all commands.

### Need to Restart
If you close the terminal, just run:
```powershell
npm.cmd run dev
```

