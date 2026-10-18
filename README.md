# BlogSpace — Full-Stack Blog Application

## Overview

BlogSpace is a full-stack blog application built with Next.js, MongoDB, and Mongoose. Users can register, log in, create blog posts, view published blogs, edit their own posts, and delete their own posts.

The application includes authentication, input validation, error handling, and ownership-based authorization.

## Features

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication using HTTP-only cookies
- Create, read, update, and delete blog posts
- Public blog listing and individual blog pages
- Personal dashboard for managing blog posts
- Edit and delete permissions restricted to the blog owner
- Input validation using Zod
- Created and updated timestamps
- Responsive user interface
- MongoDB integration using Mongoose

## Tech Stack

**Frontend**
- Next.js App Router
- React
- JavaScript
- Tailwind CSS

**Backend**
- Next.js Route Handlers
- Node.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Zod

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB running locally or an accessible MongoDB database
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd blog-app
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=replace_with_a_long_random_secret
```

Use a strong, randomly generated JWT secret. If you use a cloud database, replace the MongoDB URI with your database connection string.

Never commit `.env.local` or expose your database credentials and JWT secret.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal. For example:

http://localhost:3000

If port 3000 is already occupied, Next.js may use another available port.

## Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/register` | Create an account |
| `/login` | Log in |
| `/blogs` | View published blogs |
| `/blogs/[id]` | View a specific blog |
| `/blogs/create` | Create a blog |
| `/dashboard` | Manage your own blogs |

## REST API Documentation

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get the authenticated user |

### Blogs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blogs` | Retrieve blogs |
| GET | `/api/blogs?mine=true` | Retrieve the authenticated user's blogs |
| POST | `/api/blogs` | Create a blog; authentication required |
| GET | `/api/blogs/:id` | Retrieve a specific blog |
| PUT | `/api/blogs/:id` | Update your own blog |
| DELETE | `/api/blogs/:id` | Delete your own blog |

### Example: Register

**Request**

`POST /api/auth/register`

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "ExamplePass123"
}
```

### Example: Create a blog

**Request**

`POST /api/blogs`

```json
{
  "title": "My First Blog",
  "content": "This is the content of my first blog post."
}
```

Send the request while authenticated. The author is determined from the authenticated user rather than trusted from client input.

### Example: Update a blog

**Request**

`PUT /api/blogs/:id`

```json
{
  "title": "Updated Blog Title",
  "content": "Updated blog content."
}
```

Only the authenticated owner can update the blog.

### Example: Delete a blog

**Request**

`DELETE /api/blogs/:id`

The request must be authenticated, and the authenticated user must own the blog.

## Security

- Passwords are hashed before storage.
- Authentication uses JWTs stored in HTTP-only cookies.
- Request data is validated before processing.
- Protected operations require authentication.
- Blog updates and deletions verify ownership on the server.
- Environment secrets must not be committed to version control.

## Data Models

### User

Stores the user's name, email, and hashed password, along with timestamps.

### Blog

Stores the blog title, content, author reference, creation timestamp, and update timestamp.

## Error Handling

The API uses appropriate HTTP status codes, including:

- `200 OK` — Successful request
- `201 Created` — Resource created
- `400 Bad Request` — Invalid input
- `401 Unauthorized` — Authentication required or invalid
- `403 Forbidden` — Authenticated user does not own the resource
- `404 Not Found` — Resource not found
- `409 Conflict` — Duplicate registration details
- `500 Internal Server Error` — Unexpected server error

Actual responses depend on the endpoint and error condition.

## Running in Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Configure the production environment variables and MongoDB connection before deployment.

## Author

Developed as a full-stack blog application technical assessment project.
