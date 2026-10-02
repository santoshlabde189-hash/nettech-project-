# REST API

Base path: `/api`. Protected routes need `Authorization: Bearer <token>`.
Errors return `{ "message": "..." }` with a proper status code.

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | /auth/register | public | Register a user |
| POST | /auth/login | public | Login (user or admin), returns token and role |
| GET | /users/me | user, admin | Get own profile |
| PUT | /users/me | user, admin | Edit profile |
| POST | /users/me/avatar | user | Bonus: upload profile picture |
| POST | /tickets | user | Raise a ticket |
| GET | /tickets/mine?search=&status= | user | Own tickets, searchable |
| GET | /tickets/:id | owner, admin | Single ticket |
| GET | /tickets?search=&status=&priority= | admin | All tickets, searchable |
| PUT | /tickets/:id/status | admin | Update status |
| DELETE | /tickets/:id | admin | Delete ticket |
| GET | /dashboard/stats | admin | Dashboard statistics |

## Example: POST /tickets
Request: `{ "title": "VPN not working", "description": "...", "category": "Network", "priority": "high" }`
Response 201: the created ticket object.
