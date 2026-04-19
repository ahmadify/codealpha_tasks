# Task 1 - URL Shortener

This is a simple URL Shortener API built using Node.js, Express, and SQLite.

The project allows the user to:
- enter a long URL
- get a shortened URL
- use the short code to open the original URL
- view all saved URLs from the database

A small frontend page is also included to test the project from the browser.

## The Tools Used

- Node.js
- Express.js
- SQLite

## How to Run 

```bash
npm install
```

Then create a `.env` file in the project folder instead of `.env.example` and add:

```env
PORT=5000
BASE_URL=http://localhost:5000
```

Then run the server using this:

```bash
npm run dev
```


## The Endpoints

- `GET /`
- `POST /api/urls`
- `GET /api/urls`
- `GET /:code`

