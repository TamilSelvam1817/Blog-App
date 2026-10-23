# BlogSpace — Full-Stack Blog Application ✍️

A full-stack blogging application built with Next.js, React, MongoDB, and Mongoose. Users can register, sign in, publish posts, and manage their own posts through a responsive web interface.

## Live Demo
- **Application:** https://blog-app-eight-bay.vercel.app/
- **Repository:** https://github.com/TamilSelvam1817/Blog-App

## Features
- Registration, login, and logout
- Password hashing with `bcryptjs`
- JWT authentication in an HTTP-only cookie
- Create, read, update, and delete blog posts
- Public blog listing and individual detail pages
- Personal dashboard
- Ownership-based authorization for editing and deleting posts
- Input validation and API error handling with Zod
- MongoDB integration using Mongoose
- Responsive UI with Tailwind CSS
- Deployment using Vercel and MongoDB Atlas

## Tech Stack
- **Framework:** Next.js App Router, React
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js Route Handlers
- **Database/ODM:** MongoDB, Mongoose
- **Authentication:** JWT, `bcryptjs`
- **Validation:** Zod
- **Deployment:** Vercel

## Run Locally
Prerequisites: Node.js, npm, Git, and local MongoDB or MongoDB Atlas.

```bash
git clone https://github.com/TamilSelvam1817/Blog-App.git
cd Blog-App
npm install
```

Create `.env.local` in the project root:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=replace_with_a_long_random_secret
```

Use your private Atlas URI if applicable. Never commit `.env.local`, database credentials, or JWT secrets. Keep secrets server-side and do not prefix them with `NEXT_PUBLIC_`.

Start development:
```bash
npm run dev
```

Open the URL shown in the terminal, usually `http://localhost:3000`.

Build:
```bash
npm run build
```

## API Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Get authenticated user |
| `GET` | `/api/blogs` | List public blogs |
| `GET` | `/api/blogs?mine=true` | List the signed-in user's blogs |
| `POST` | `/api/blogs` | Create a blog |
| `GET` | `/api/blogs/:id` | Get one blog |
| `PUT` | `/api/blogs/:id` | Update an owned blog |
| `DELETE` | `/api/blogs/:id` | Delete an owned blog |

Example JSON body:
```json
{
  "title": "The Importance of Artificial Intelligence",
  "content": "Artificial Intelligence is changing how people learn, work, and solve problems."
}
```

The backend should determine ownership from the authenticated user, not a client-supplied author ID.

## Deployment
1. Create/select a MongoDB Atlas database.
2. Set `MONGODB_URI` and `JWT_SECRET` in Vercel project environment variables.
3. Import this repository into Vercel.
4. Deploy and test registration, login, CRUD operations, and ownership restrictions.
5. Confirm production data is stored in Atlas, not only in local MongoDB.

Restrict database access where practical. Never publish connection strings, passwords, tokens, or secrets.

## Testing Checklist
- Register, log in, and log out
- View public blogs and individual posts
- Create, edit, and delete your own posts
- Use a second account to test ownership restrictions
- Test invalid input and incorrect credentials
- Verify production environment variables and database connectivity

## Developer
**Tamil Selvam D** · [GitHub](https://github.com/TamilSelvam1817) · [LinkedIn](https://www.linkedin.com/in/tamil-selvam-51b5b4291/?isSelfProfile=true)
