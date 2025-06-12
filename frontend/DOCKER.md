# Frontend Docker Setup

This directory contains Docker configuration for the Angular frontend application.

## 🏗️ Architecture

- **Build Stage**: Node.js 22 Alpine for building the Angular application
- **Runtime Stage**: Nginx 1.25 Alpine for serving static files
- **Multi-stage build** for optimized image size

## 📦 Files

- `Dockerfile` - Multi-stage Docker build configuration
- `nginx.conf` - Nginx configuration for serving Angular SPA
- `docker-entrypoint.sh` - Container startup script with runtime configuration
- `.dockerignore` - Files excluded from Docker build context
- `docker-compose.yml` - Local development setup

## 🚀 Building the Image

```bash
# Build the Docker image
docker build -t innovation-frontend .

# Build with specific tag
docker build -t innovation-frontend:latest .
```

## 🏃 Running the Container

### Using Docker directly:
```bash
# Run with default settings
docker run -p 8080:80 innovation-frontend

# Run with API URL configuration
docker run -p 8080:80 -e API_BASE_URL=http://localhost:5000/api innovation-frontend

# Run with custom environment
docker run -p 8080:80 \
  -e API_BASE_URL=https://innovation-dev-api.azurecontainerapps.io \
  innovation-frontend
```

### Using Docker Compose:
```bash
# Start the frontend service
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop the service
docker-compose down
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API base URL | `http://innovation-dev-api.internal.azurecontainers.io/` |

### Runtime Configuration

The container supports runtime configuration through environment variables:
- API URLs are replaced during container startup
- Nginx configuration can be modified based on environment variables

## 🏥 Health Check

The container includes a health check endpoint:
- **URL**: `http://localhost/health`
- **Method**: GET
- **Response**: `healthy` (200 OK)

## 📊 Container Details

- **Base Images**: 
  - Build: `node:22-alpine`
  - Runtime: `nginx:1.25-alpine`
- **Port**: 80
- **Working Directory**: `/usr/share/nginx/html`
- **Health Check**: Every 30 seconds

## 🔒 Security Features

- Security headers configured in Nginx
- Content Security Policy
- X-Frame-Options protection
- GZIP compression enabled
- Static asset caching

## 📱 Features

- **SPA Support**: Angular routing handled correctly
- **API Proxy**: Built-in proxy for API calls
- **Static Asset Caching**: Optimized caching for JS/CSS/images
- **Health Monitoring**: Health check endpoint
- **Logging**: Nginx access and error logs
- **Compression**: GZIP compression for better performance

## 🛠️ Development

### Local Testing
```bash
# Build and run locally
docker build -t innovation-frontend-dev .
docker run -p 8080:80 innovation-frontend-dev

# Access the application
open http://localhost:8080
```

### Debugging
```bash
# Run with shell access
docker run -it --entrypoint /bin/sh innovation-frontend

# Check nginx configuration
docker run innovation-frontend nginx -t

# View logs
docker logs <container-id>
```

## 🚀 Deployment

### Azure Container Apps
The image is designed to work with Azure Container Apps:
- Ingress configuration matches Container Apps requirements
- Health check endpoint for Container Apps health monitoring
- Environment variable support for runtime configuration

### Production Considerations
- Configure appropriate `API_BASE_URL` for production
- Set up proper SSL/TLS termination at load balancer level
- Configure monitoring and logging
- Set resource limits based on expected load

## 📈 Performance

- **Multi-stage build** reduces final image size
- **Alpine Linux** base for minimal footprint
- **GZIP compression** for faster loading
- **Static asset caching** for repeat visits
- **Optimized nginx configuration** for performance
