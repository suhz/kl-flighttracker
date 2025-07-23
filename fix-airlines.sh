#!/bin/bash

# Fix Airlines Data Script
# This script fixes permission issues with airlines data

echo "🔧 Fixing Airlines Data Permissions"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "Ensuring data directory has proper permissions..."
docker compose exec dashboard chown -R nextjs:nodejs /app/data/ 2>/dev/null || {
    print_warning "Could not change ownership (might be running as different user)"
}

print_status "Creating airlines.json file with proper permissions..."
docker compose exec dashboard touch /app/data/airlines.json
docker compose exec dashboard chmod 664 /app/data/airlines.json

print_status "Fetching airlines data..."
if docker compose exec dashboard npm run fetch-airlines; then
    print_success "Airlines data fetched successfully!"
else
    print_warning "Airlines fetch failed. Check the logs:"
    docker compose logs dashboard --tail 10
fi

print_status "Checking final permissions..."
docker compose exec dashboard ls -la /app/data/airlines.json 