# Database (MongoDB, Mongoose)

## User
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | bcrypt hash, never returned |
| role | String | `user` or `admin`, default `user` |
| profilePic | String | bonus, file path, optional |
| createdAt, updatedAt | Date | timestamps |

## Ticket
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | ref User, required |
| title | String | required |
| description | String | required |
| category | String | e.g. Hardware, Software, Network, Account, Other |
| status | String | `open`, `in_progress`, `resolved`, `closed`; default `open` |
| priority | String | `low`, `medium`, `high`; default `medium` |
| createdAt, updatedAt | Date | timestamps |

Add a text index on `title` and `description` for search.
