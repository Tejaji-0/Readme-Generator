#!/bin/bash

# Install Node.js dependencies
npm install

# Build TypeScript
npm run build

# Install Python dependencies
cd python
python -m pip install --upgrade pip
pip install -r requirements.txt

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install -r requirements.txt

echo "Build completed successfully!" 