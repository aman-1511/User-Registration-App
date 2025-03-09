# User Registration App

This is a full-stack user registration system built with React (frontend) and Node.js/Express (backend). The application features user authentication, authorization, and user management capabilities with a modern Material-UI interface.

## Features

- User authentication (Login/Register)
- Protected routes with JWT authentication
- User management (CRUD operations)
- Material-UI based responsive design
- Form validation
- Error handling
- User profile management

### Video Demo

https://github.com/user-attachments/assets/1aab8fb3-3de9-4c0e-a03f-f2e4b56bf143

Watch the demo video to see the application in action. The video demonstrates:
- User registration process
- Login functionality
- Profile management
- User dashboard navigation
- CRUD operations
- Responsive design across devices

## API Documentation

### Authentication Endpoints

#### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```
- **Response:** 
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### 3. Get User Profile
- **Endpoint:** `GET /api/auth/profile`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string"
}
```

### User Management Endpoints

#### 1. Get All Users
- **Endpoint:** `GET /api/users`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of user objects

#### 2. Get User by ID
- **Endpoint:** `GET /api/users/:id`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object

#### 3. Get Gender Options
- **Endpoint:** `GET /api/users/gender-options`
- **Access:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of gender options

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Local Development Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd User-Registration-App
```

2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

3. Frontend Setup
```bash
cd ../frontend
npm install
```

4. Running the Application

Backend:
```bash
cd Backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`



## Project Structure

```
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── theme/
│   │   └── App.js
│   └── package.json
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin resource sharing

### Frontend
- React
- Material-UI
- React Router DOM
- Formik & Yup for form validation
- Axios for API calls
- Context API for state management

## Project Overview

This project demonstrates a complete user registration system with modern web development practices, including:
- RESTful API architecture
- JWT-based authentication
- Protected routes
- Form validation
- Error handling
- Responsive design
- State management
- Security best practices

The application provides a solid foundation for user management and authentication that can be extended for various use cases.




