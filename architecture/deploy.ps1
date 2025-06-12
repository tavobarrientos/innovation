# PowerShell deployment script for Innovation Platform
# This script provides cross-platform deployment capabilities

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("deploy", "validate", "what-if", "status", "cleanup", "help")]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "test", "prod")]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US",
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup,
    
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionId
)

# Configuration
$config = @{
    AppName = "innovation"
    PrimaryRegion = "East US"
    SecondaryRegion = "West US 2"
    ResourceGroups = @{
        dev = "rg-innovation-dev"
        test = "rg-innovation-test"
        prod = "rg-innovation-prod"
    }
}

# Color functions for cross-platform output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$ForegroundColor = "White"
    )
    
    if ($PSVersionTable.PSVersion.Major -ge 6) {
        # PowerShell Core supports colors
        Write-Host $Message -ForegroundColor $ForegroundColor
    } else {
        # Windows PowerShell
        Write-Host $Message -ForegroundColor $ForegroundColor
    }
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "[SUCCESS] $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check if Azure CLI is installed
    try {
        $azVersion = az version --output json | ConvertFrom-Json
        Write-Success "Azure CLI version $($azVersion.'azure-cli') is installed"
    }
    catch {
        Write-Error "Azure CLI is not installed. Please install it first."
        return $false
    }
    
    # Check if logged in to Azure
    try {
        $account = az account show --output json | ConvertFrom-Json
        Write-Success "Logged in to Azure subscription: $($account.name)"
    }
    catch {
        Write-Error "Please login to Azure CLI first: az login"
        return $false
    }
    
    # Check if Bicep is installed
    try {
        az bicep version | Out-Null
        Write-Success "Bicep CLI is available"
    }
    catch {
        Write-Info "Installing Bicep CLI..."
        az bicep install
        Write-Success "Bicep CLI installed"
    }
    
    return $true
}

# Function to get resource group name
function Get-ResourceGroupName {
    param([string]$Env)
    
    if ($ResourceGroup) {
        return $ResourceGroup
    }
    
    return $config.ResourceGroups[$Env]
}

# Function to create resource group if it doesn't exist
function New-ResourceGroupIfNotExists {
    param(
        [string]$ResourceGroupName,
        [string]$Location
    )
    
    Write-Info "Checking if resource group '$ResourceGroupName' exists..."
    
    try {
        az group show --name $ResourceGroupName --output none
        Write-Success "Resource group '$ResourceGroupName' already exists"
    }
    catch {
        Write-Info "Creating resource group '$ResourceGroupName' in '$Location'..."
        az group create --name $ResourceGroupName --location $Location --output none
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Resource group '$ResourceGroupName' created"
        } else {
            Write-Error "Failed to create resource group"
            return $false
        }
    }
    
    return $true
}

# Function to deploy infrastructure
function Invoke-InfrastructureDeploy {
    param(
        [string]$Env,
        [string]$Location
    )
    
    Write-Info "Deploying infrastructure for '$Env' environment..."
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $deploymentName = "innovation-$Env-$timestamp"
    $parametersFile = "parameters.$Env.json"
    
    if (-not (Test-Path $parametersFile)) {
        Write-Error "Parameters file '$parametersFile' not found"
        return $false
    }
    
    Write-Info "Starting subscription-level deployment '$deploymentName'..."
    
    az deployment sub create `
        --location $Location `
        --template-file "main.bicep" `
        --parameters "@$parametersFile" `
        --name $deploymentName `
        --verbose
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Deployment completed successfully"
        
        # Get deployment outputs
        Write-Info "Retrieving deployment outputs..."
        az deployment sub show `
            --name $deploymentName `
            --query "properties.outputs" `
            --output table
        
        return $true
    } else {
        Write-Error "Deployment failed"
        return $false
    }
}

# Function to validate template
function Test-BicepTemplate {
    param(
        [string]$Env,
        [string]$Location
    )
    
    $parametersFile = "parameters.$Env.json"
    
    Write-Info "Validating Bicep template for '$Env' environment..."
    
    if (-not (Test-Path $parametersFile)) {
        Write-Error "Parameters file '$parametersFile' not found"
        return $false
    }
    
    az deployment sub validate `
        --location $Location `
        --template-file "main.bicep" `
        --parameters "@$parametersFile"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Template validation passed"
        return $true
    } else {
        Write-Error "Template validation failed"
        return $false
    }
}

# Function to run what-if analysis
function Invoke-WhatIfAnalysis {
    param(
        [string]$Env,
        [string]$Location
    )
    
    $parametersFile = "parameters.$Env.json"
    
    Write-Info "Running what-if analysis for '$Env' environment..."
    
    if (-not (Test-Path $parametersFile)) {
        Write-Error "Parameters file '$parametersFile' not found"
        return $false
    }
    
    az deployment sub what-if `
        --location $Location `
        --template-file "main.bicep" `
        --parameters "@$parametersFile"
    
    return $true
}

# Function to show deployment status
function Show-DeploymentStatus {
    param([string]$Env)
  # Function to show deployment status
function Show-DeploymentStatus {
    param([string]$Env)
    
    Write-Info "Checking deployment status for '$Env' environment..."
    
    # Show recent subscription-level deployments
    Write-Info "Recent subscription deployments:"
    az deployment sub list `
        --query "[?starts_with(name, 'innovation-$Env')].{Name:name, State:properties.provisioningState, Timestamp:properties.timestamp}" `
        --output table
    
    # Check if resource group exists and show resources
    $resourceGroupName = "rg-innovation-$Env"
    try {
        az group show --name $resourceGroupName --output none
        Write-Info "Resources in '$resourceGroupName':"
        az resource list `
            --resource-group $resourceGroupName `
            --query "[].{Name:name, Type:type, Location:location}" `
            --output table
    }
    catch {
        Write-Warning "Resource group '$resourceGroupName' does not exist yet"
    }
}
}

# Function to cleanup environment
function Remove-Environment {
    param([string]$Env)
    
    $resourceGroupName = "rg-innovation-$Env"
    
    Write-Warning "This will delete ALL resources in resource group '$resourceGroupName'"
    $confirmation = Read-Host "Are you sure you want to continue? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Write-Info "Deleting resource group '$resourceGroupName'..."
        az group delete --name $resourceGroupName --yes --no-wait
        Write-Success "Resource group deletion initiated"
    } else {
        Write-Info "Cleanup cancelled"
    }
}

# Function to show help
function Show-Help {
    Write-Host @"
Innovation Platform Deployment Script (PowerShell)

Usage: .\deploy.ps1 -Command <command> -Environment <env> [options]

Commands:
  deploy     Deploy infrastructure to specified environment
  validate   Validate Bicep template for specified environment
  what-if    Show what changes would be made
  status     Show current deployment status
  cleanup    Delete all resources in environment
  help       Show this help message

Environments:
  dev        Development environment (free tier)
  test       Test environment (basic tier)
  prod       Production environment (standard tier)

Examples:
  .\deploy.ps1 -Command deploy -Environment dev
  .\deploy.ps1 -Command validate -Environment test
  .\deploy.ps1 -Command what-if -Environment prod
  .\deploy.ps1 -Command status -Environment dev
  .\deploy.ps1 -Command cleanup -Environment test

Options:
  -Location <location>         Override default region
  -ResourceGroup <name>        Override default resource group
  -SubscriptionId <id>         Set specific subscription
"@
}

# Main script execution
function Main {
    # Set subscription if provided
    if ($SubscriptionId) {
        Write-Info "Setting Azure subscription to: $SubscriptionId"
        az account set --subscription $SubscriptionId
    }
    
    # Check prerequisites
    if (-not (Test-Prerequisites)) {
        exit 1
    }
      # Execute command
    switch ($Command) {
        "deploy" {
            if (-not $Environment) {
                Write-Error "Environment is required for deploy command"
                Show-Help
                exit 1
            }
            
            if (-not (Invoke-InfrastructureDeploy -Env $Environment -Location $Location)) {
                exit 1
            }
        }
        
        "validate" {
            if (-not $Environment) {
                Write-Error "Environment is required for validate command"
                Show-Help
                exit 1
            }
            
            if (-not (Test-BicepTemplate -Env $Environment -Location $Location)) {
                exit 1
            }
        }
        
        "what-if" {
            if (-not $Environment) {
                Write-Error "Environment is required for what-if command"
                Show-Help
                exit 1
            }
            
            Invoke-WhatIfAnalysis -Env $Environment -Location $Location
        }
        
        "status" {
            if (-not $Environment) {
                Write-Error "Environment is required for status command"
                Show-Help
                exit 1
            }
            
            Show-DeploymentStatus -Env $Environment
        }
        
        "cleanup" {
            if (-not $Environment) {
                Write-Error "Environment is required for cleanup command"
                Show-Help
                exit 1
            }
            
            Remove-Environment -Env $Environment
        }
        
        "help" {
            Show-Help
        }
        
        default {
            Write-Error "Unknown command: $Command"
            Show-Help
            exit 1
        }
    }
}

# Execute main function
Main
