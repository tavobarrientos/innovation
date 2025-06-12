// Resource Group Module
// Creates the resource group for all Innovation Platform resources

@description('Application name prefix')
param appName string

@description('Azure region for resources')
param location string

@description('Tags for all resources')
param tags object

// Variables
var resourceGroupName = 'rg-${appName}-dev'

// Target scope for resource group creation
targetScope = 'subscription'

// Resource Group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

// Outputs
output resourceGroupName string = resourceGroup.name
output resourceGroupId string = resourceGroup.id
output location string = resourceGroup.location
