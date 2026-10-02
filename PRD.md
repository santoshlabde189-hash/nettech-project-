# PRD: Nettech Help Desk

## Goal
Let employees raise IT support tickets and let admins track and resolve them, with a complete working flow from frontend to backend to database.

## Users
- Employee (role: user)
- Administrator (role: admin)

## Core features
### User module
- Register and login
- Raise a ticket (title, description, category)
- View own tickets and their status
- Edit profile (name, email, password)

### Admin module
- Login
- View all tickets
- Update ticket status
- Delete ticket
- Dashboard with statistics

### Shared
- Authentication (JWT)
- CRUD operations on users and tickets
- Search tickets (by title, ticket ID, status)
- Responsive UI (mobile, tablet, desktop)

## Ticket statuses
Open, In Progress, Resolved, Closed

## Dashboard statistics
Total tickets, count per status, count per priority, latest 5 tickets.

## Acceptance criteria
- Registration rejects duplicate emails and weak passwords
- A user cannot view, edit or delete another user's tickets
- Only an admin can change status, delete tickets or open the dashboard
- Search returns matching tickets for the current role's scope
- Pages are usable at 375px width

## Bonus features (only after core is done)
- Ticket priority (Low, Medium, High): field exists in schema from the start, UI added later
- Email notification to the user when status changes
- Profile picture upload

## Non-goals
Live chat, real-time notifications, multi-tenant support, payments, file attachments on tickets
