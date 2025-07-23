#!/bin/bash

# ADS-B Dashboard Setup Script
# This script initializes everything needed for the first time

set -e  # Exit on any error

echo "🛫 ADS-B Dashboard Setup"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Create data directory
create_data_dir() {
    print_status "Creating data directory..."
    mkdir -p data
    print_success "Data directory created"
}

# Create .env file if it doesn't exist
setup_env() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cat > .env << EOF
# Database configuration
DATABASE_URL="file:/app/data/aircraft.db"

# Ultrafeeder configuration
ULTRAFEEDER_HOST="http://192.168.1.50:8080"

# Collection settings
POLL_INTERVAL=30000
DATA_RETENTION_DAYS=30

# Application settings
NODE_ENV=production
PORT=3000
EOF
        print_success "Created .env file with default settings"
        print_warning "Please edit .env file to match your Ultrafeeder IP address"
    else
        print_status ".env file already exists"
    fi
}

# Build and start containers
start_containers() {
    print_status "Building and starting Docker containers..."
    
    # Stop any existing containers
    docker compose down 2>/dev/null || true
    
    # Build and start
    docker compose up -d --build
    
    print_success "Containers started successfully"
}

# Wait for containers to be ready
wait_for_containers() {
    print_status "Waiting for containers to be ready..."
    sleep 10
    
    # Check if containers are running
    if docker compose ps | grep -q "Up"; then
        print_success "Containers are running"
    else
        print_error "Containers failed to start properly"
        docker compose logs
        exit 1
    fi
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Push schema to database
    docker compose exec collector npx prisma db push
    
    print_success "Database initialized"
}

# Fetch airlines data
fetch_airlines() {
    print_status "Fetching airlines data..."
    
    # Wait a bit for the collector to be ready
    sleep 5
    
    # Ensure data directory has proper permissions
    docker compose exec dashboard chown -R nextjs:nodejs /app/data/ || true
    
    # Try to fetch airlines data, if it fails due to permissions, fix and retry
    if ! docker compose exec dashboard npm run fetch-airlines; then
        print_warning "Airlines fetch failed, attempting to fix permissions..."
        
        # Create the airlines.json file with proper permissions if it doesn't exist
        docker compose exec dashboard touch /app/data/airlines.json
        docker compose exec dashboard chown nextjs:nodejs /app/data/airlines.json
        docker compose exec dashboard chmod 664 /app/data/airlines.json
        
        # Try again
        docker compose exec dashboard npm run fetch-airlines
    fi
    
    print_success "Airlines data fetched"
}

# Show status and next steps
show_status() {
    print_status "Checking system status..."
    
    echo ""
    echo "📊 System Status:"
    echo "================="
    
    # Show container status
    docker compose ps
    
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo "1. Edit .env file to set your Ultrafeeder IP address"
    echo "2. Access dashboard at: http://localhost:3000"
    echo "3. Check logs with: docker compose logs -f"
    echo "4. Stop services with: docker compose down"
    echo ""
    echo "🛠️  Useful Commands:"
    echo "===================="
    echo "• View logs: docker compose logs -f"
    echo "• Restart: docker compose restart"
    echo "• Update airlines: docker compose exec dashboard npm run fetch-airlines"
    echo "• Rebuild: docker compose up -d --build"
    echo ""
}

# Main setup function
main() {
    echo ""
    print_status "Starting ADS-B Dashboard setup..."
    
    check_docker
    create_data_dir
    setup_env
    start_containers
    wait_for_containers
    init_database
    fetch_airlines
    show_status
    
    echo ""
    print_success "🎉 Setup completed successfully!"
    print_status "You can now access your dashboard at http://localhost:3000"
    echo ""
}

# Run main function
main "$@" 