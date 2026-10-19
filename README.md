# BlogSpace -- Full-Stack Blog Application

BlogSpace is a full-stack blogging application built with **Next.js**,
**MongoDB**, and **Mongoose**. Users can register, log in, publish blog
posts, and manage their own posts through a responsive web interface.

## Live Demo

- **Live Application:** [https://blog-app-eight-bay.vercel.app/](https://blog-app-eight-bay.vercel.app/)
- **GitHub Repository:** [https://github.com/TamilSelvam1817/Blog-App](https://github.com/TamilSelvam1817/Blog-App)

## Features

-   User registration, login, and logout
-   Password hashing with `bcryptjs`
-   JWT-based authentication using an HTTP-only cookie
-   Create, read, update, and delete blog posts
-   Public blog listing and individual blog detail pages
-   Personal dashboard for managing your own posts
-   Authorization: users can update or delete only their own posts
-   Input validation and API error handling with Zod
-   MongoDB database integration with Mongoose
-   Responsive interface built with Next.js and Tailwind CSS
-   Production deployment using Vercel and MongoDB Atlas

## Tech Stack

-   **Framework:** Next.js (App Router), React
-   **Language:** JavaScript
-   **Styling:** Tailwind CSS
-   **Backend:** Next.js Route Handlers (REST APIs)
-   **Database:** MongoDB
-   **ODM:** Mongoose
-   **Authentication:** JSON Web Tokens (JWT), `bcryptjs`
-   **Validation:** Zod
-   **Deployment:** Vercel
-   **Version control:** Git and GitHub

## Getting Started Locally

### Prerequisites

Install the following before running the project:

-   Node.js (LTS recommended)
-   npm
-   MongoDB running locally, or a MongoDB Atlas database
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/TamilSelvam1817/Blog-App.git
cd Blog-App
```

If your local project folder or repository URL differs, use your actual
path and repository URL.

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a file named `.env.local` in the project root (the same folder as
`package.json`):

``` env
MONGODB_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=replace_with_a_long_random_secret
```

For local development, the MongoDB URI above assumes MongoDB is running
on your computer. If you use MongoDB Atlas, use your private Atlas
connection string instead.

Generate a strong JWT secret locally with Node.js:

``` bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into `.env.local`. **Never commit `.env.local`,
database credentials, or JWT secrets to GitHub.** Keep secret variables
server-side; do not prefix them with `NEXT_PUBLIC_`.

### 4. Start the development server

``` bash
npm run dev
```

Open the local URL shown in the terminal (usually
`http://localhost:3000`). If port 3000 is already in use, Next.js may
select another available port.

### 5. Create a production build

Stop the development server with `Ctrl+C`, then run:

``` bash
npm run build
```

Fix any build errors before deploying.

## API Endpoints

The API is implemented with Next.js Route Handlers.

  ------------------------------------------------------------------------------
  Method            Endpoint                 Purpose           Authentication
  ----------------- ------------------------ ----------------- -----------------
  POST              `/api/auth/register`     Register a user   No

  POST              `/api/auth/login`        Log in and set    No
                                             the               
                                             authentication    
                                             cookie            

  POST              `/api/auth/logout`       Log out and clear No
                                             the cookie        

  GET               `/api/auth/me`           Get the currently Yes
                                             authenticated     
                                             user              

  GET               `/api/blogs`             Get the public    No
                                             blog list         

  GET               `/api/blogs?mine=true`   Get the signed-in Yes
                                             user's blogs      

  POST              `/api/blogs`             Create a blog     Yes

  GET               `/api/blogs/:id`         Get one blog by   No
                                             ID                

  PUT               `/api/blogs/:id`         Update a blog     Yes, owner only
                                             owned by the      
                                             signed-in user    

  DELETE            `/api/blogs/:id`         Delete a blog     Yes, owner only
                                             owned by the      
                                             signed-in user    
  ------------------------------------------------------------------------------

### Example blog request body

Use JSON when creating or updating a blog:

``` json
{
  "title": "The Importance of Artificial Intelligence",
  "content": "Artificial Intelligence is changing the way people learn, work, and solve problems."
}
```

The author is associated with the authenticated user by the backend; do
not trust a client-supplied author ID for ownership.

## Deployment (GitHub + MongoDB Atlas + Vercel)

### 1. Push the project to GitHub

From the project root:

``` bash
git status
git add .
git commit -m "Update README and prepare deployment"
git push origin main
```

If Git reports that there is nothing to commit and everything is up to
date, the latest committed changes are already pushed. If your default
branch is not `main`, push the correct branch.

Before pushing, confirm `.env.local` is not staged or tracked.

### 2. Set up MongoDB Atlas

1.  Sign in at [MongoDB Atlas](https://www.mongodb.com/atlas).
2.  Create or select a project and create a database deployment.
3.  Create a database user with a strong password and only the
    permissions your application needs.
4.  Open **Connect → Drivers** (or **Connect your application**) and
    copy the connection string.
5.  Include the database name `blogapp` in the URI path.

Atlas URI template (replace the placeholders with your actual values):

``` text
mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/blogapp?retryWrites=true&w=majority
```

URL-encode special characters in the username or password when required.
Do not publish your real URI.

#### Atlas network access

Atlas must permit connections from the deployed application. Your home
computer's IP address does not automatically allow Vercel to connect.

-   Prefer fixed outbound IPs or private networking if supported by your
    Vercel plan and architecture.
-   `0.0.0.0/0` permits connection attempts from any IP and is less
    secure. Avoid leaving it enabled unnecessarily. If used temporarily
    for troubleshooting, use strong rotated credentials and restrict
    access afterward where possible.
-   Wait until the access-list change is active.

### 3. Import the repository into Vercel

1.  Sign in to [Vercel](https://vercel.com/dashboard).
2.  Choose **Add New → Project** and import `TamilSelvam1817/Blog-App`.
3.  Confirm the project root is the folder containing `package.json` and
    the framework is detected as Next.js.
4.  In **Project Settings → Environment Variables**, add the following
    for the **Production** environment:

``` text
MONGODB_URI = your private MongoDB Atlas connection string
JWT_SECRET = your newly generated strong secret
```

Use the actual values in the Vercel dashboard, not the placeholder text
above. Do not put secrets in source code or README files.

5.  Deploy the project. If you change environment variables later,
    trigger a new deployment so the changes take effect.

### 4. Test the live application

After Vercel reports the deployment as **Ready**, open the production
URL and test:

-   Register a new account
-   Log in and log out
-   View the public blog list and a blog detail page
-   Create a blog
-   Edit and delete your own blog
-   Confirm a different account cannot edit or delete your blog
-   Check validation, error messages, and dates

**Important:** Your local MongoDB data is not automatically copied to
MongoDB Atlas. Create production test data or migrate data deliberately.

## Troubleshooting

  -----------------------------------------------------------------------
  Problem                             Things to check
  ----------------------------------- -----------------------------------
  Login is slow or fails in           Check Vercel runtime logs, Atlas
  production                          network access, database status,
                                      and the `MONGODB_URI` value.

  Authentication fails                Confirm the database
                                      username/password, URL-encoded
                                      special characters, and
                                      `JWT_SECRET` environment variable.

  Works locally but not on Vercel     Make sure Vercel uses the Atlas
                                      URI, not `localhost`, and that
                                      production environment variables
                                      are set.

  Blog list is empty                  Production Atlas data is separate
                                      from local MongoDB data; create a
                                      test blog in production.

  Build fails                         Open the Vercel build logs and fix
                                      the first relevant error, then push
                                      the correction and redeploy.
  -----------------------------------------------------------------------

Never share passwords, connection strings, JWT secrets, cookies, or
access tokens when asking for help. Share only sanitized error messages.

## Security Notes

-   Keep `.env.local` out of Git.
-   Use strong, unique database credentials and JWT secrets.
-   Rotate any secret that has been exposed in chat, screenshots, logs,
    or a repository.
-   Use least-privilege database credentials.
-   Restrict Atlas network access where practical.
-   Do not return internal error details or secrets to users.

## Useful Links

-   [GitHub repository](https://github.com/TamilSelvam1817/Blog-App)
-   [MongoDB Atlas](https://www.mongodb.com/atlas)
-   [Vercel Dashboard](https://vercel.com/dashboard)
-   [Vercel Environment Variables
    Documentation](https://vercel.com/docs/projects/environment-variables)
-   [Next.js Environment Variables
    Documentation](https://nextjs.org/docs/app/guides/environment-variables)
-   [MongoDB Atlas Connection
    Troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/)

------------------------------------------------------------------------

## Testing Instructions

### 1. Register an Account
- Open the [BlogSpace Live Application](https://blog-app-eight-bay.vercel.app/).
- Navigate to the registration page.
- Enter your name, email address, and password.
- Register and log in using your credentials.

### 2. Test Blog Operations
- **Create:** Create a blog with a title and content.
- **Read:** Open the homepage and view the published blog.
- **View Details:** Open the blog to verify its author, content, and timestamps.
- **Edit:** Open your dashboard and edit one of your own blogs.
- **Delete:** Delete one of your own blogs and verify that it is removed.

### 3. Test Authorization
- Register a second account.
- Log in with the second account and attempt to edit or delete the first account's blog.
- Verify that the application prevents unauthorized modifications.

### 4. Test Validation and Error Handling
- Try submitting empty or invalid form fields.
- Try logging in with incorrect credentials.
- Verify that appropriate validation messages or error responses are displayed.

--------------------------------------------------------------------------------

Built as a full-stack blog application project using Next.js and
MongoDB.
