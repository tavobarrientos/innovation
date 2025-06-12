# Innovation Platform - Infrastructure as Code

This directory contains the Bicep templates and deployment scripts for the Innovation Platform infrastructure on Azure.

## 🏗️ Architecture Overview

The Innovation Platform uses a modular Bicep architecture deployed at the subscription level to create:

- **Resource Group**: Automatically created for the environment
- **Shared Infrastructure**: Log Analytics, Application Insights, Storage Account, Container Apps Environment
- **Azure AI Search**: Free tier search service for document indexing
- **Azure Functions**: Serverless compute with Semantic Kernel integration
- **API Container App**: ASP.NET Core Web API in Azure Container Apps
- **Frontend Container App**: Angular 20 application in Azure Container Apps

## 📁 File Structure

```
architecture/
├── main.bicep                    # Main entry point (subscription-level)
├── main-subscription.bicep       # Subscription orchestration template
├── main-infrastructure.bicep     # Resource group-level infrastructure
├── parameters.dev.json           # Development environment parameters
├── config.env                    # Environment configuration
├── deploy.ps1                    # PowerShell deployment script
├── deploy.sh                     # Bash deployment script  
├── deploy.bat                    # Windows batch deployment script
├── validate-templates.ps1        # Template validation utility
└── modules/
    ├── resource-group.bicep       # Resource group creation
    ├── shared-infrastructure.bicep # Common infrastructure
    ├── azure-search.bicep         # Azure AI Search service
    ├── azure-functions.bicep      # Azure Functions app
    ├── api-container-app.bicep    # API container application
    └── frontend-container-app.bicep # Frontend container application
```

## 🚀 Quick Start

### Prerequisites

1. **Azure CLI**: Install from [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
2. **Bicep CLI**: Will be auto-installed by Azure CLI
3. **Azure Subscription**: With appropriate permissions

### Deployment Steps

1. **Login to Azure**:
   ```bash
   az login
   ```

2. **Validate Templates** (optional):
   ```powershell
   .\validate-templates.ps1
   ```

3. **Test Deployment** (what-if analysis):
   ```powershell
   .\deploy.ps1 -Command what-if -Environment dev
   ```

4. **Deploy Infrastructure**:
   ```powershell
   .\deploy.ps1 -Command deploy -Environment dev
   ```

5. **Check Status**:
   ```powershell
   .\deploy.ps1 -Command status -Environment dev
   ```

## 🛠️ Deployment Commands

### PowerShell (Windows/Cross-platform)
```powershell
# Deploy to development
.\deploy.ps1 -Command deploy -Environment dev

# Validate templates
.\deploy.ps1 -Command validate -Environment dev

# Preview changes
.\deploy.ps1 -Command what-if -Environment dev

# Check deployment status
.\deploy.ps1 -Command status -Environment dev

# Clean up resources
.\deploy.ps1 -Command cleanup -Environment dev
```

### Bash (Linux/macOS)
```bash
# Deploy to development
./deploy.sh deploy dev

# Validate templates  
./deploy.sh validate dev

# Preview changes
./deploy.sh what-if dev

# Check deployment status
./deploy.sh status dev

# Clean up resources
./deploy.sh cleanup dev
```

### Windows Batch
```cmd
REM Deploy to development
deploy.bat deploy dev

REM Validate templates
deploy.bat validate dev
```

## ⚙️ Environment Configuration

### Development Environment (Free Tier)
- **Resource Group**: `rg-innovation-dev`
- **Azure AI Search**: Free tier (50 MB, 3 indexes)
- **Azure Functions**: Consumption plan
- **Container Apps**: Free tier allowances
- **Storage**: Standard LRS

### Parameters File
Edit `parameters.dev.json` to customize deployment:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "appName": {
      "value": "innovation"
    },
    "location": {
      "value": "East US"
    },
    "tags": {
      "value": {
        "Environment": "dev",
        "Project": "Innovation",
        "ManagedBy": "Bicep"
      }
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **"Resource provider not registered"**:
   ```bash
   az provider register --namespace Microsoft.App
   az provider register --namespace Microsoft.Search
   az provider register --namespace Microsoft.Web
   ```

2. **"Insufficient permissions"**:
   - Ensure you have `Contributor` role on the subscription
   - Or `Owner` role for resource group creation

3. **"Bicep CLI not found"**:
   ```bash
   az bicep install
   ```

4. **Template validation errors**:
   ```powershell
   .\deploy.ps1 -Command validate -Environment dev
   ```

### Debugging Deployments

1. **Check deployment logs**:
   ```bash
   az deployment sub list --query "[?starts_with(name, 'innovation')].{Name:name, State:properties.provisioningState}"
   ```

2. **View specific deployment**:
   ```bash
   az deployment sub show --name <deployment-name>
   ```

3. **Resource group status**:
   ```bash
   az resource list --resource-group rg-innovation-dev --output table
   ```

## 🏷️ Resource Naming Convention

| Resource Type | Naming Pattern | Example |
|---------------|----------------|---------|
| Resource Group | `rg-{appName}-{env}` | `rg-innovation-dev` |
| Storage Account | `{appName}{env}stor{hash}` | `innovationdevstor123` |
| Function App | `{appName}-{env}-func` | `innovation-dev-func` |
| Search Service | `{appName}-{env}-search` | `innovation-dev-search` |
| Container App | `{appName}-{env}-{type}` | `innovation-dev-api` |
| Log Analytics | `{appName}-{env}-logs` | `innovation-dev-logs` |

## 🔐 Security Considerations

- Application Insights connection strings are marked as `@secure()`
- Storage account keys are managed by Azure
- Container Apps use managed identity where possible
- Network access is restricted to HTTPS only

## 📈 Cost Management

The development environment is designed for minimal cost:
- **Azure AI Search**: Free tier (no cost)
- **Azure Functions**: Consumption plan (pay-per-execution)
- **Container Apps**: Free monthly allowances
- **Storage**: Minimal usage on Standard LRS

### Estimated Monthly Cost
- **Free tier usage**: ~$0-10 USD/month
- **Light development usage**: ~$10-25 USD/month

## 🔄 Updates and Maintenance

### Updating Infrastructure
1. Modify Bicep templates
2. Test with `what-if` command
3. Deploy changes
4. Verify deployment

### Template Versioning
- All templates use latest stable API versions
- Regular updates recommended for new Azure features
- Test changes in development before production

## 📚 Additional Resources

- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [Azure Container Apps](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Azure AI Search](https://docs.microsoft.com/en-us/azure/search/)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)

---

For questions or issues, please refer to the troubleshooting section or create an issue in the repository.
