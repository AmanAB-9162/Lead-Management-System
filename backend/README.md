# Lead Management System - Backend

A comprehensive Lead Management System built with Node.js, Express, and MongoDB.

## Features

- JWT Authentication with httpOnly cookies
- CRUD operations for leads
- Server-side pagination and filtering
- Data validation and error handling
- Rate limiting and security middleware

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

3. Start the development server:
```bash
npm run dev
```

4. Seed the database with test data:
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Leads
- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads with pagination and filtering
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

## Test Credentials

After seeding the database:
- Email: test@example.com
- Password: password123

## Deployment

The backend is configured for deployment on Render, Railway, or Heroku. Make sure to set the environment variables in your deployment platform.
