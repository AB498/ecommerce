#!/bin/bash

echo "Rebuilding client application..."

# Navigate to client directory
cd client

# Install dependencies if needed
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

echo "Build completed!"

# Return to root directory
cd ..

echo "Client application has been rebuilt successfully."
