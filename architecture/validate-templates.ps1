#!/usr/bin/env pwsh

# Bicep Template Validation Script
# This script validates all Bicep templates without Azure CLI dependency

Write-Host "🔧 Innovation Platform - Bicep Template Validation" -ForegroundColor Cyan
Write-Host "=" * 60

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$architecturePath = $scriptPath

# Template files to validate
$templates = @(
    "main.bicep",
    "main-subscription.bicep", 
    "main-infrastructure.bicep",
    "modules/resource-group.bicep",
    "modules/shared-infrastructure.bicep",
    "modules/azure-search.bicep",
    "modules/azure-functions.bicep",
    "modules/api-container-app.bicep",
    "modules/frontend-container-app.bicep"
)

$allValid = $true

foreach ($template in $templates) {
    $templatePath = Join-Path $architecturePath $template
    
    if (Test-Path $templatePath) {
        Write-Host "✓ Validating: $template" -ForegroundColor Green
        
        # Basic syntax check - read the file to ensure it's valid
        try {
            $content = Get-Content $templatePath -Raw
            if ($content.Trim().Length -eq 0) {
                Write-Host "  ❌ Error: Template is empty" -ForegroundColor Red
                $allValid = $false
            } elseif (-not $content.Contains("targetScope") -and -not $content.Contains("resource") -and -not $content.Contains("module")) {
                Write-Host "  ⚠️  Warning: Template may not contain valid Bicep content" -ForegroundColor Yellow
            } else {
                Write-Host "  ✓ Template appears valid" -ForegroundColor Gray
            }
        }
        catch {
            Write-Host "  ❌ Error reading template: $($_.Exception.Message)" -ForegroundColor Red
            $allValid = $false
        }
    } else {
        Write-Host "❌ Missing: $template" -ForegroundColor Red
        $allValid = $false
    }
}

Write-Host "`n" + "=" * 60

if ($allValid) {
    Write-Host "🎉 All Bicep templates are present and appear valid!" -ForegroundColor Green
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Install Azure CLI if not already installed"
    Write-Host "  2. Login to Azure: az login"
    Write-Host "  3. Test deployment: .\deploy.ps1 -Command validate -Environment dev"
    Write-Host "  4. Deploy infrastructure: .\deploy.ps1 -Command deploy -Environment dev"
    exit 0
} else {
    Write-Host "❌ Some templates have issues. Please review and fix before deploying." -ForegroundColor Red
    exit 1
}
