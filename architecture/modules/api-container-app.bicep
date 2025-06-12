// API Container App Module
// Creates Container App for ASP.NET Core Web API

@description('Resource prefix for naming')
param resourcePrefix string

@description('Azure region for resources')
param location string

@description('Tags for all resources')
param tags object

@description('Container Apps Environment ID')
param containerAppsEnvironmentId string

@description('Application Insights connection string')
@secure()
param appInsightsConnectionString string

@description('Azure Search service URL')
param searchServiceUrl string

// Variables
var apiContainerAppName = '${resourcePrefix}-api'

// API Container App
resource apiContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: apiContainerAppName
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
      secrets: [
        {
          name: 'appinsights-connection-string'
          value: appInsightsConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          image: 'mcr.microsoft.com/dotnet/samples:aspnetapp'
          name: 'api'
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: 'Development'
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              secretRef: 'appinsights-connection-string'
            }
            {
              name: 'AZURE_SEARCH_ENDPOINT'
              value: searchServiceUrl
            }
          ]
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '10'
              }
            }
          }
        ]
      }
    }
  }
}

// Outputs
output apiContainerAppName string = apiContainerApp.name
output apiContainerAppId string = apiContainerApp.id
output apiContainerAppUrl string = 'https://${apiContainerApp.properties.configuration.ingress.fqdn}'
output apiContainerAppFqdn string = apiContainerApp.properties.configuration.ingress.fqdn
