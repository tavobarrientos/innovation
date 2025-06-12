#!/bin/bash

# Innovation Platform Deployment Script
# This script helps deploy the infrastructure to different environments

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load configuration
if [ -f "config.env" ]; then
    source config.env
else
    echo -e "${RED}Error: config.env file not found${NC}"
    exit 1
fi

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Azure CLI is installed and authenticated
check_azure_cli() {
    print_status "Checking Azure CLI..."
    
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! az account show &> /dev/null; then
        print_error "Please login to Azure CLI first: az login"
        exit 1
    fi
    
    print_success "Azure CLI is ready"
}

# Function to check if Bicep is installed
check_bicep() {
    print_status "Checking Bicep CLI..."
    
    if ! az bicep version &> /dev/null; then
        print_status "Installing Bicep CLI..."
        az bicep install
    fi
    
    print_success "Bicep CLI is ready"
}

# Function to validate environment parameter
validate_environment() {
    local env=$1
    if [[ ! "$env" =~ ^(dev|test|prod)$ ]]; then
        print_error "Invalid environment. Use: dev, test, or prod"
        exit 1
    fi
}

# Function to set resource group based on environment
get_resource_group() {
    local env=$1
    case $env in
        dev)
            echo $DEV_RESOURCE_GROUP
            ;;
        test)
            echo $TEST_RESOURCE_GROUP
            ;;
        prod)
            echo $PROD_RESOURCE_GROUP
            ;;
    esac
}

# Function to create resource group if it doesn't exist
create_resource_group() {
    local rg=$1
    local location=$2
    
    print_status "Checking if resource group '$rg' exists..."
    
    if ! az group show --name $rg &> /dev/null; then
        print_status "Creating resource group '$rg' in '$location'..."
        az group create --name $rg --location "$location"
        print_success "Resource group '$rg' created"
    else
        print_success "Resource group '$rg' already exists"
    fi
}

# Function to deploy Bicep template
deploy_infrastructure() {
    local env=$1
    local location=${2:-$PRIMARY_REGION}
    
    print_status "Deploying infrastructure for '$env' environment..."
    
    local deployment_name="innovation-${env}-$(date +%Y%m%d-%H%M%S)"
    local parameters_file="parameters.${env}.json"
    
    if [ ! -f "$parameters_file" ]; then
        print_error "Parameters file '$parameters_file' not found"
        exit 1
    fi
    
    print_status "Starting subscription-level deployment '$deployment_name'..."
    
    az deployment sub create \
        --location $location \
        --template-file main.bicep \
        --parameters @$parameters_file \
        --name $deployment_name \
        --verbose
    
    print_success "Deployment completed successfully"
    
    # Get deployment outputs
    print_status "Retrieving deployment outputs..."
    az deployment sub show \
        --name $deployment_name \
        --query properties.outputs \
        --output table
}

# Function to validate Bicep template
validate_template() {
    local env=$1
    local location=${2:-$PRIMARY_REGION}
    local parameters_file="parameters.${env}.json"
    
    print_status "Validating Bicep template for '$env' environment..."
    
    if [ ! -f "$parameters_file" ]; then
        print_error "Parameters file '$parameters_file' not found"
        exit 1
    fi
    
    az deployment sub validate \
        --location $location \
        --template-file main.bicep \
        --parameters @$parameters_file
    
    print_success "Template validation passed"
}

# Function to what-if deployment
what_if_deployment() {
    local env=$1
    local location=${2:-$PRIMARY_REGION}
    local parameters_file="parameters.${env}.json"
    
    print_status "Running what-if analysis for '$env' environment..."
    
    if [ ! -f "$parameters_file" ]; then
        print_error "Parameters file '$parameters_file' not found"
        exit 1
    fi
    
    az deployment sub what-if \
        --location $location \
        --template-file main.bicep \
        --parameters @$parameters_file
}

# Function to clean up resources
cleanup_environment() {
    local env=$1
    local rg="rg-innovation-$env"
    
    print_warning "This will delete ALL resources in resource group '$rg'"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deleting resource group '$rg'..."
        az group delete --name $rg --yes --no-wait
        print_success "Resource group deletion initiated"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to show deployment status
show_status() {
    local env=$1
    local rg="rg-innovation-$env"
    
    print_status "Checking deployment status for '$env' environment..."
    
    # Show recent subscription-level deployments
    print_status "Recent subscription deployments:"
    az deployment sub list \
        --query "[?starts_with(name, 'innovation-$env')].{Name:name, State:properties.provisioningState, Timestamp:properties.timestamp}" \
        --output table
    
    # Check if resource group exists and show resources
    if ! az group show --name $rg &> /dev/null; then
        print_warning "Resource group '$rg' does not exist yet"
        return
    fi
    
    # Show resources
    print_status "Resources in '$rg':"
    az resource list \
        --resource-group $rg \
        --query "[].{Name:name, Type:type, Location:location}" \
        --output table
}

# Function to show help
show_help() {
    echo "Innovation Platform Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [ENVIRONMENT] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy infrastructure to specified environment"
    echo "  validate   Validate Bicep template for specified environment"
    echo "  what-if    Show what changes would be made"
    echo "  status     Show current deployment status"
    echo "  cleanup    Delete all resources in environment"
    echo "  help       Show this help message"
    echo ""
    echo "Environments:"
    echo "  dev        Development environment (free tier)"
    echo "  test       Test environment (basic tier)"
    echo "  prod       Production environment (standard tier)"
    echo ""
    echo "Examples:"
    echo "  $0 deploy dev                    # Deploy to development"
    echo "  $0 validate test                 # Validate test template"
    echo "  $0 what-if prod                  # Preview production changes"
    echo "  $0 status dev                    # Show dev environment status"
    echo "  $0 cleanup test                  # Clean up test environment"
    echo ""
    echo "Options:"
    echo "  --location LOCATION              # Override default region"
    echo "  --resource-group NAME            # Override default resource group"
}

# Main script logic
main() {
    local command=$1
    local environment=$2
    local location=$PRIMARY_REGION
    local custom_rg=""
    
    # Parse additional arguments
    shift 2 2>/dev/null || true
    while [[ $# -gt 0 ]]; do
        case $1 in
            --location)
                location="$2"
                shift 2
                ;;
            --resource-group)
                custom_rg="$2"
                shift 2
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    case $command in
        deploy)
            if [ -z "$environment" ]; then
                print_error "Environment is required for deploy command"
                show_help
                exit 1
            fi
            validate_environment $environment
            check_azure_cli
            check_bicep
            
            deploy_infrastructure $environment "$location"
            ;;
        validate)
            if [ -z "$environment" ]; then
                print_error "Environment is required for validate command"
                show_help
                exit 1
            fi
            validate_environment $environment
            check_azure_cli
            check_bicep
            validate_template $environment "$location"
            ;;
        what-if)
            if [ -z "$environment" ]; then
                print_error "Environment is required for what-if command"
                show_help
                exit 1
            fi
            validate_environment $environment
            check_azure_cli
            check_bicep
            
            what_if_deployment $environment "$location"
            ;;
        status)
            if [ -z "$environment" ]; then
                print_error "Environment is required for status command"
                show_help
                exit 1
            fi
            validate_environment $environment
            check_azure_cli
            show_status $environment
            ;;
        cleanup)
            if [ -z "$environment" ]; then
                print_error "Environment is required for cleanup command"
                show_help
                exit 1
            fi
            validate_environment $environment
            check_azure_cli
            cleanup_environment $environment
            ;;
        help|--help|-h)
            show_help
            ;;
        "")
            print_error "Command is required"
            show_help
            exit 1
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
