# WashGo Setup Guide

## Backend Server Setup

1. **Create `.env` file in `server/` directory:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/washgo
JWT_SECRET=washgo_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
```

2. **Make sure MongoDB is running:**
   - Install MongoDB if not already installed
   - Start MongoDB service: `mongod` or use MongoDB Compass

3. **Install backend dependencies:**
```bash
cd server
npm install
```

4. **Start the backend server:**
```bash
# From root directory
npm run server

# Or from server directory
cd server
npm start

# For development with auto-reload
npm run dev
```

The server will run on `http://localhost:3000`

## Frontend Setup

1. **Install frontend dependencies (if not already done):**
```bash
npm install
```

2. **Start the Expo app:**
```bash
npm start
```

## API Configuration

The frontend is configured to connect to `http://localhost:3000/api` by default.

For mobile devices (iOS/Android), you may need to:
- Use your computer's IP address instead of `localhost`
- Update `EXPO_PUBLIC_API_URL` in your environment or modify `src/services/api.js`

Example for mobile:
```javascript
// In src/services/api.js
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Replace with your IP
```

## Testing the Setup

1. Start MongoDB
2. Start the backend server: `npm run server`
3. Start the frontend: `npm start`
4. Test signup/login in the app

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `GET /api/health` - Health check

## Token Storage

Tokens are automatically stored in AsyncStorage after successful login/signup and are included in all API requests via the Authorization header.

