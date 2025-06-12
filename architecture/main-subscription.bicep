// Subscription-level deployment template
// This template creates the resource group and then deploys all resources into it

targetScope = 'subscription'

@description('Application name prefix')
param appName string = 'innovation'

@description('Azure region for resources')
param location string = 'East US'

@description('Tags for all resources')
param tags object = {
  Environment: 'dev'
  Project: 'Innovation'
  ManagedBy: 'Bicep'
}

// Resource Group Module
module resourceGroupModule 'modules/resource-group.bicep' = {
  name: 'resource-group-deployment'
  params: {
    appName: appName
    location: location
    tags: tags
  }
}

// Main Infrastructure Deployment (deployed to the created resource group)
module mainInfrastructure 'main-infrastructure.bicep' = {
  name: 'main-infrastructure-deployment'
  scope: resourceGroup('rg-${appName}-dev')
  params: {
    appName: appName
    location: location
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

// Outputs
output resourceGroupName string = resourceGroupModule.outputs.resourceGroupName
output containerAppsEnvironmentName string = mainInfrastructure.outputs.containerAppsEnvironmentName
output logAnalyticsWorkspaceName string = mainInfrastructure.outputs.logAnalyticsWorkspaceName
output appInsightsName string = mainInfrastructure.outputs.appInsightsName
output functionAppName string = mainInfrastructure.outputs.functionAppName
output functionAppUrl string = mainInfrastructure.outputs.functionAppUrl
output searchServiceName string = mainInfrastructure.outputs.searchServiceName
output searchServiceUrl string = mainInfrastructure.outputs.searchServiceUrl
output apiContainerAppName string = mainInfrastructure.outputs.apiContainerAppName
output apiContainerAppUrl string = mainInfrastructure.outputs.apiContainerAppUrl
output frontendContainerAppName string = mainInfrastructure.outputs.frontendContainerAppName
output frontendContainerAppUrl string = mainInfrastructure.outputs.frontendContainerAppUrl
output storageAccountName string = mainInfrastructure.outputs.storageAccountName
