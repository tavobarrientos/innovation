@echo off
setlocal enabledelayedexpansion

REM Innovation Platform Deployment Script for Windows
REM This script helps deploy the infrastructure to different environments

REM Color codes for output (Windows compatible)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Load configuration from config.env (simplified for Windows)
if not exist "config.env" (
    echo %RED%[ERROR]%NC% config.env file not found
    exit /b 1
)

REM Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

REM Function to check if Azure CLI is installed and authenticated
:check_azure_cli
call :print_status "Checking Azure CLI..."

where az >nul 2>nul
if %errorlevel% neq 0 (
    call :print_error "Azure CLI is not installed. Please install it first."
    exit /b 1
)

az account show >nul 2>nul
if %errorlevel% neq 0 (
    call :print_error "Please login to Azure CLI first: az login"
    exit /b 1
)

call :print_success "Azure CLI is ready"
goto :eof

REM Function to check if Bicep is installed
:check_bicep
call :print_status "Checking Bicep CLI..."

az bicep version >nul 2>nul
if %errorlevel% neq 0 (
    call :print_status "Installing Bicep CLI..."
    az bicep install
)

call :print_success "Bicep CLI is ready"
goto :eof

REM Function to validate environment parameter
:validate_environment
set "env=%~1"
if "%env%"=="dev" goto :eof
if "%env%"=="test" goto :eof
if "%env%"=="prod" goto :eof
call :print_error "Invalid environment. Use: dev, test, or prod"
exit /b 1

REM Function to get resource group based on environment
:get_resource_group
set "env=%~1"
if "%env%"=="dev" (
    set "result=rg-innovation-dev"
) else if "%env%"=="test" (
    set "result=rg-innovation-test"
) else if "%env%"=="prod" (
    set "result=rg-innovation-prod"
)
goto :eof

REM Function to create resource group if it doesn't exist
:create_resource_group
set "rg=%~1"
set "location=%~2"

call :print_status "Checking if resource group '%rg%' exists..."

az group show --name %rg% >nul 2>nul
if %errorlevel% neq 0 (
    call :print_status "Creating resource group '%rg%' in '%location%'..."
    az group create --name %rg% --location "%location%"
    call :print_success "Resource group '%rg%' created"
) else (
    call :print_success "Resource group '%rg%' already exists"
)
goto :eof

REM Function to deploy Bicep template
:deploy_infrastructure
set "env=%~1"
set "rg=%~2"
set "location=%~3"

call :print_status "Deploying infrastructure for '%env%' environment..."

REM Generate deployment name with timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,8%-%dt:~8,6%"
set "deployment_name=innovation-%env%-%timestamp%"
set "parameters_file=parameters.%env%.json"

if not exist "%parameters_file%" (
    call :print_error "Parameters file '%parameters_file%' not found"
    exit /b 1
)

call :print_status "Starting deployment '%deployment_name%'..."

az deployment group create --resource-group %rg% --template-file main.bicep --parameters @%parameters_file% --name %deployment_name% --verbose

if %errorlevel% equ 0 (
    call :print_success "Deployment completed successfully"
    
    REM Get deployment outputs
    call :print_status "Retrieving deployment outputs..."
    az deployment group show --resource-group %rg% --name %deployment_name% --query properties.outputs --output table
) else (
    call :print_error "Deployment failed"
    exit /b 1
)
goto :eof

REM Function to validate Bicep template
:validate_template
set "env=%~1"
set "parameters_file=parameters.%env%.json"

call :print_status "Validating Bicep template for '%env%' environment..."

if not exist "%parameters_file%" (
    call :print_error "Parameters file '%parameters_file%' not found"
    exit /b 1
)

call :get_resource_group %env%
az deployment group validate --resource-group !result! --template-file main.bicep --parameters @%parameters_file%

if %errorlevel% equ 0 (
    call :print_success "Template validation passed"
) else (
    call :print_error "Template validation failed"
    exit /b 1
)
goto :eof

REM Function to what-if deployment
:what_if_deployment
set "env=%~1"
set "rg=%~2"
set "parameters_file=parameters.%env%.json"

call :print_status "Running what-if analysis for '%env%' environment..."

if not exist "%parameters_file%" (
    call :print_error "Parameters file '%parameters_file%' not found"
    exit /b 1
)

az deployment group what-if --resource-group %rg% --template-file main.bicep --parameters @%parameters_file%
goto :eof

REM Function to clean up resources
:cleanup_environment
set "env=%~1"
call :get_resource_group %env%
set "rg=!result!"

call :print_warning "This will delete ALL resources in resource group '%rg%'"
set /p "confirm=Are you sure you want to continue? (y/N): "

if /i "%confirm%"=="y" (
    call :print_status "Deleting resource group '%rg%'..."
    az group delete --name %rg% --yes --no-wait
    call :print_success "Resource group deletion initiated"
) else (
    call :print_status "Cleanup cancelled"
)
goto :eof

REM Function to show deployment status
:show_status
set "env=%~1"
call :get_resource_group %env%
set "rg=!result!"

call :print_status "Checking deployment status for '%env%' environment..."

az group show --name %rg% >nul 2>nul
if %errorlevel% neq 0 (
    call :print_warning "Resource group '%rg%' does not exist"
    goto :eof
)

REM Show recent deployments
call :print_status "Recent deployments:"
az deployment group list --resource-group %rg% --query "[?starts_with(name, 'innovation-%env%')].{Name:name, State:properties.provisioningState, Timestamp:properties.timestamp}" --output table

REM Show resources
call :print_status "Resources in '%rg%':"
az resource list --resource-group %rg% --query "[].{Name:name, Type:type, Location:location}" --output table
goto :eof

REM Function to show help
:show_help
echo Innovation Platform Deployment Script for Windows
echo.
echo Usage: %~nx0 [COMMAND] [ENVIRONMENT] [OPTIONS]
echo.
echo Commands:
echo   deploy     Deploy infrastructure to specified environment
echo   validate   Validate Bicep template for specified environment
echo   what-if    Show what changes would be made
echo   status     Show current deployment status
echo   cleanup    Delete all resources in environment
echo   help       Show this help message
echo.
echo Environments:
echo   dev        Development environment (free tier)
echo   test       Test environment (basic tier)
echo   prod       Production environment (standard tier)
echo.
echo Examples:
echo   %~nx0 deploy dev                    # Deploy to development
echo   %~nx0 validate test                 # Validate test template
echo   %~nx0 what-if prod                  # Preview production changes
echo   %~nx0 status dev                    # Show dev environment status
echo   %~nx0 cleanup test                  # Clean up test environment
echo.
goto :eof

REM Main script logic
set "command=%~1"
set "environment=%~2"
set "location=East US"

if "%command%"=="" (
    call :print_error "Command is required"
    call :show_help
    exit /b 1
)

if "%command%"=="deploy" (
    if "%environment%"=="" (
        call :print_error "Environment is required for deploy command"
        call :show_help
        exit /b 1
    )
    call :validate_environment %environment%
    if %errorlevel% neq 0 exit /b 1
    call :check_azure_cli
    if %errorlevel% neq 0 exit /b 1
    call :check_bicep
    if %errorlevel% neq 0 exit /b 1
    call :get_resource_group %environment%
    set "rg=!result!"
    call :create_resource_group "!rg!" "%location%"
    if %errorlevel% neq 0 exit /b 1
    call :deploy_infrastructure %environment% "!rg!" "%location%"
) else if "%command%"=="validate" (
    if "%environment%"=="" (
        call :print_error "Environment is required for validate command"
        call :show_help
        exit /b 1
    )
    call :validate_environment %environment%
    if %errorlevel% neq 0 exit /b 1
    call :check_azure_cli
    if %errorlevel% neq 0 exit /b 1
    call :check_bicep
    if %errorlevel% neq 0 exit /b 1
    call :validate_template %environment%
) else if "%command%"=="what-if" (
    if "%environment%"=="" (
        call :print_error "Environment is required for what-if command"
        call :show_help
        exit /b 1
    )
    call :validate_environment %environment%
    if %errorlevel% neq 0 exit /b 1
    call :check_azure_cli
    if %errorlevel% neq 0 exit /b 1
    call :check_bicep
    if %errorlevel% neq 0 exit /b 1
    call :get_resource_group %environment%
    set "rg=!result!"
    call :what_if_deployment %environment% "!rg!"
) else if "%command%"=="status" (
    if "%environment%"=="" (
        call :print_error "Environment is required for status command"
        call :show_help
        exit /b 1
    )
    call :validate_environment %environment%
    if %errorlevel% neq 0 exit /b 1
    call :check_azure_cli
    if %errorlevel% neq 0 exit /b 1
    call :show_status %environment%
) else if "%command%"=="cleanup" (
    if "%environment%"=="" (
        call :print_error "Environment is required for cleanup command"
        call :show_help
        exit /b 1
    )
    call :validate_environment %environment%
    if %errorlevel% neq 0 exit /b 1
    call :check_azure_cli
    if %errorlevel% neq 0 exit /b 1
    call :cleanup_environment %environment%
) else if "%command%"=="help" (
    call :show_help
) else (
    call :print_error "Unknown command: %command%"
    call :show_help
    exit /b 1
)
