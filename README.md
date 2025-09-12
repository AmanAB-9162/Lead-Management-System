# Lead Management System (LMS)

A comprehensive Lead Management System built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, server-side pagination, filtering, and a modern responsive UI.

## 🚀 Features

### Authentication
- User registration and login
- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Protected routes and API endpoints

### Lead Management
- Complete CRUD operations for leads
- Server-side pagination and filtering
- Advanced search capabilities
- Lead scoring and qualification tracking
- Multiple lead sources and statuses

### Technical Features
- Modern React frontend with Vite
- TailwindCSS for styling
- AG Grid for data display
- Form validation with React Hook Form
- Responsive design
- Toast notifications
- Rate limiting and security middleware

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **AG Grid** - Data grid
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client

## 📁 Project Structure

```
lead-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── leadController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Lead.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── leads.js
│   ├── scripts/
│   │   └── seedDatabase.js
│   ├── package.json
│   ├── server.js
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
├── DEPLOYMENT.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lead_management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

5. **Seed the database** (in a new terminal):
   ```bash
   npm run seed
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:5173`

## 🔐 Test Credentials

After seeding the database:
- **Email**: test@example.com
- **Password**: password123

## 📊 API Endpoints

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

### Query Parameters for Leads
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `email` - Filter by email (contains)
- `company` - Filter by company (contains)
- `city` - Filter by city (contains)
- `status` - Filter by status (equals)
- `source` - Filter by source (equals)
- `score` - Filter by score (equals, gt, lt, between)
- `lead_value` - Filter by lead value (equals, gt, lt, between)
- `is_qualified` - Filter by qualification status
- `created_at` - Filter by creation date (on, before, after, between)
- `last_activity_at` - Filter by last activity date

## 🎨 UI Features

### Lead List Page
- Interactive data grid with AG Grid
- Server-side pagination
- Advanced filtering options
- Real-time search
- Status and source badges
- Action buttons for edit/delete

### Lead Form
- Comprehensive form with validation
- Personal and company information
- Lead scoring and qualification
- Source and status selection
- Responsive design

### Authentication
- Clean login/register interface
- Form validation
- Password visibility toggle
- Error handling with toast notifications

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- **Backend**: Render, Railway, or Heroku
- **Frontend**: Vercel
- **Database**: MongoDB Atlas

## 🔧 Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with test data

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Lead Schema

```javascript
{
  first_name: String (required)
  last_name: String (required)
  email: String (required, unique)
  phone: String
  company: String
  city: String
  state: String
  source: Enum ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other']
  status: Enum ['new', 'contacted', 'qualified', 'lost', 'won']
  score: Number (0-100)
  lead_value: Number
  last_activity_at: Date
  is_qualified: Boolean
  created_by: ObjectId (User reference)
  created_at: Date
  updated_at: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using the MERN stack**
