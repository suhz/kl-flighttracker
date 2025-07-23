#!/bin/bash

echo "🛩️  Fetching airlines data inside Docker container..."
docker compose exec dashboard npm run fetch-airlines

echo ""
echo "✅ Airlines data updated successfully!"
echo "📊 The dashboard will now show airline information for aircraft." 