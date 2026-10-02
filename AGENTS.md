# Nettech Help Desk Ticket Management System

Full stack help desk app. Employees raise support tickets; admins manage and resolve them.

## Tech stack
- Frontend: HTML, CSS, JavaScript (vanilla), Bootstrap 5
- Backend: Node.js + Express
- Database: MongoDB with Mongoose, connected through a MongoDB connection string (`MONGO_URI`) stored in `.env`
- Auth: JWT (in Authorization header), passwords hashed with bcrypt
- Uploads (bonus): multer
- Email (bonus): nodemailer

## Commands
- Install: `npm install`
- Run dev: `npm run dev` (nodemon)
- Start: `npm start`
- Env: copy `.env.example` to `.env` (PORT, MONGO_URI, JWT_SECRET)
- Run everything locally with Node.js and npm only. Do NOT use Docker: no Dockerfile, docker-compose or container setup

## Roles
- `user`: register, login, raise ticket, view OWN ticket status, edit profile
- `admin`: login, view all tickets, update status, delete ticket, dashboard

## Project docs (read before coding)
- docs/PRD.md: what to build and acceptance criteria
- docs/ARCHITECTURE.md: structure and folder layout
- docs/DATABASE.md: Mongoose schemas
- docs/API.md: REST endpoints
- docs/TASKS.md: ordered checklist, work top to bottom

## Database connection
- The owner provides the MongoDB connection string in `.env` as `MONGO_URI`
- Connect only in `config/db.js` with `mongoose.connect(process.env.MONGO_URI)`
- Never hardcode, print, log or commit the connection string; `.env` must be in `.gitignore`
- Do not run a local MongoDB server or install one; use the provided `MONGO_URI`
- If the connection fails, show a clear error and ask the owner to check `MONGO_URI` (and IP access in MongoDB Atlas, if used)

## Rules
- Do one task from docs/TASKS.md at a time; tick it off when done
- Follow docs/API.md and docs/DATABASE.md exactly; ask before changing them
- Never store plain-text passwords; never return password hashes in responses
- Validate all input on the server; return consistent JSON errors `{ "message": "..." }`
- Users can only access their own tickets; admin routes must check role in middleware
- Admin accounts are created by seed script, never through public registration
- Keep UI responsive using Bootstrap grid and components
- Do not build bonus features until all core tasks are done
- Keep code simple and commented; this is a learning project
