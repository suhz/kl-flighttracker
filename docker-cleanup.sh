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
    echo "  (no option)     - Project-only cleanup (safe, default)"
    echo "  --system-wide   - System-wide cleanup (all Docker resources)"
    echo "  --aggressive    - Aggressive system-wide cleanup (includes volumes)"
    echo "  --dry-run       - Show what would be cleaned without doing it"
    echo "  --help, -h      - Show this help message"
    echo ""
    echo "Project-only cleanup removes (DEFAULT):"
    echo "  • Stopped containers from this project only"
    echo "  • Unused images from this project only"
    echo "  • Build cache (system-wide)"
    echo ""
    echo "System-wide cleanup removes:"
    echo "  • ALL stopped containers"
    echo "  • ALL unused images"
    echo "  • Build cache"
    echo ""
    echo "Aggressive cleanup also removes:"
    echo "  • Unused volumes (be careful!)"
    echo "  • Unused networks"
    echo ""
    echo "⚠️  Project-only mode is safest for multi-project servers"
    echo "💡 All modes keep active/running containers and their images"
    echo ""
}

# Standard Docker cleanup (PROJECT-ONLY by default)
standard_cleanup() {
    local dry_run=${1:-false}
    local system_wide=${2:-false}
    
    if [ "$dry_run" = "true" ]; then
        print_warning "DRY RUN MODE - No changes will be made"
        echo ""
    fi
    
    if [ "$system_wide" = "true" ]; then
        print_status "🧹 Running system-wide Docker cleanup..."
    else
        print_status "🧹 Running project-only Docker cleanup..."
    fi
    
    # Get project name from docker-compose
    local project_name=$(docker compose config --format json 2>/dev/null | grep -o '"name":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "adsb-dashboard")
    
    # Show current disk usage
    print_status "📊 Docker disk usage before cleanup:"
    docker system df
    echo ""
    
    if [ "$system_wide" = "true" ]; then
        # System-wide cleanup
        print_status "🗑️ Removing ALL stopped containers..."
        if [ "$dry_run" = "true" ]; then
            docker container ls -a --filter "status=exited" --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"
        else
            if docker container prune -f | grep -q "deleted"; then
                print_success "Removed stopped containers"
            else
                print_status "No stopped containers to remove"
            fi
        fi
        
        print_status "🗑️ Removing ALL unused images..."
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
    else
        # Project-only cleanup
        print_status "🗑️ Removing stopped ${project_name} containers..."
        if [ "$dry_run" = "true" ]; then
            docker compose ps -a --format "table {{.Name}}\t{{.State}}\t{{.Status}}" 2>/dev/null || echo "No project containers found"
        else
            local stopped_containers=$(docker compose ps -a --services --filter "status=exited" 2>/dev/null || echo "")
            if [ -n "$stopped_containers" ]; then
                docker compose rm -f
                print_success "Removed stopped project containers"
            else
                print_status "No stopped project containers to remove"
            fi
        fi
        
        print_status "🗑️ Removing unused ${project_name} images..."
        if [ "$dry_run" = "true" ]; then
            docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | grep "${project_name}" || echo "No project images found"
        else
            local project_images=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "^${project_name}" | head -n -2 2>/dev/null || echo "")
            if [ -n "$project_images" ]; then
                echo "$project_images" | while read -r image; do
                    if [ -n "$image" ] && ! docker ps --format "{{.Image}}" | grep -q "$image"; then
                        docker rmi "$image" 2>/dev/null && echo "Removed: $image" || true
                    fi
                done
                print_success "Removed old project images"
            else
                print_status "No old project images to remove"
            fi
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
        if [ "$system_wide" = "true" ]; then
            print_success "✅ System-wide cleanup completed!"
            print_status "ℹ️  Cleaned ALL Docker resources (keeps active ones)"
        else
            print_success "✅ Project-only cleanup completed!"
            print_status "ℹ️  Only cleaned ${project_name} containers and images"
        fi
    else
        echo ""
        print_status "✅ Dry run completed - no changes made"
        if [ "$system_wide" = "true" ]; then
            print_status "ℹ️  Would clean ALL Docker resources"
        else
            print_status "ℹ️  Would only clean ${project_name} containers and images"
        fi
    fi
}

# Aggressive Docker cleanup (SYSTEM-WIDE)
aggressive_cleanup() {
    print_warning "⚠️ Running AGGRESSIVE Docker cleanup (system-wide)..."
    print_warning "This will remove ALL unused images and volumes!"
    echo ""
    
    # Run standard cleanup first (system-wide)
    standard_cleanup false true
    
    echo ""
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
    "--system-wide")
        standard_cleanup false true
        ;;
    "--aggressive")
        aggressive_cleanup
        ;;
    "--dry-run")
        if [ "${2:-}" = "--system-wide" ]; then
            standard_cleanup true true
        else
            standard_cleanup true false
        fi
        ;;
    "--help"|"-h")
        show_usage
        exit 0
        ;;
    "")
        standard_cleanup false false
        ;;
    *)
        print_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac 