#!/bin/bash

# DietPi Troubleshooting Script
# This script helps diagnose and fix collector issues on DietPi

set -e

echo "🔧 DietPi Troubleshooting Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check system info
check_system() {
    print_status "Checking system information..."
    echo "Architecture: $(uname -m)"
    echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
    echo "Docker version: $(docker --version)"
    echo "Docker Compose version: $(docker compose version)"
}

# Check if source files exist
check_source_files() {
    print_status "Checking source files..."
    
    if [ -f "src/collector/index.ts" ]; then
        print_success "src/collector/index.ts exists"
    else
        print_error "src/collector/index.ts not found!"
        exit 1
    fi
    
    if [ -f "tsconfig.json" ]; then
        print_success "tsconfig.json exists"
    else
        print_error "tsconfig.json not found!"
        exit 1
    fi
}

# Clean and rebuild
clean_rebuild() {
    print_status "Cleaning and rebuilding..."
    
    docker compose down
    docker system prune -f
    docker compose up -d --build --no-cache
    
    print_success "Rebuild completed"
}

# Test collector inside container
test_collector() {
    print_status "Testing collector inside container..."
    
    # Check if files exist in container
    docker compose exec collector ls -la /app/src/collector/
    
    # Try to run collector manually
    print_status "Attempting to run collector manually..."
    docker compose exec collector npm run collector || {
        print_error "Collector failed to start"
        print_status "Checking container logs..."
        docker compose logs collector --tail 20
        return 1
    }
}

# Show debugging info
show_debug_info() {
    print_status "Gathering debug information..."
    
    echo ""
    echo "📊 Container Status:"
    docker compose ps
    
    echo ""
    echo "📋 Collector Logs:"
    docker compose logs collector --tail 10
    
    echo ""
    echo "🔍 File System Check:"
    docker compose exec collector find /app -name "*.ts" | head -10
    
    echo ""
    echo "📦 Package Check:"
    docker compose exec collector ls -la /app/node_modules/ | grep tsx
}

# Main function
main() {
    echo ""
    print_status "Starting DietPi troubleshooting..."
    
    check_system
    check_source_files
    clean_rebuild
    
    # Wait for containers to start
    sleep 10
    
    if test_collector; then
        print_success "Collector is working!"
    else
        print_error "Collector is still having issues"
        show_debug_info
        echo ""
        print_warning "Try these manual steps:"
        echo "1. Check your Ultrafeeder IP in .env file"
        echo "2. Ensure DietPi has enough disk space"
        echo "3. Try: docker compose exec collector sh -c 'ls -la /app/src/collector/'"
        echo "4. Check: docker compose exec collector node -e \"console.log('Node.js works')\""
    fi
}

# Run main function
main "$@" 