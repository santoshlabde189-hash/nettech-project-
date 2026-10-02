# Nettech Help Desk Ticket Management System

A full-stack IT help desk application built with Node.js, Express, MongoDB (Mongoose), and vanilla JavaScript with Bootstrap 5.

Employees can create an account, log in, raise support tickets with categories and priorities, track real-time resolution status, and update their profiles (including profile photos). Administrators can monitor help desk statistics and charts, inspect and update the status of all support tickets, and delete tickets when necessary.

---

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+), Bootstrap 5.3, Bootstrap Icons, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) stored locally and passed via `Authorization: Bearer <token>`, passwords hashed with `bcryptjs`
- **File Uploads**: `multer` for profile photo attachments
- **Email Notifications**: `nodemailer` for status transition alerts (SMTP configurable)

---

## Directory Structure
```text
nettech/
├── config/
│   └── db.js                 # MongoDB connection logic (reads MONGO_URI)
├── controllers/
│   ├── authController.js     # Register & login
│   ├── userController.js     # Profile management & avatar upload
│   ├── ticketController.js   # Ticket CRUD & status updates
│   └── dashboardController.js# Aggregated metrics for admin
├── middleware/
│   ├── auth.js               # JWT verification
│   ├── role.js               # Role guard (user / admin)
│   └── errorHandler.js       # Centralized JSON error response handler
├── models/
│   ├── User.js               # User schema with bcrypt hooks
│   └── Ticket.js             # Ticket schema with text index
├── public/
│   ├── css/
│   │   └── style.css         # Custom responsive styles & badges
│   ├── js/
│   │   └── main.js           # API fetch wrapper, toasts, role guards
│   ├── user/
│   │   ├── dashboard.html    # User ticket overview & metrics
│   │   ├── my-tickets.html   # User ticket search, filter & details
│   │   ├── raise-ticket.html # Form to submit new tickets
│   │   └── profile.html      # Profile details & avatar upload
│   ├── admin/
│   │   ├── dashboard.html    # Admin stats & Chart.js visualizations
│   │   └── tickets.html      # Admin ticket management & status updates
│   ├── index.html            # Landing page
│   ├── login.html            # Sign-in page
│   └── register.html         # Registration page
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── tickets.js
│   └── dashboard.js
├── seed/
│   └── adminSeed.js          # Admin account initial setup script
├── uploads/                  # Uploaded profile photos (.gitignore-managed)
├── utils/
│   ├── emailService.js       # Email notifications on status change
│   └── upload.js             # Multer upload configuration
├── .env.example
├── .gitignore
├── AGENTS.md
├── API.md
├── ARCHITECTURE.md
├── DATABASE.md
├── package.json
├── PRD.md
├── README.md
├── server.js
└── TASKS.md
```

---

## Prerequisites & Installation

1. **Prerequisites**:
   - [Node.js](https://nodejs.org/) (v16 or newer)
   - A MongoDB connection string (e.g. from MongoDB Atlas free tier or a local replica set).

2. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your values:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nettech?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_random_secret_string

   # Optional: Configure SMTP for Task 14 email notifications
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   SMTP_FROM="Nettech Support" <support@nettech.local>

   # Optional custom admin credentials for seed script:
   ADMIN_NAME="System Administrator"
   ADMIN_EMAIL=admin@nettech.com
   ADMIN_PASSWORD=Admin@123456
   ```

4. **Seed the Administrator Account**:
   Admins are never created via public registration. Run the seed script:
   ```bash
   npm run seed:admin
   ```
   *Default Admin credentials:*
   - **Email:** `admin@nettech.com`
   - **Password:** `Admin@123456`

5. **Start the Application**:
   Development mode with automatic reload:
   ```bash
   npm run dev
   ```
   Production mode:
   ```bash
   npm start
   ```

6. **Access the Portal**:
   Open your browser at [http://localhost:5000](http://localhost:5000).

---

## Features & Verification

| Module | Features Completed |
|---|---|
| **Authentication** | Registration with validation & duplicate prevention, JWT login, bcrypt password hashing, role-based page protection. |
| **User Capabilities** | Raise tickets with category and priority, view own tickets, live search and filter, view detailed status modal, edit profile and avatar. |
| **Admin Capabilities** | Dashboard with metric cards & Chart.js donut/bar charts, view all company tickets, live search, change lifecycle status (`open` -> `in_progress` -> `resolved` -> `closed`), delete tickets with modal confirmation. |
| **Security & Privacy** | Strict role guards (`middleware/role.js`), employees cannot access or delete other users' tickets, passwords never returned in responses, `.env` kept strictly in `.gitignore`. |
| **Bonus Features** | Priority selection & color badges (Task 13), automated email alert on ticket status change (Task 14), avatar image upload with file-type validation (Task 15). |
