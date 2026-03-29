# FlickScore - Full Stack Movie Review Web Application

FlickScore is a modern, responsive, and highly aesthetic movie review platform. Built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS, it offers a fast, user-friendly experience for discovering and reviewing movies.

## Key Features

- **Modern UI/UX**: Designed with sleek dark/light modes, beautiful gradients, glassmorphism, and micro-animations.
- **Authentication**: Secure JWT-based registration and login system.
- **Movie Catalog**: Browse, search, and filter movies by genre. Pagination included.
- **Review System**: Users can rate (1-5 stars) and write comments on movies. Includes a Like/Dislike system for reviews.
- **Admin Dashboard**: Specialized panel for admins to add, edit, and delete movies.
- **Image Uploads**: Integration with Cloudinary for handling movie posters.

## Tech Stack

**Frontend:**
- React (bootstrapped with Vite)
- Tailwind CSS
- React Router DOM
- Axios for API requests
- Lucide React (Icons)
- Context API for State Management (Auth, Theme)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose ORM)
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- Cloudinary & Multer for image uploads

## Step-by-Step Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account for image uploads

### 2. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd "Movie Review 01"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables Configuration

In the `backend` folder, you will find a `.env` file. You need to fill in your API keys:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/moviereviews  # Replace with Atlas URI if preferred
JWT_SECRET=supersecretjwtkey123
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Running the Application Locally

You need two terminals to run both servers concurrently.

**Terminal 1 (Backend Server):**
```bash
cd backend
node server.js
```
*The backend should default to running on `http://localhost:5000`.*

**Terminal 2 (Frontend Server):**
```bash
cd frontend
npm run dev
```
*The frontend will start on an available port (typically `http://localhost:5173`).*

### 5. API Documentation

#### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user (`name`, `email`, `password`)
- `POST /login`: Log in existing user (`email`, `password`)

#### Movie Routes (`/api/movies`)
- `GET /`: Fetch all movies (supports query params `?pageNumber=1&keyword=inception&genre=Action`)
- `GET /:id`: Fetch a single movie by ID
- `POST /`: Create a new movie (Admin only)
- `PUT /:id`: Update a movie (Admin only)
- `DELETE /:id`: Delete a movie (Admin only)

#### Review Routes (`/api/reviews`)
- `GET /:movieId`: Get all reviews for a specific movie
- `POST /`: Submit a review (`movieId`, `rating`, `comment`) - Requires Auth
- `PUT /:id`: Update your own review - Requires Auth
- `DELETE /:id`: Delete your own review (or any if Admin) - Requires Auth
- `POST /:id/like`: Toggle like on a review - Requires Auth
- `POST /:id/dislike`: Toggle dislike on a review - Requires Auth

#### Upload Routes (`/api/upload`)
- `POST /`: Upload an image to Cloudinary (returns image URL) - Requires Admin Auth (multipart/form-data)

---
Enjoy building and reviewing with FlickScore!
