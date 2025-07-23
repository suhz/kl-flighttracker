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

print_status "Running airlines fetch as root user to avoid permission issues..."

# Run the fetch command as root user (like we do with collector)
if docker compose exec -u root dashboard npm run fetch-airlines; then
    print_success "Airlines data fetched successfully!"
    
    print_status "Setting proper file permissions..."
    # After successful fetch, set proper permissions
    docker compose exec -u root dashboard chown nextjs:nodejs /app/data/airlines.json 2>/dev/null || true
    docker compose exec -u root dashboard chmod 664 /app/data/airlines.json 2>/dev/null || true
    
else
    print_warning "Airlines fetch failed. Trying alternative approach..."
    
    # Alternative: use collector container (which runs as root)
    print_status "Trying with collector container..."
    if docker compose exec collector npm run fetch-airlines; then
        print_success "Airlines data fetched via collector!"
    else
        print_warning "Both attempts failed. Check the logs:"
        docker compose logs dashboard --tail 10
        exit 1
    fi
fi

print_status "Checking final result..."
docker compose exec dashboard ls -la /app/data/airlines.json 2>/dev/null || {
    print_warning "airlines.json file not found, but this might be OK if the fetch succeeded"
} 