@echo off
echo 🚀 Setting up Lead Management System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install

echo 🔧 Setting up environment files...
cd ..\backend
if not exist .env (
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/lead_management
        echo JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
        echo JWT_EXPIRE=7d
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo ✅ Created .env file in backend directory
) else (
    echo ✅ .env file already exists
)

echo 🌱 Seeding database...
call npm run seed

echo ✅ Setup complete!
echo.
echo To start the application:
echo 1. Start the backend: cd backend ^&^& npm run dev
echo 2. Start the frontend: cd frontend ^&^& npm run dev
echo.
echo Test credentials:
echo Email: test@example.com
echo Password: password123
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:5000
pause
