# rssm cli Examples

This directory contains an example of the rssm cli tool.

## Contents

- `Dockerfile` - Docker container for running cli example
- `demo-screenshot.sh` - Script for capturing colorful example output
- `create-components.sh` - Example script showing cli usage
- `user-schema.json` - Example schema file for cli generation
- `demo-output/` - Generated output examples from the cli

## Running the Docker Demo

To run the containerized cli demo:

```bash
# Build the Docker image
docker build -t rssm-demo -f Dockerfile ../..

# Run the demo
docker run -t rssm-demo
```

## cli Usage Examples

See `create-components.sh` for practical examples of using the rssm cli to generate state management components.
