#!/bin/bash

# Setup script for airlines data cron job
# This script sets up a cron job to fetch airlines data daily

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🛩️  Setting up airlines data cron job..."

# Create the cron job entry
CRON_JOB="0 2 * * * cd $PROJECT_DIR && npm run fetch-airlines >> logs/airlines-update.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "fetch-airlines"; then
    echo "⚠️  Cron job already exists. Removing old entry..."
    crontab -l 2>/dev/null | grep -v "fetch-airlines" | crontab -
fi

# Add the new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added successfully!"
echo "📅 Airlines data will be updated daily at 2:00 AM"
echo "📝 Logs will be saved to logs/airlines-update.log"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Make the fetch script executable
chmod +x "$SCRIPT_DIR/fetch-airlines.js"

echo "🎉 Setup complete!"
echo ""
echo "To manually fetch airlines data now, run:"
echo "  npm run fetch-airlines"
echo ""
echo "To view cron jobs:"
echo "  crontab -l"
echo ""
echo "To remove the cron job:"
echo "  crontab -e" 