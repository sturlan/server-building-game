# 404 Click Game - Server Builder

A fun, interactive 404 page where visitors help "build the server" by clicking. This static web game tracks clicks across all visitors and provides visual feedback and milestones.

## Features

- 🎮 **Interactive Click Game**: Visitors click to help build the server
- 📊 **Server-wide Click Tracking**: All clicks are counted together
- 🎯 **Milestone System**: Visual progress indicators and celebrations
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Clean, engaging design with animations
- 💾 **Fallback Storage**: Works with or without backend

## File Structure

```
webgame2/
├── index.html          # Main HTML structure
├── style.css           # CSS styling and animations
├── game.js            # JavaScript game logic
└── README.md          # This file
```

## Installation

### Quick Start (Development)

1. **Clone or download the project files**

2. **Start the backend server:**
   ```bash
   ./start.sh
   ```
   This will:
   - Create a Python virtual environment
   - Install Flask dependencies
   - Start the Flask backend on port 5000

3. **Start the frontend server (in another terminal):**
   ```bash
   python3 -m http.server 8000
   ```

4. **Open your browser:**
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:5000/api/clicks

### Production Deployment

#### Option 1: Static Files Only (No Backend)
1. **Copy files to your web server directory:**
   ```bash
   cp index.html style.css game.js /var/www/html/404/
   ```

2. **Configure your web server to serve the 404 page:**
   
   **Nginx:**
   ```nginx
   error_page 404 /404/index.html;
   ```
   
   **Apache:**
   ```apache
   ErrorDocument 404 /404/index.html
   ```

3. **Set proper permissions:**
   ```bash
   chmod 644 /var/www/html/404/*
   ```

#### Option 2: With Backend (Full Functionality)
1. **Install Python and dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the backend:**
   ```bash
   python3 backend.py
   ```

3. **Configure your web server to proxy API calls:**
   
   **Nginx:**
   ```nginx
   # Serve static files
   location / {
       root /path/to/webgame2;
       try_files $uri $uri/ /index.html;
   }
   
   # Proxy API calls to Flask backend
   location /api/ {
       proxy_pass http://localhost:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
   }
   ```

### For Reverse Proxy Setup

If using a reverse proxy, ensure the static files are served correctly:

```nginx
location /404/ {
    alias /path/to/webgame2/;
    try_files $uri $uri/ /404/index.html;
}
```

## Backend API

The game includes a complete Flask backend for server-wide click persistence. The backend stores click data in a single JSON file (`clicks.json`) with thread-safe file operations.

### API Endpoints

#### GET `/api/clicks`
Returns the current total click count.

**Response:**
```json
{
  "totalClicks": 1234,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

#### POST `/api/clicks`
Increments the click count.

**Request:**
```json
{
  "clicks": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "totalClicks": 1235,
  "success": true,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

#### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Backend Features

- **Thread-safe file operations** using `fcntl` file locking
- **Automatic file creation** if `clicks.json` doesn't exist
- **CORS support** for local development
- **Error handling** with graceful fallbacks
- **Health check endpoint** for monitoring

### Data Storage

The backend stores click data in `clicks.json`:
```json
{
  "totalClicks": 1234,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## Configuration

### Customizing Milestones

Edit the `milestones` array in `game.js`:

```javascript
this.milestones = [
    { clicks: 10, message: "First steps! 🎉", progress: 10 },
    { clicks: 50, message: "Getting momentum! 🚀", progress: 25 },
    // Add more milestones...
];
```

### Changing API Endpoint

Update the `apiBaseUrl` in `game.js`:

```javascript
this.apiBaseUrl = '/api'; // Change to your API base URL
```

### Customizing Visuals

Modify the CSS variables in `style.css` for different colors and themes:

```css
:root {
    --primary-color: #e74c3c;
    --secondary-color: #3498db;
    --success-color: #27ae60;
}
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## Troubleshooting

### Game Not Loading
- Check that all files are in the same directory
- Verify file permissions (644 for files)
- Check browser console for JavaScript errors

### Clicks Not Persisting
- Ensure backend API is running and accessible
- Check CORS settings if API is on different domain
- Verify API endpoints return correct JSON format

### Styling Issues
- Clear browser cache
- Check CSS file is loading correctly
- Verify responsive design on mobile devices

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!
