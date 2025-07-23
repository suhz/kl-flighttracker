#!/bin/bash

# ADS-B Dashboard Update Script
# This script updates an existing installation

set -e  # Exit on any error

echo "🔄 ADS-B Dashboard Update"
echo "========================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Pull latest changes
update_code() {
    print_status "Pulling latest changes from Git..."
    git pull
    print_success "Code updated"
}

# Stop containers
stop_containers() {
    print_status "Stopping containers..."
    docker compose down
    print_success "Containers stopped"
}

# Rebuild and start
rebuild_containers() {
    print_status "Rebuilding and starting containers..."
    docker compose up -d --build
    print_success "Containers rebuilt and started"
}

# Wait for containers
wait_for_containers() {
    print_status "Waiting for containers to be ready..."
    sleep 10
    
    if docker compose ps | grep -q "Up"; then
        print_success "Containers are running"
    else
        print_warning "Containers may not be fully ready yet"
    fi
}

# Verify airlines data
verify_airlines() {
    print_status "Verifying airlines data..."
    if [ -f "data/airlines.json" ]; then
        print_success "Airlines data is available (curated database)"
    else
        print_warning "Airlines data not found, using fallback"
    fi
}

# Show status
show_status() {
    print_status "Checking system status..."
    
    echo ""
    echo "📊 System Status:"
    echo "================="
    docker compose ps
    
    echo ""
    print_success "🎉 Update completed successfully!"
    print_status "You can access your dashboard at http://localhost:3000"
    echo ""
}

# Main update function
main() {
    echo ""
    print_status "Starting ADS-B Dashboard update..."
    
    update_code
    stop_containers
    rebuild_containers
    wait_for_containers
    verify_airlines
    show_status
}

# Run main function
main "$@" 