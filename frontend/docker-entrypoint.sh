#!/bin/sh
set -e

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [FRONTEND] $1"
}

log "Starting Angular frontend container..."

# Replace environment variables in nginx config if needed
if [ -n "$API_BASE_URL" ]; then
    log "Configuring API base URL: $API_BASE_URL"
    sed -i "s|http://innovation-dev-api.internal.azurecontainers.io/|$API_BASE_URL|g" /etc/nginx/nginx.conf
fi

# Replace environment variables in built app if needed
if [ -n "$API_BASE_URL" ]; then
    log "Updating runtime configuration..."
    find /usr/share/nginx/html -name "*.js" -exec sed -i "s|API_BASE_URL_PLACEHOLDER|$API_BASE_URL|g" {} \;
fi

# Validate nginx configuration
log "Validating nginx configuration..."
nginx -t

log "Starting nginx..."
exec "$@"
