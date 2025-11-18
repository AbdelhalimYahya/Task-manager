# Task Management API - Deployment Guide

## Overview
This is a Node.js Express application with MongoDB for task management. It includes authentication, role-based access control, pagination, and comprehensive logging.

## Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- MongoDB Atlas account (or local MongoDB)

## Quick Start with Docker

### 1. Clone the repository
```bash
git clone <repository-url>
cd Task
```

### 2. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```dotenv
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-db
PORT=5000
JWT_SECRET=your_very_secret_key_here
NODE_ENV=production
MONGO_USER=admin
MONGO_PASSWORD=your_password
```

### 3. Build and run with Docker Compose
```bash
docker-compose up -d
```

This will:
- Build the Node.js application image
- Start the app container on port 5000
- Start MongoDB container on port 27017
- Create a shared network between services

### 4. Verify the application
```bash
curl http://localhost:5000/health
```

## Manual Docker Commands

### Build the image
```bash
docker build -t task-app:latest .
```

### Run the container
```bash
docker run -d \
  --name task-app \
  -p 5000:5000 \
  -e MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-db \
  -e JWT_SECRET=your_secret_key \
  -e NODE_ENV=production \
  task-app:latest
```

## Local Development

### Install dependencies
```bash
npm install
```

### Start in development mode
```bash
npm run dev
```

### Start in production mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks/dashboard?page=1&limit=10&status=pending` - Get all tasks (admin only)
- `GET /api/tasks/:userId?page=1&limit=10` - Get tasks for a specific user
- `POST /api/tasks/create` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status (pending, in progress, completed)
- `search` - Search in title and description

## Logging
Logs are written to:
- Console output
- `combined.log` - All logs
- `error.log` - Error logs only

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing secret | `super_secret_key` |
| `NODE_ENV` | Environment type | `production` |
| `MONGO_USER` | MongoDB username (Docker) | `admin` |
| `MONGO_PASSWORD` | MongoDB password (Docker) | `password123` |

## Docker Compose Services

### app
- Container name: `task-app`
- Port: 5000
- Depends on: MongoDB
- Auto-restart: enabled

### mongodb
- Container name: `task-mongodb`
- Port: 27017
- Volume: `mongodb-data` (persists database)
- Auto-restart: enabled

## Production Deployment Tips

1. **Change JWT_SECRET** - Use a strong, random string
2. **Update CORS settings** - Change `origin: "*"` to your frontend domain
3. **Enable HTTPS** - Use a reverse proxy (Nginx, Apache)
4. **Database backups** - Setup MongoDB Atlas automated backups
5. **Monitoring** - Setup log aggregation and monitoring
6. **Scaling** - Use Docker Swarm or Kubernetes for multiple instances

## Troubleshooting

### Container won't start
```bash
docker logs task-app
```

### MongoDB connection failed
- Verify `MONGO_URI` is correct
- Check network connectivity
- Ensure MongoDB is running

### Port already in use
```bash
docker-compose down
# Change PORT in .env and try again
```

### Clear Docker resources
```bash
docker-compose down -v  # Removes containers and volumes
```

## Contributing
1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Push and create a pull request
