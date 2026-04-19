# Event Registration System

Simple backend project built with Express.js and SQLite.

## What it does

This API lets you:
- create and view events
- create and view users
- register a user for an event
- view a user's registrations
- cancel a registration

## How to run

```bash
npm install
npm run dev
```
The server runs on: (http://localhost:5000)

You should create a `.env` file and put: PORT=5000

## Main routes:

- GET /api/events
- GET /api/events/:id
- POST /api/events

- GET /api/users
- GET /api/users/:id
- POST /api/users

- POST /api/registrations
- GET /api/registrations/users/:id
- DELETE /api/registrations/:id
