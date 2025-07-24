#!/bin/bash

# ADS-B Dashboard Docker Cleanup Script
# Cleans up Docker images, containers, and build cache to free disk space

set -e  # Exit on any error

echo "🧹 ADS-B Dashboard Docker Cleanup"
echo "================================="

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

# Show usage
show_usage() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  (no option)  - Standard cleanup (safe)"
    echo "  --aggressive - Aggressive cleanup (removes more images)"
    echo "  --dry-run    - Show what would be cleaned without doing it"
    echo "  --help, -h   - Show this help message"
    echo ""
    echo "Standard cleanup removes:"
    echo "  • All stopped containers"
    echo "  • All unused images (docker image prune -a)"
    echo "  • Build cache"
    echo ""
    echo "Aggressive cleanup also removes:"
    echo "  • Unused volumes (be careful!)"
    echo "  • Unused networks"
    echo ""
    echo "⚠️  Both modes keep active/running containers and their images"
    echo ""
}

# Standard Docker cleanup
standard_cleanup() {
    local dry_run=${1:-false}
    
    if [ "$dry_run" = "true" ]; then
        print_warning "DRY RUN MODE - No changes will be made"
        echo ""
    fi
    
    print_status "🧹 Running standard Docker cleanup..."
    
    # Show current disk usage
    print_status "📊 Docker disk usage before cleanup:"
    docker system df
    echo ""
    
    # Remove stopped containers
    print_status "🗑️ Removing stopped containers..."
    if [ "$dry_run" = "true" ]; then
        docker container ls -a --filter "status=exited" --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"
    else
        if docker container prune -f | grep -q "deleted"; then
            print_success "Removed stopped containers"
        else
            print_status "No stopped containers to remove"
        fi
    fi
    
    # Remove all unused images (as suggested)
    print_status "🗑️ Removing all unused images..."
    if [ "$dry_run" = "true" ]; then
        docker images --filter "dangling=false" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | head -20
        echo "... (and more unused images)"
    else
        if docker image prune -a -f | grep -q "deleted"; then
            print_success "Removed unused images"
        else
            print_status "No unused images to remove"
        fi
    fi
    
    # Clean build cache
    print_status "🗑️ Cleaning build cache..."
    if [ "$dry_run" = "true" ]; then
        docker builder du
    else
        if docker builder prune -f | grep -q "deleted"; then
            print_success "Cleaned build cache"
        else
            print_status "No build cache to clean"
        fi
    fi
    
    if [ "$dry_run" != "true" ]; then
        # Show disk usage after cleanup
        echo ""
        print_status "📊 Docker disk usage after cleanup:"
        docker system df
        echo ""
        print_success "✅ Standard cleanup completed!"
        print_status "ℹ️  Removed all unused images and containers (keeps active ones)"
    else
        echo ""
        print_status "✅ Dry run completed - no changes made"
        print_status "ℹ️  Would remove all unused images and containers"
    fi
}

# Aggressive Docker cleanup
aggressive_cleanup() {
    print_warning "⚠️ Running AGGRESSIVE Docker cleanup..."
    print_warning "This will remove ALL unused images and volumes!"
    echo ""
    
    # Run standard cleanup first
    standard_cleanup false
    
    echo ""
    print_status "🗑️ Removing ALL unused images..."
    if docker image prune -a -f | grep -q "deleted"; then
        print_success "Removed all unused images"
    else
        print_status "No unused images to remove"
    fi
    
    print_status "🗑️ Removing unused volumes..."
    if docker volume prune -f | grep -q "deleted"; then
        print_success "Removed unused volumes"
    else
        print_status "No unused volumes to remove"
    fi
    
    print_status "🗑️ Removing unused networks..."
    if docker network prune -f | grep -q "deleted"; then
        print_success "Removed unused networks"
    else
        print_status "No unused networks to remove"
    fi
    
    echo ""
    print_success "✅ Aggressive Docker cleanup completed!"
    print_warning "⚠️ Make sure your services are still working properly"
}

# Handle command line arguments
case "${1:-}" in
    "--aggressive")
        aggressive_cleanup
        ;;
    "--dry-run")
        standard_cleanup true
        ;;
    "--help"|"-h")
        show_usage
        exit 0
        ;;
    "")
        standard_cleanup false
        ;;
    *)
        print_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac 