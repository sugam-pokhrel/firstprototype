# WashGo Backend Server

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the `server` directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/washgo
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

3. Make sure MongoDB is running on your system.

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /api/health` - Check if server is running

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time (default: 7d)

