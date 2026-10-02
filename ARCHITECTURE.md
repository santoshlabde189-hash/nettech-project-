# Architecture

Browser (HTML/CSS/JS + Bootstrap) -> REST API (Express) -> MongoDB (Mongoose)

The frontend is static pages served by Express from `public/`. Pages call the API with `fetch` and send the JWT in the `Authorization: Bearer <token>` header.

## Folder layout
```
nettech-helpdesk/
├── AGENTS.md
├── README.md
├── .env.example
├── package.json
├── server.js
├── seed/adminSeed.js
├── config/db.js
├── models/        (User.js, Ticket.js)
├── routes/        (auth.js, users.js, tickets.js, dashboard.js)
├── controllers/
├── middleware/    (auth.js, role.js, errorHandler.js)
├── uploads/       (bonus: profile pictures)
├── public/
│   ├── index.html, login.html, register.html
│   ├── user/      (dashboard, raise-ticket, my-tickets, profile)
│   ├── admin/     (dashboard, tickets)
│   ├── css/
│   └── js/
└── docs/
```

## Key decisions
- JWT auth so the API stays stateless
- Role checks in middleware, not in the frontend only
- Vanilla JS with Bootstrap, no frontend framework
- MongoDB is reached through a connection string in `.env` (`MONGO_URI`), read only in `config/db.js`
- No Docker: the app runs directly with Node.js and npm
