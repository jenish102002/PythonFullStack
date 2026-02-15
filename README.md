# 🏏 Box Cricket Booking System

A modern, full-stack web application for booking box cricket pitches. Built with **FastAPI** (Backend) and **React** (Frontend), featuring a premium neon-glassmorphism UI.

![Dashboard Screenshot](/Users/jenishpatel/.gemini/antigravity/brain/ba258173-8bc9-4486-8d69-bf879d1575f9/dashboard_initial_view_1771140591277.png)

## ✨ Features

### 👤 User Features
*   **User Registration & Login**: Secure JWT-based authentication.
*   **Modern Dashboard**: View available slots with a dynamic hero slider and neon visuals.
*   **Instant Booking**: Book cricket slots in real-time.
*   **Booking History**: Track all personal bookings and total spend.
*   **Responsive Design**: Works seamlessly on desktop and mobile.

### 🛡️ Admin Features
*   **Admin Dashboard**: Manage slot availability and pricing.
*   **Global Transaction History**: View all bookings across all users with customer details.
*   **Revenue Tracking**: Monitor total revenue generated.

## 🛠️ Tech Stack

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: SQLite (Async SQLAlchemy)
*   **Authentication**: OAuth2 with JWT (BCrypt hashing)
*   **Documentation**: Swagger UI / OpenAPI

### Frontend
*   **Framework**: React
*   **Styling**: Custom CSS
*   **State Management**: Context API
*   **HTTP Client**: Axios

## 🚀 Setup Instructions

### Prerequisites
*   Python 3.9+
*   Node.js & npm

### 1️⃣ Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*The backend will start at `http://localhost:8000`*

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start at `http://localhost:5173`*

## 🔑 Default Credentials

**Admin Account:**
*   **Username**: `Admin123`
*   **Password**: `Admin@123`

## 📖 API Documentation

Once the backend is running, you can access the interactive API docs at:
`http://localhost:8000/docs`

## 📸 Screenshots

### Booking Dashboard
Premium glass-morphism interface for slot selection.
![Dashboard](/Users/jenishpatel/.gemini/antigravity/brain/ba258173-8bc9-4486-8d69-bf879d1575f9/dashboard_initial_view_1771140591277.png)

### Payment History
Comprehensive tracking of all user transactions.
![Payment History](/Users/jenishpatel/.gemini/antigravity/brain/ba258173-8bc9-4486-8d69-bf879d1575f9/payment_history_page_1771143880849.png)

## 📄 License
This project is open-source and available under the MIT License.
