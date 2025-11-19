# Task Management API Documentation

## Overview
This is a RESTful API for task management with user authentication and role-based access control.

## Features
- User authentication (signup, login, logout)
- JWT-based authorization with HTTP-only cookies
- Role-based access control (user, admin)
- CRUD operations for tasks
- Pagination and filtering
- Search functionality

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file with:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Running the Server
```bash
npm run dev
```

### API Documentation
Visit `http://localhost:5000/api-docs` for interactive API documentation.

## Authentication
This API uses JWT tokens stored in HTTP-only cookies. After login/signup, the token is automatically included in subsequent requests.

## Rate Limiting
Currently no rate limiting is implemented. Consider adding it for production.

## Error Handling
All endpoints return consistent error responses:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error