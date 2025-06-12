// Infrastructure Bicep template for Innovation Platform - Development Environment
// This template creates all infrastructure resources within a resource group

@description('Application name prefix')
param appName string = 'innovation'

@description('Azure region for resources')
param location string = resourceGroup().location

@description('Tags for all resources')
param tags object = {
  Environment: 'dev'
  Project: 'Innovation'
  ManagedBy: 'Bicep'
}

// Variables
var resourcePrefix = '${appName}-dev'

// Shared Infrastructure Module
module sharedInfra 'modules/shared-infrastructure.bicep' = {
  name: 'shared-infrastructure'
  params: {
    resourcePrefix: resourcePrefix
    location: location
    tags: tags
  }
}

// Azure AI Search Module
module searchService 'modules/azure-search.bicep' = {
  name: 'azure-search'
  params: {
    resourcePrefix: resourcePrefix
    location: location
    tags: tags
  }
}

// Azure Functions Module
module functionsApp 'modules/azure-functions.bicep' = {
  name: 'azure-functions'
  params: {
    resourcePrefix: resourcePrefix
    location: location
    tags: tags
    storageAccountName: sharedInfra.outputs.storageAccountName
    appInsightsConnectionString: sharedInfra.outputs.appInsightsConnectionString
    searchServiceUrl: searchService.outputs.searchServiceUrl
  }
}

// API Container App Module
module apiContainerApp 'modules/api-container-app.bicep' = {
  name: 'api-container-app'
  params: {
    resourcePrefix: resourcePrefix
    location: location
    tags: tags
    containerAppsEnvironmentId: sharedInfra.outputs.containerAppsEnvironmentId
    appInsightsConnectionString: sharedInfra.outputs.appInsightsConnectionString
    searchServiceUrl: searchService.outputs.searchServiceUrl
  }
}

// Frontend Container App Module
module frontendContainerApp 'modules/frontend-container-app.bicep' = {
  name: 'frontend-container-app'
  params: {
    resourcePrefix: resourcePrefix
    location: location
    tags: tags
    containerAppsEnvironmentId: sharedInfra.outputs.containerAppsEnvironmentId
    apiBaseUrl: apiContainerApp.outputs.apiContainerAppUrl
  }
}

// Outputs
output resourceGroupName string = resourceGroup().name
output containerAppsEnvironmentName string = sharedInfra.outputs.containerAppsEnvironmentName
output logAnalyticsWorkspaceName string = sharedInfra.outputs.logAnalyticsWorkspaceName
output appInsightsName string = sharedInfra.outputs.appInsightsName
output functionAppName string = functionsApp.outputs.functionAppName
output functionAppUrl string = functionsApp.outputs.functionAppUrl
output searchServiceName string = searchService.outputs.searchServiceName
output searchServiceUrl string = searchService.outputs.searchServiceUrl
output apiContainerAppName string = apiContainerApp.outputs.apiContainerAppName
output apiContainerAppUrl string = apiContainerApp.outputs.apiContainerAppUrl
output frontendContainerAppName string = frontendContainerApp.outputs.frontendContainerAppName
output frontendContainerAppUrl string = frontendContainerApp.outputs.frontendContainerAppUrl
output storageAccountName string = sharedInfra.outputs.storageAccountName
