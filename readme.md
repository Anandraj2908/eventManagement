# Event Management Application

This repository contains the codebase for an Event Management Application with a structured setup for both the frontend and backend.

## API Documentation

[API Documentation Link](https://event-management-api-documentation.vercel.app/installation)

## File Structure

```
frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── EditEventModal.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── NewAttendeeModal.jsx
│   │   ├── NewEventModal.jsx
│   │   ├── NewTaskModal.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── Attendees.jsx
│   │   ├── Events.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Manage.jsx
│   │   └── Signup.jsx
│   ├── store/
│   │   ├── authSlice.js
│   │   └── store.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
backend/
├── controllers/
│   ├── attendee.controller.js
│   ├── event.controller.js
│   ├── tasks.controller.js
│   └── user.controller.js
├── models/
│   ├── attendee.model.js
│   ├── event.model.js
│   ├── task.model.js
│   └── user.model.js
├── routers/
│   ├── attendee.router.js
│   ├── event.router.js
│   ├── tasks.router.js
│   └── user.router.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
├── .env
├── .gitignore
├── auth.middleware.js
├── index.js
├── package-lock.json
└── package.json
readme.md
```

## Frontend Setup
The frontend is built using Vite, React (JavaScript), and Tailwind CSS.

### Prerequisites
Ensure you have the following installed on your system:
- Node.js (>= 16.x)
- npm (>= 7.x)

### Installation Guide

1. **Navigate to the frontend folder:**
    ```bash
    cd frontend
    ```

2. **Initialize the project with Vite:**
    ```bash
    npm create vite@latest . -- --template react
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Install and configure Tailwind CSS:**
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init
    ```

5. **Modify `tailwind.config.js`** to include the content paths:
    ```javascript
    module.exports = {
      content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    ```

6. **Add Tailwind to your CSS:**
    Replace the content of `src/index.css` with:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

7. **Create a `.env` file:**
    ```env
    VITE_API_URL=localhost:8083
    ```
    or
    ```env
    VITE_API_URL=your_ipv4_address:8083
    ```
8. **Start the development server:**
    ```bash
    npm run dev
    ```

### Frontend `.env` Details
| Key           | Value                                    | Description                          |
|---------------|------------------------------------------|--------------------------------------|
| VITE_API_URL  | `localhost:8083`                          | Backend API endpoint                |

## Backend Setup
The backend is built with Node.js and MongoDB.

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- MongoDB (Community Edition or Atlas)

### Installation Guide

1. **Navigate to the backend folder:**
    ```bash
    cd backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Create a `.env` file:**
    ```env
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d
    PORT=8083
    MONGODB_URI=mongodb://localhost:27017/eventm
    ```

4. **Start the backend server:**
    ```bash
    npm start
    ```

### MongoDB Installation & Setup Guide
If MongoDB is not installed, refer to the following youtube video  guide:

[![MongoDB Installation and Setup Guide](https://i.ytimg.com/vi/1LiZRYzgM2o/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCvJg8SoeDiCFk6WO72nf-ohr6Jlw)](https://youtu.be/1LiZRYzgM2o?si=b7MhrCzZsELSTx7p)

### Backend `.env` Details
| Key                   | Value                                        | Description                      |
|-----------------------|----------------------------------------------|---------------------------------|
| PORT                  | `8083`                                       | Port on which the server runs   |
| MONGODB_URI                | `mongodb://localhost:27017/eventm`           | MongoDB connection string       |
| ACCESS_TOKEN_SECRET   | `your_access_token_secret`                   | Secret key for JWT tokens       |
| ACCESS_TOKEN_EXPIRY   | `time`                                       | Token expiration time           |

## Running the Application

1. **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```

2. **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:5173` (or the URL provided by Vite).


---
**Happy coding!** 🎉

