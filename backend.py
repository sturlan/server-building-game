#!/usr/bin/env python3
"""
Simple Flask backend for 404 Click Game
Handles server-wide click persistence using a single JSON file
"""

import json
import os
import fcntl
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for local development

CLICKS_FILE = 'clicks.json'

def load_clicks():
    """Load click data from JSON file with file locking"""
    if not os.path.exists(CLICKS_FILE):
        # Create initial file if it doesn't exist
        initial_data = {
            "totalClicks": 0,
            "lastUpdated": datetime.now().isoformat()
        }
        with open(CLICKS_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)
        return initial_data
    
    try:
        with open(CLICKS_FILE, 'r') as f:
            fcntl.flock(f.fileno(), fcntl.LOCK_SH)  # Shared lock for reading
            data = json.load(f)
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)  # Release lock
            return data
    except (json.JSONDecodeError, FileNotFoundError):
        # If file is corrupted or missing, create new one
        initial_data = {
            "totalClicks": 0,
            "lastUpdated": datetime.now().isoformat()
        }
        with open(CLICKS_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)
        return initial_data

def save_clicks(data):
    """Save click data to JSON file with file locking"""
    try:
        with open(CLICKS_FILE, 'w') as f:
            fcntl.flock(f.fileno(), fcntl.LOCK_EX)  # Exclusive lock for writing
            json.dump(data, f, indent=2)
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)  # Release lock
        return True
    except Exception as e:
        print(f"Error saving clicks: {e}")
        return False

@app.route('/api/clicks', methods=['GET'])
def get_clicks():
    """Get current click count"""
    try:
        data = load_clicks()
        return jsonify({
            "totalClicks": data.get("totalClicks", 0),
            "lastUpdated": data.get("lastUpdated", datetime.now().isoformat())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/clicks', methods=['POST'])
def add_clicks():
    """Increment click count"""
    try:
        # Get current data
        data = load_clicks()
        
        # Get click increment from request
        request_data = request.get_json() or {}
        click_increment = request_data.get('clicks', 1)
        
        # Validate click increment
        if not isinstance(click_increment, int) or click_increment < 0:
            click_increment = 1
        
        # Update click count
        data['totalClicks'] += click_increment
        data['lastUpdated'] = datetime.now().isoformat()
        
        # Save to file
        if save_clicks(data):
            return jsonify({
                "totalClicks": data['totalClicks'],
                "success": True,
                "lastUpdated": data['lastUpdated']
            })
        else:
            return jsonify({"error": "Failed to save clicks"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    print("Starting Flask backend for 404 Click Game...")
    print(f"Click data will be stored in: {os.path.abspath(CLICKS_FILE)}")
    print("Backend running on: http://localhost:5000")
    print("API endpoints:")
    print("  GET  /api/clicks - Get current click count")
    print("  POST /api/clicks - Increment click count")
    print("  GET  /api/health - Health check")
    print("\nPress Ctrl+C to stop the server")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
