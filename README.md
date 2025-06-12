# Innovation Challenge - Equipo 1

## Descripción del Proyecto

Esta plataforma de innovación es una solución completa desarrollada con tecnologías modernas de Microsoft Azure, diseñada para demostrar las capacidades de desarrollo en la nube utilizando contenedores, funciones serverless y búsqueda inteligente.

### 🚀 Componentes del Sistema

#### **API (ASP.NET Core Web API)**
Una API REST robusta construida con .NET 8 que actúa como el backend principal de la aplicación. Proporciona endpoints para la gestión de datos y funciona como intermediario entre el frontend y los servicios de Azure. Incluye controladores para verificación de estado (heartbeat) y manejo de datos meteorológicos de ejemplo.

**Características principales:**
- API REST con .NET 8
- Controladores para heartbeat y datos de ejemplo
- Configuración para desarrollo y producción
- Preparada para contenedores Docker

#### **Functions (Azure Functions)**
Aplicación serverless basada en Azure Functions con integración de Semantic Kernel para procesamiento inteligente de documentos. Utiliza el modelo de ejecución aislado de .NET 8 y está optimizada para el procesamiento de documentos con capacidades de IA.

**Características principales:**
- Azure Functions con .NET 8 Isolated
- Integración con Semantic Kernel para IA
- Función de fragmentación de documentos
- Escalabilidad automática y pago por uso

#### **Frontend (Angular 20)**
Aplicación web moderna desarrollada con Angular 20 que proporciona una interfaz de usuario intuitiva y responsiva. Utiliza SCSS para estilos avanzados y está configurada sin renderizado del lado del servidor (SSR) para optimizar el rendimiento en el cliente.

**Características principales:**
- Angular 20 con TypeScript
- Estilos SCSS personalizados
- Arquitectura de componentes moderna
- Optimizada para contenedores con Nginx

#### **Infraestructura como Código (Bicep)**
Conjunto completo de plantillas Bicep para desplegar toda la infraestructura en Azure de manera automatizada. Utiliza un enfoque modular que facilita el mantenimiento y la escalabilidad del sistema.

**Características principales:**
- Despliegue a nivel de suscripción
- Módulos separados para cada servicio
- Configuración optimizada para tier gratuito
- Scripts multiplataforma para despliegue

## 📋 Arquitectura de la Solución

La solución utiliza **Azure Container Apps** para hospedar las aplicaciones, **Azure Functions** para procesamiento serverless, **Azure AI Search** para búsqueda inteligente, y servicios compartidos como **Application Insights** y **Log Analytics** para monitoreo.

## 🛠️ Cómo Ejecutar los Scripts de Bicep

### Prerrequisitos

1. **Azure CLI** instalado y configurado
2. **Suscripción de Azure** con permisos apropiados
3. **PowerShell** (recomendado) o Bash para ejecutar los scripts

### Instalación de Azure CLI

```powershell
# Instalar Azure CLI usando winget
winget install Microsoft.AzureCLI

# O descargar desde: https://docs.microsoft.com/es-es/cli/azure/install-azure-cli
```

### Pasos para el Despliegue

#### 1. **Autenticación en Azure**
```powershell
# Iniciar sesión en Azure
az login

# Verificar la suscripción activa
az account show
```

#### 2. **Navegar al Directorio de Arquitectura**
```powershell
cd c:\src\innovation\architecture
```

#### 3. **Validar las Plantillas (Opcional pero Recomendado)**
```powershell
# Validar sintaxis de las plantillas
.\validate-templates.ps1

# Validar despliegue sin ejecutar
.\deploy.ps1 -Command validate -Environment dev
```

#### 4. **Previsualizar Cambios (What-If)**
```powershell
# Ver qué recursos se crearán sin ejecutar el despliegue
.\deploy.ps1 -Command what-if -Environment dev
```

#### 5. **Desplegar la Infraestructura**
```powershell
# Desplegar todos los recursos en el ambiente de desarrollo
.\deploy.ps1 -Command deploy -Environment dev
```

#### 6. **Verificar el Estado del Despliegue**
```powershell
# Comprobar el estado de los recursos desplegados
.\deploy.ps1 -Command status -Environment dev
```

### Comandos Alternativos

#### **Usando Bash (Linux/macOS/WSL)**
```bash
# Dar permisos de ejecución
chmod +x deploy.sh

# Desplegar
./deploy.sh deploy dev

# Verificar estado
./deploy.sh status dev
```

#### **Usando Batch (Windows)**
```cmd
REM Desplegar infraestructura
deploy.bat deploy dev
```

### Personalización del Despliegue

#### **Modificar Parámetros**
Editar el archivo `parameters.dev.json` para personalizar la configuración:

```json
{
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
        "Project": "Innovation Challenge",
        "Team": "Equipo 1"
      }
    }
  }
}
```

#### **Especificar Ubicación Personalizada**
```powershell
# Desplegar en una región específica
.\deploy.ps1 -Command deploy -Environment dev -Location "West Europe"
```

### Limpieza de Recursos

```powershell
# Eliminar todos los recursos (¡CUIDADO! Esta acción es irreversible)
.\deploy.ps1 -Command cleanup -Environment dev
```

### Solución de Problemas

#### **Errores Comunes y Soluciones**

1. **"Resource provider not registered"**
   ```powershell
   az provider register --namespace Microsoft.App
   az provider register --namespace Microsoft.Search
   az provider register --namespace Microsoft.Web
   ```

2. **"Insufficient permissions"**
   - Verificar que tienes rol de "Colaborador" en la suscripción
   - O rol de "Propietario" para crear grupos de recursos

3. **"Template validation failed"**
   ```powershell
   # Ejecutar validación detallada
   .\deploy.ps1 -Command validate -Environment dev
   ```

### Recursos Creados

El despliegue creará los siguientes recursos en Azure:

- **Grupo de Recursos**: `rg-innovation-dev`
- **Azure AI Search**: Servicio de búsqueda (tier gratuito)
- **Azure Functions**: Aplicación de funciones serverless
- **Container Apps**: Aplicaciones API y Frontend
- **Log Analytics**: Área de trabajo para logs centralizados
- **Application Insights**: Monitoreo de aplicaciones
- **Storage Account**: Almacenamiento para Azure Functions

### Costos Estimados

La configuración está optimizada para el **tier gratuito** y desarrollo:
- **Costo mensual estimado**: $0-10 USD
- Utiliza tiers gratuitos donde es posible
- Escalado automático a 0 cuando no se usa

---

## 📚 Documentación Adicional

- **API**: Ver `api/README.md` para detalles del desarrollo de la API
- **Frontend**: Ver `frontend/README.md` y `frontend/DOCKER.md` para la aplicación web
- **Functions**: Ver `functions/README.md` para las funciones serverless
- **Arquitectura**: Ver `architecture/README.md` para documentación detallada de infraestructura

## 🚀 Desarrollo y Contribución

Para contribuir al proyecto:

1. Clonar el repositorio
2. Instalar dependencias en cada proyecto
3. Configurar el ambiente de desarrollo local
4. Ejecutar tests antes de hacer commits
5. Seguir las convenciones de código establecidas

---

**Equipo 1 - Innovation Challenge 2025**
