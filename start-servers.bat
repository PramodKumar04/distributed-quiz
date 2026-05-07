@echo off
echo ==========================================
echo Starting Distributed Quiz System (Backend)
echo ==========================================
echo Make sure MongoDB is installed and running on your machine (localhost:27017).
echo.

cd backend

echo 1. Installing Node dependencies...
call npm install

echo.
echo 2. Seeding the Database with a sample quiz...
call npm run seed

echo.
echo 3. Starting Auto-Scaling Node.js Load Balancer...
start "Auto-Scaling Load Balancer (Port 3000)" npm run lb

echo.
echo The Load Balancer will automatically spawn backend servers as traffic increases!
echo Access the application at: http://localhost:3000
echo.
echo Frontend files are now in the /frontend folder.
echo.
pause

