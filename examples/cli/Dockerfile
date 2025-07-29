# rssm CLI Demo Dockerfile
FROM oven/bun:1-alpine

# Install git and nodejs for compatibility
RUN apk add --no-cache git nodejs npm

WORKDIR /app

# Copy package files and config
COPY ../../package.json ../../bun.lockb* ../../tsup.config.ts ../../tsconfig.json ./
COPY ../../cli/ ./cli/
COPY ../../src/ ./src/

# Install dependencies and build
RUN bun install
RUN bun run build

# Create a demo directory
WORKDIR /demo

# Create a sample project directory
RUN mkdir -p demo-app/src

# Create a demo script that shows various commands
RUN cat > demo.sh << 'EOF'
#!/bin/sh
echo "=== rssm CLI Demo ==="
echo "React Simple Schema State Machine"
echo ""
echo "1. Installing rssm globally..."
cd /app && bun link
cd /demo && bun link rssm
echo ""
echo "2. Checking rssm version:"
rssm --version
echo ""
echo "3. Showing help:"
rssm --help
echo ""
echo "4. Showing example usage:"
rssm example
echo ""
echo "5. Creating a new state machine (User):"
cd demo-app
echo "Command to create a state machine:"
echo "rssm create --name User --schema '{\"id\": \"string\", \"name\": \"string\", \"email\": \"string\"}'"
echo ""
echo "6. Interactive mode note:"
echo "The create command runs in interactive mode to help you configure:"
echo " - Schema definition"
echo " - Persistence options"
echo " - Encryption settings"
echo " - Logging preferences"
echo " - TTL (Time to Live) settings"
echo ""
echo "=== Demo Complete ==="
EOF

RUN chmod +x demo.sh

# Run the demo
CMD ["sh", "./demo.sh"]