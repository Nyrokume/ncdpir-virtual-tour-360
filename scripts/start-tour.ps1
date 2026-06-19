#Requires -Version 5.1
<#
.SYNOPSIS
  Установка зависимостей и запуск виртуального тура НЦДПИиР.

.EXAMPLE
  .\scripts\start-tour.ps1
.EXAMPLE
  .\scripts\start-tour.ps1 dev -MarkerEdit
.EXAMPLE
  .\scripts\start-tour.ps1 build
.EXAMPLE
  .\scripts\start-tour.ps1 preview
.EXAMPLE
  .\scripts\start-tour.ps1 install
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('dev', 'build', 'preview', 'install')]
    [string]$Action = 'dev',

    [switch]$MarkerEdit,
    [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.Encoding]::UTF8
} catch {
    # ignore on hosts without UTF-8 console
}

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $ProjectRoot

function Write-Step([string]$Message) {
    Write-Host ''
    Write-Host ">> $Message" -ForegroundColor Cyan
}

function Write-Ok([string]$Message) {
    Write-Host "   $Message" -ForegroundColor Green
}

function Write-Err([string]$Message) {
    Write-Host "   $Message" -ForegroundColor Red
}

function Stop-WithError([string]$Message) {
    Write-Err $Message
    exit 1
}

function Test-NodeJs {
    Write-Step 'Проверка Node.js...'

    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Stop-WithError 'Node.js не найден. Установите LTS 20+ с https://nodejs.org/'
    }

    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Stop-WithError 'npm не найден. Переустановите Node.js с https://nodejs.org/'
    }

    $version = (node -p 'process.versions.node').Trim()
    $major = [int]($version.Split('.')[0])

    if ($major -lt 18) {
        Stop-WithError "Node.js $version устарел. Нужна версия 18+ (рекомендуется 20 LTS)."
    }

    Write-Ok "Node.js $version, npm $(npm -v)"
}

function Invoke-NpmInstall {
    Write-Step 'Установка зависимостей (npm install)...'

    npm install
    if ($LASTEXITCODE -ne 0) {
        Stop-WithError 'npm install завершился с ошибкой. Если проблема в sharp - см. README.md'
    }

    Write-Ok 'Зависимости установлены'
}

function Ensure-Dependencies {
    if ($SkipInstall) {
        if (-not (Test-Path (Join-Path $ProjectRoot 'node_modules'))) {
            Stop-WithError 'node_modules не найден. Запустите: .\scripts\start-tour.ps1 install'
        }
        return
    }

    $needsInstall = -not (Test-Path (Join-Path $ProjectRoot 'node_modules'))
    $lockFile = Join-Path $ProjectRoot 'package-lock.json'

    if (-not $needsInstall -and (Test-Path $lockFile)) {
        $lockTime = (Get-Item $lockFile).LastWriteTimeUtc
        $modulesTime = (Get-Item (Join-Path $ProjectRoot 'node_modules')).LastWriteTimeUtc
        if ($lockTime -gt $modulesTime) {
            $needsInstall = $true
            Write-Ok 'package-lock.json новее node_modules - обновляем зависимости'
        }
    }

    if ($needsInstall -or $Action -eq 'install') {
        Invoke-NpmInstall
    } else {
        Write-Ok 'Зависимости уже установлены (node_modules)'
    }
}

function Start-DevServer {
    Write-Step 'Запуск dev-сервера...'
    Write-Ok 'Адрес: http://localhost:3000/'
    Write-Ok 'Редактор маркеров: иконка ключа в верхнем меню'

    if ($MarkerEdit) {
        Write-Ok 'Откроется: http://localhost:3000/?markerEdit'
        npx vite --open '/?markerEdit'
    } else {
        npm run dev
    }

    if ($LASTEXITCODE -ne 0) {
        Stop-WithError "Dev-сервер завершился с ошибкой (код $LASTEXITCODE)"
    }
}

function Start-Build {
    Write-Step 'Сборка production (npm run build)...'
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Stop-WithError "Сборка завершилась с ошибкой (код $LASTEXITCODE)"
    }
    Write-Ok 'Готово: папка dist'
}

function Start-Preview {
    $distPath = Join-Path $ProjectRoot 'dist'
    if (-not (Test-Path $distPath)) {
        Write-Ok 'dist не найден - сначала выполняем сборку'
        Start-Build
    }

    Write-Step 'Запуск preview собранного сайта...'
    Write-Ok 'Обычно: http://localhost:4173/'
    npm run preview
    if ($LASTEXITCODE -ne 0) {
        Stop-WithError "Preview завершился с ошибкой (код $LASTEXITCODE)"
    }
}

Write-Host ''
Write-Host 'НЦДПИиР - виртуальный тур 360' -ForegroundColor White
Write-Host "Папка проекта: $ProjectRoot" -ForegroundColor DarkGray

Test-NodeJs
Ensure-Dependencies

if ($Action -eq 'install') {
    Write-Step 'Готово. Запуск: .\scripts\start-tour.ps1 dev'
    exit 0
}

switch ($Action) {
    'dev' { Start-DevServer }
    'build' { Start-Build }
    'preview' { Start-Preview }
}
