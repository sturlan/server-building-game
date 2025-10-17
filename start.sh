#!/bin/bash

# Start script for 404 Click Game Backend
# This script starts the Flask backend server

echo "🚀 Starting 404 Click Game Backend..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
fi

# Check if backend.py exists
if [ ! -f "backend.py" ]; then
    echo "❌ Error: backend.py not found"
    exit 1
fi

# Make sure clicks.json is writable
touch clicks.json
chmod 664 clicks.json

echo "✅ Starting Flask backend on port 5000..."
echo "🌐 Backend will be available at: http://localhost:5000"
echo "📊 Click data will be stored in: $(pwd)/clicks.json"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

# Start the Flask backend
python3 backend.py
