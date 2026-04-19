const express = require("express")
const router = express.Router()
const db = require("../db")

router.post("/", (req, res) => {
  const { user_id, event_id } = req.body

  if (!user_id || !event_id) {
    return res.status(400).json({ error: "user_id and event_id are required" })
  }

  const checkEventSql = "SELECT * FROM events WHERE id = ?"
  const checkUserSql = "SELECT * FROM users WHERE id = ?"

  db.get(checkUserSql, [user_id], (userErr, userRow) => {
    if (userErr) {
      return res.status(500).json({ error: "Failed to validate user" })
    }

    if (!userRow) {
      return res.status(404).json({ error: "User not found" })
    }

    db.get(checkEventSql, [event_id], (eventErr, eventRow) => {
      if (eventErr) {
        return res.status(500).json({ error: "Failed to validate event" })
      }

      if (!eventRow) {
        return res.status(404).json({ error: "Event not found" })
      }

      const countSql = "SELECT COUNT(*) AS total FROM registrations WHERE event_id = ?"

      db.get(countSql, [event_id], (countErr, countRow) => {
        if (countErr) {
          return res.status(500).json({ error: "Failed to check event capacity" })
        }

        if (countRow.total >= eventRow.capacity) {
          return res.status(400).json({ error: "Event is full" })
        }

        const insertSql = "INSERT INTO registrations (user_id, event_id) VALUES (?, ?)"

        db.run(insertSql, [user_id, event_id], function (insertErr) {
          if (insertErr) {
            if (insertErr.message.includes("UNIQUE")) {
              return res.status(400).json({ error: "User already registered for this event" })
            }

            return res.status(500).json({ error: "Failed to create registration" })
          }

          res.status(201).json({
            message: "Registration created successfully",
            registrationId: this.lastID
          })
        })
      })
    })
  })
})

router.get("/users/:id", (req, res) => {
  const sql = `
    SELECT
      registrations.id AS registration_id,
      events.id AS event_id,
      events.title,
      events.description,
      events.event_date,
      events.location,
      events.capacity,
      registrations.created_at
    FROM registrations
    JOIN events ON registrations.event_id = events.id
    WHERE registrations.user_id = ?
    ORDER BY events.event_date ASC
  `

  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch registrations" })
    }

    res.json(rows)
  })
})

router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM registrations WHERE id = ?"

  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to cancel registration" })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Registration not found" })
    }

    res.json({ message: "Registration cancelled successfully" })
  })
})

module.exports = router