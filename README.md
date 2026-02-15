# 🏏 Box Cricket Booking System

A modern, full-stack web application for booking box cricket pitches. Built with **FastAPI** (Backend) and **React** (Frontend), featuring a premium neon-glassmorphism UI.

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
*   **Framework**: React (Vite)
*   **Styling**: Custom CSS (Glassmorphism, Neon Theme, Animations)
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

##  API Documentation

The backend provides a comprehensive, interactive API documentation interface via Swagger UI and ReDoc.

**Access Docs:** `http://localhost:8000/docs`

### Key Endpoints

#### 🔐 Authentication
*   **POST** `/token`: Login to receive an access token (OAuth2 Password Flow).
*   **POST** `/register`: Create a new user account.
*   **GET** `/users/me`: Retrieve current user profile.

#### 📅 Slots (Admin)
*   **POST** `/slots/`: Create a new time slot with Price.
*   **GET** `/slots/`: List all available (unbooked) slots.

#### 🎟️ Bookings
*   **POST** `/bookings/`: Book a specific slot (Requires Auth).
*   **GET** `/bookings/my`: Retrieve the logged-in user's booking history.
*   **GET** `/bookings/all`: (Admin Only) Retrieve global booking history with user details.

### Schema Details
All API responses and request bodies are strictly typed using Pydantic models. You can view the full schema definitions (User, Slot, Booking, Token) directly in the `/docs` interface.

## 📄 License
This project is open-source and available under the MIT License.
