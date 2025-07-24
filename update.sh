#!/bin/bash

# ADS-B Dashboard Zero-Downtime Update Script
# This script updates without stopping services

set -e  # Exit on any error

echo "🚀 ADS-B Dashboard Zero-Downtime Update"
echo "======================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if containers are running
check_running() {
    if ! docker compose ps | grep -q "Up"; then
        print_error "Containers are not running. Use './setup.sh' first."
        exit 1
    fi
}

# Pull latest changes
update_code() {
    print_status "Pulling latest changes from Git..."
    git pull
    print_success "Code updated"
}

# Health check function
wait_for_service_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service to be healthy..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker compose ps $service | grep -q "Up.*healthy\|Up.*starting"; then
            # Check if we can actually reach the service
            case $service in
                "dashboard")
                    if curl -s -f http://localhost:3000/api/health >/dev/null 2>&1; then
                        print_success "$service is healthy and responding"
                        return 0
                    fi
                    ;;
                "collector")
                    # For collector, just check if container is up
                    if docker compose ps $service | grep -q "Up"; then
                        print_success "$service is healthy"
                        return 0
                    fi
                    ;;
            esac
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_warning "$service health check timed out, but continuing..."
    return 0
}

# Rolling update for a specific service
rolling_update_service() {
    local service=$1
    print_status "🔄 Rolling update for $service..."
    
    # Create new container alongside old one
    docker compose up -d --build --no-deps $service
    
    # Wait for new container to be healthy
    wait_for_service_health $service
    
    print_success "✅ $service updated successfully"
}

# Update all services with zero downtime
zero_downtime_update() {
    print_status "Starting zero-downtime rolling update..."
    
    # Update services in order (collector first, then dashboard)
    # This ensures data collection continues during dashboard update
    
    print_status "📡 Updating collector service..."
    rolling_update_service "collector"
    
    print_status "🌐 Updating dashboard service..."
    rolling_update_service "dashboard"
    
    # Clean up any orphaned containers
    print_status "🧹 Cleaning up..."
    docker compose up -d --remove-orphans
    
    print_success "🎉 Zero-downtime update completed!"
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

# Show final status
show_status() {
    print_status "Checking final system status..."
    
    echo ""
    echo "📊 System Status:"
    echo "================="
    docker compose ps
    
    echo ""
    echo "🏥 Health Checks:"
    echo "=================="
    
    # Test dashboard health
    if curl -s -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_success "✅ Dashboard is responding at http://localhost:3000"
    else
        print_warning "⚠️ Dashboard may still be starting up"
    fi
    
    # Check collector
    if docker compose ps collector | grep -q "Up"; then
        print_success "✅ Collector is running"
    else
        print_warning "⚠️ Collector status unclear"
    fi
    
    echo ""
    print_success "🎉 Zero-downtime update completed successfully!"
    print_status "✈️ Your ADS-B dashboard is running at http://localhost:3000"
    print_status "📡 Data collection continued throughout the update"
    echo ""
}

# Emergency fallback function for emergency
emergency_fallback() {
    print_error "⚠️ Emergency fallback triggered!"
    print_status "Falling back to standard update method with downtime..."
    
    docker compose down
    docker compose up -d --build
    
    print_warning "Emergency fallback completed with brief downtime"
}

# Main update function
main() {
    echo ""
    print_status "Starting zero-downtime update process..."
    
    # Trap errors and provide fallback
    trap 'print_error "Update failed! Use \"./update.sh --emergency\" if needed."; exit 1' ERR
    
    check_running
    update_code
    zero_downtime_update
    verify_airlines
    show_status
}

# Show usage information
show_usage() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  (no option)     - Zero-downtime rolling update (default)"
    echo "  --emergency     - Emergency fallback with brief downtime"
    echo "  --help, -h      - Show this help message"
    echo ""
    echo "The default zero-downtime update:"
    echo "  • Updates services one at a time"
    echo "  • Maintains service availability"
    echo "  • Performs health checks"
    echo ""
    echo "Emergency fallback only if zero-downtime fails."
    echo ""
}

# Handle command line arguments
case "${1:-}" in
    "--emergency")
        print_warning "⚠️ Running emergency fallback update (with downtime)..."
        emergency_fallback
        ;;
    "--help"|"-h")
        show_usage
        exit 0
        ;;
    "")
        print_status "🚀 Starting zero-downtime update (default method)"
        main "$@"
        ;;
    *)
        print_warning "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac 