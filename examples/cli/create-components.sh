#!/bin/bash

echo "🚀 rssm CLI Demo - Creating State Machines"
echo "=========================================="
echo ""

# Simple UserPreferences component
echo "1️⃣  Creating a simple UserPreferences component..."
echo ""
node ../cli/bin/rssm.js create \
  --name UserPreferences \
  --schema '{"theme": "string", "language": "string", "notifications": "boolean"}' \
  --output ./state \
  --persist \
  --no-logging \
  --no-encrypt \
  <<< $'n\ny\n'

echo ""
echo "2️⃣  Creating a TodoList component with TTL..."
echo ""
node ../cli/bin/rssm.js create \
  --name TodoList \
  --schema '[{"id": "string", "text": "string", "completed": "boolean"}]' \
  --output ./state \
  --persist \
  --ttl 86400 \
  --no-logging \
  --no-encrypt \
  <<< $'y\n'

echo ""
echo "3️⃣  Creating a complex UserAccount component from file..."
echo ""
node ../cli/bin/rssm.js create \
  --name UserAccount \
  --schema ./user-schema.json \
  --output ./state \
  --persist \
  --logging \
  --encrypt \
  <<< $'y\n3600\ny\n'

echo ""
echo "✅ All components created! Check the ./state directory"