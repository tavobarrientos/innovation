// Azure AI Search Module
// Creates Azure AI Search service configured for free tier development

@description('Resource prefix for naming')
param resourcePrefix string

@description('Azure region for resources')
param location string

@description('Tags for all resources')
param tags object

// Variables
var searchServiceName = '${resourcePrefix}-search'

// Azure AI Search Service (Free Tier)
resource searchService 'Microsoft.Search/searchServices@2024-06-01-preview' = {
  name: searchServiceName
  location: location
  tags: tags
  sku: {
    name: 'free'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    publicNetworkAccess: 'enabled'
    networkRuleSet: {
      ipRules: []
    }
    encryptionWithCmk: {
      enforcement: 'Unspecified'
    }
    disableLocalAuth: false
    authOptions: {
      apiKeyOnly: {}
    }
    semanticSearch: 'disabled' // Free tier doesn't support semantic search
  }
}

// Outputs
output searchServiceName string = searchService.name
output searchServiceId string = searchService.id
output searchServiceUrl string = 'https://${searchService.name}.search.windows.net'
