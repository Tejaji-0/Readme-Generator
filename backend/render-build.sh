#!/bin/bash
set -e  # Exit on any error

echo "Starting build process..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Install Python dependencies
echo "Setting up Python environment..."
cd python

# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
echo "Installing Python requirements..."
pip install -r requirements.txt

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt

echo "Build completed successfully!" 