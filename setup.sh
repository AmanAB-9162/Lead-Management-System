#!/bin/bash

echo "🚀 Setting up Lead Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up environment files..."
cd ../backend
if [ ! -f .env ]; then
    cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead_management
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
EOF
    echo "✅ Created .env file in backend directory"
else
    echo "✅ .env file already exists"
fi

echo "🌱 Seeding database..."
npm run seed

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Test credentials:"
echo "Email: test@example.com"
echo "Password: password123"
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API will be available at: http://localhost:5000"
