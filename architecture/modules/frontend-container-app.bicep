// Frontend Container App Module
// Creates Container App for Angular frontend application

@description('Resource prefix for naming')
param resourcePrefix string

@description('Azure region for resources')
param location string

@description('Tags for all resources')
param tags object

@description('Container Apps Environment ID')
param containerAppsEnvironmentId string

@description('API base URL for frontend configuration')
param apiBaseUrl string

// Variables
var frontendContainerAppName = '${resourcePrefix}-frontend'

// Frontend Container App
resource frontendContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: frontendContainerAppName
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      ingress: {
        external: true
        targetPort: 80
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
    }
    template: {
      containers: [
        {
          image: 'nginx:alpine'
          name: 'frontend'
          env: [
            {
              name: 'API_BASE_URL'
              value: apiBaseUrl
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
output frontendContainerAppName string = frontendContainerApp.name
output frontendContainerAppId string = frontendContainerApp.id
output frontendContainerAppUrl string = 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'
output frontendContainerAppFqdn string = frontendContainerApp.properties.configuration.ingress.fqdn
