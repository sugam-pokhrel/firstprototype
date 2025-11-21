# WashGo API Documentation

## Base URL
- Local: `http://localhost:3000/api`
- Mobile (Hotspot): `http://192.168.137.1:3000/api` (or your computer's IP)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Auth Endpoints

### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567"
  }
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567"
  }
}
```

### GET /api/auth/me
Get current logged in user. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567"
  }
}
```

---

## Machine Endpoints

### GET /api/machines/nearby
Get nearby machines. **Public endpoint.**

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `radius` (optional): Search radius in km (default: 10)

**Example:**
```
GET /api/machines/nearby?latitude=37.7749&longitude=-122.4194&radius=10
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "machine_id",
      "machineType": "Washer & Dryer",
      "machineCount": 2,
      "pricePerHour": 5,
      "address": "123 Main St",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "description": "Clean machines",
      "available": true,
      "rating": 4.5,
      "reviews": 23,
      "owner": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1 (555) 123-4567"
      },
      "distance": 2.5
    }
  ]
}
```

### POST /api/machines
Register/List a new machine. **Requires authentication.**

**Request Body:**
```json
{
  "machineType": "Washer & Dryer",
  "machineCount": 2,
  "pricePerHour": 5,
  "address": "123 Main Street, San Francisco, CA",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "description": "Two high-capacity machines available. Clean and well-maintained."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "machine_id",
    "owner": "user_id",
    "machineType": "Washer & Dryer",
    "machineCount": 2,
    "pricePerHour": 5,
    "address": "123 Main Street, San Francisco, CA",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "description": "Two high-capacity machines available.",
    "available": true,
    "rating": 0,
    "reviews": 0,
    "createdAt": "2024-11-21T..."
  }
}
```

### GET /api/machines/my/machines
Get all machines listed by the current user. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "machine_id",
      "machineType": "Washer & Dryer",
      "machineCount": 2,
      "pricePerHour": 5,
      "address": "123 Main St",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "available": true
    }
  ]
}
```

### GET /api/machines/:id
Get machine by ID. **Public endpoint.**

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "machine_id",
    "machineType": "Washer & Dryer",
    "machineCount": 2,
    "pricePerHour": 5,
    "address": "123 Main St",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "owner": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567"
    }
  }
}
```

---

## Health Check

### GET /api/health
Check if server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

